"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor, urlForSized } from "@/sanity/lib/image";
import type { VIEWER_PROJECTS_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./ProjectViewer.module.css";

type ViewerImage = NonNullable<
  VIEWER_PROJECTS_QUERY_RESULT[number]["images"]
>[number];

interface ProjectViewerProps {
  projects: VIEWER_PROJECTS_QUERY_RESULT;
}

// Matches the carousel slide duration in the module CSS.
const TRANSITION_MS = 900;
// Wheel: fire on the leading edge of a gesture (low threshold = the first
// real movement triggers, so there's no perceptible accumulation lag on a
// trackpad), then a cooldown so momentum doesn't fire a chain of steps. The
// cooldown is kept >= TRANSITION_MS so a new slide can't start mid-travel.
const WHEEL_THRESHOLD = 12;
const WHEEL_COOLDOWN_MS = 950;
// Reset the accumulator after this much wheel idle so a leftover sub-threshold
// nudge can't bias the direction of the next gesture.
const WHEEL_IDLE_RESET_MS = 150;
// Touch: below TAP = open project, above SWIPE = navigate.
const TAP_THRESHOLD_PX = 10;
const SWIPE_THRESHOLD_PX = 40;

const wrap = (index: number, length: number) =>
  ((index % length) + length) % length;

export default function ProjectViewer({ projects }: ProjectViewerProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [projectIndex, setProjectIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  // Carousel slide in flight: the frame left behind slides out along `axis`
  // while the new active frame slides in from the opposite edge.
  const [outgoing, setOutgoing] = useState<{
    image: ViewerImage;
    title: string;
    axis: "x" | "y";
    dir: 1 | -1;
  } | null>(null);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelAccum = useRef(0);
  const wheelLast = useRef(0);
  const wheelEventLast = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  // Per-project horizontal position, remembered across vertical navigation.
  // A ref array: O(1) save/restore, no extra renders, no persistence beyond
  // the visit (which is the wanted scope).
  const imageMemory = useRef<number[]>([]);

  const project = projects[projectIndex] ?? null;
  const images = project?.images ?? [];
  const currentImage = images[imageIndex] ?? null;

  const beginSlide = useCallback(
    (axis: "x" | "y", dir: 1 | -1, image: ViewerImage, title: string) => {
      setOutgoing({ image, title, axis, dir });
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
      outgoingTimer.current = setTimeout(() => setOutgoing(null), TRANSITION_MS);
    },
    [],
  );

  const goToImage = useCallback(
    (dir: 1 | -1) => {
      if (images.length < 2 || !currentImage || !project) return;
      beginSlide("x", dir, currentImage, project.title);
      setImageIndex((index) => wrap(index + dir, images.length));
    },
    [images.length, currentImage, project, beginSlide],
  );

  const goToProject = useCallback(
    (dir: 1 | -1) => {
      if (projects.length < 2 || !currentImage || !project) return;
      beginSlide("y", dir, currentImage, project.title);

      imageMemory.current[projectIndex] = imageIndex;
      const nextIndex = wrap(projectIndex + dir, projects.length);
      const remembered = imageMemory.current[nextIndex] ?? 0;
      const nextLength = projects[nextIndex]?.images?.length ?? 0;
      setProjectIndex(nextIndex);
      // Restore where that project's carousel was left (guarded in case the
      // gallery shrank under a live content update).
      setImageIndex(remembered < nextLength ? remembered : 0);
    },
    [projects, projectIndex, imageIndex, currentImage, project, beginSlide],
  );

  // Scroll interception — the ONE sanctioned scroll-jack (see REDESIGN.md).
  // Vertical wheel input maps to project navigation, horizontal to images.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = Date.now();
      // Drop stale accumulation from an earlier, unfinished nudge.
      if (now - wheelEventLast.current > WHEEL_IDLE_RESET_MS) {
        wheelAccum.current = 0;
      }
      wheelEventLast.current = now;

      if (now - wheelLast.current < WHEEL_COOLDOWN_MS) return;

      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      wheelAccum.current += horizontal ? event.deltaX : event.deltaY;
      if (Math.abs(wheelAccum.current) < WHEEL_THRESHOLD) return;

      const dir = wheelAccum.current > 0 ? 1 : -1;
      wheelAccum.current = 0;
      wheelLast.current = now;
      if (horizontal) {
        goToImage(dir);
      } else {
        goToProject(dir);
      }
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [goToImage, goToProject]);

  // Keyboard: ←/→ images, ↑/↓ projects.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          goToImage(-1);
          break;
        case "ArrowRight":
          goToImage(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          goToProject(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          goToProject(1);
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToImage, goToProject]);

  // Warm the image each neighbouring project would show on arrival (its
  // remembered position, or its first image) so switches never land blank.
  useEffect(() => {
    if (projects.length < 2) return;
    [1, -1].forEach((dir) => {
      const neighbourIndex = wrap(projectIndex + dir, projects.length);
      const neighbourImages = projects[neighbourIndex]?.images ?? [];
      const remembered = imageMemory.current[neighbourIndex] ?? 0;
      const target =
        neighbourImages[remembered < neighbourImages.length ? remembered : 0];
      if (target?.asset) {
        const img = new window.Image();
        img.src = urlForSized(target, 2000);
      }
    });
  }, [projectIndex, projects]);

  useEffect(
    () => () => {
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
    },
    [],
  );

  // Touch: horizontal swipe = image, vertical swipe = project, tap = open.
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !project) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < TAP_THRESHOLD_PX) {
      // Tap targets inside the caption (CTA link) handle themselves.
      if ((event.target as HTMLElement).closest("a")) return;
      router.push(`/project/${project.slug}`);
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) goToImage(dx < 0 ? 1 : -1);
    } else if (Math.abs(dy) >= SWIPE_THRESHOLD_PX) {
      goToProject(dy < 0 ? 1 : -1);
    }
  };

  if (!project) {
    return (
      <div className={styles.viewer}>
        <p className={styles.empty}>Projects coming soon.</p>
      </div>
    );
  }

  const renderFrame = (
    image: ViewerImage,
    title: string,
    className: string,
    slideVars: React.CSSProperties = {},
    priority = false,
  ) => (
    <figure
      key={image._key}
      className={className}
      style={
        {
          "--ar": String(image.dimensions?.aspectRatio ?? 1.5),
          ...slideVars,
        } as React.CSSProperties
      }
    >
      {image.asset && (
        <Image
          src={urlFor(image).width(2000).auto("format").url()}
          alt={image.alt ?? title}
          fill
          sizes="(max-width: 899px) 92vw, 60vw"
          className={styles.img}
          placeholder={image.lqip ? "blur" : undefined}
          blurDataURL={image.lqip ?? undefined}
          priority={priority}
        />
      )}
    </figure>
  );

  // Direction-aware carousel offsets: the incoming frame enters from the
  // edge the navigation points at; the outgoing one exits the opposite way.
  const enterVars: React.CSSProperties = outgoing
    ? outgoing.axis === "x"
      ? ({ "--enter-x": `${outgoing.dir * 100}vw` } as React.CSSProperties)
      : ({ "--enter-y": `${outgoing.dir * 100}dvh` } as React.CSSProperties)
    : {};
  const exitVars: React.CSSProperties = outgoing
    ? outgoing.axis === "x"
      ? ({ "--exit-x": `${outgoing.dir * -100}vw` } as React.CSSProperties)
      : ({ "--exit-y": `${outgoing.dir * -100}dvh` } as React.CSSProperties)
    : {};

  return (
    <div
      ref={rootRef}
      className={styles.viewer}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.stage} aria-hidden="true">
        {/* The whole current gallery stays mounted so siblings are already
            loaded when they slide in. Only the active frame is visible;
            during a slide it animates in while the outgoing copy animates
            out below. */}
        {images.map((image, index) =>
          renderFrame(
            image,
            project.title,
            index === imageIndex
              ? `${styles.frame} ${styles.active} ${outgoing ? styles.slideIn : ""}`
              : styles.frame,
            index === imageIndex ? enterVars : {},
            projectIndex === 0 && index === 0,
          ),
        )}
        {outgoing &&
          renderFrame(
            outgoing.image,
            outgoing.title,
            `${styles.frame} ${styles.slideOut}`,
            exitVars,
          )}
      </div>

      {/* Directional input zones (desktop pointer only — hidden on touch,
          where swipes/taps on the root take over). Band layout per the
          cursor-guidelines reference. */}
      <button
        className={`${styles.zone} ${styles.zoneUp}`}
        onClick={() => goToProject(-1)}
        aria-label="Previous project"
        tabIndex={-1}
      />
      <button
        className={`${styles.zone} ${styles.zoneLeft}`}
        onClick={() => goToImage(-1)}
        aria-label="Previous image"
        tabIndex={-1}
      />
      <button
        className={`${styles.zone} ${styles.zoneRight}`}
        onClick={() => goToImage(1)}
        aria-label="Next image"
        tabIndex={-1}
      />
      <button
        className={`${styles.zone} ${styles.zoneDown}`}
        onClick={() => goToProject(1)}
        aria-label="Next project"
        tabIndex={-1}
      />

      {/* Desktop: one stacked block bottom-right. Mobile: the same groups
          spread into a full-width bar (title/location left, year/CTA right) —
          handled entirely in CSS. */}
      <div className={styles.caption}>
        <div className={styles.captionGroup}>
          <h1 className={styles.title}>{project.title}</h1>
          {project.location && (
            <p className={styles.location}>{project.location}</p>
          )}
        </div>
        <div className={`${styles.captionGroup} ${styles.captionEnd}`}>
          {project.year && <p className={styles.year}>{project.year}</p>}
          <Link href={`/project/${project.slug}`} className={styles.cta}>
            Go to project
            <span className={styles.ctaIcon} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <p className={styles.srStatus} role="status" aria-live="polite">
        {project.title} — image {imageIndex + 1} of {images.length}
      </p>
    </div>
  );
}
