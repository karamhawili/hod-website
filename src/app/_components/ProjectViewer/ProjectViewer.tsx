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

// Matches the crossfade duration in the module CSS.
const TRANSITION_MS = 400;
// Wheel: one project step per gesture, then a cooldown so trackpad inertia
// doesn't fire a whole chain of steps.
const WHEEL_THRESHOLD = 50;
const WHEEL_COOLDOWN_MS = 700;
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
  // The image left behind by a project switch, kept mounted while it fades.
  const [outgoing, setOutgoing] = useState<{
    image: ViewerImage;
    title: string;
  } | null>(null);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelAccum = useRef(0);
  const wheelLast = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const project = projects[projectIndex] ?? null;
  const images = project?.images ?? [];
  const currentImage = images[imageIndex] ?? null;

  const goToImage = useCallback(
    (dir: 1 | -1) => {
      if (images.length < 2) return;
      setImageIndex((index) => wrap(index + dir, images.length));
    },
    [images.length],
  );

  const goToProject = useCallback(
    (dir: 1 | -1) => {
      if (projects.length < 2 || !currentImage || !project) return;
      setOutgoing({ image: currentImage, title: project.title });
      setProjectIndex((index) => wrap(index + dir, projects.length));
      setImageIndex(0);
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
      outgoingTimer.current = setTimeout(() => setOutgoing(null), TRANSITION_MS);
    },
    [projects.length, currentImage, project],
  );

  // Scroll interception — the ONE sanctioned scroll-jack (see REDESIGN.md).
  // Vertical wheel input maps to project navigation, horizontal to images.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = Date.now();
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

  // Warm the neighbouring projects' first images so project switches never
  // land on an empty frame.
  useEffect(() => {
    if (projects.length < 2) return;
    [1, -1].forEach((dir) => {
      const neighbour = projects[wrap(projectIndex + dir, projects.length)];
      const first = neighbour?.images?.[0];
      if (first?.asset) {
        const img = new window.Image();
        img.src = urlForSized(first, 2000);
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
    priority = false,
  ) => (
    <figure
      key={image._key}
      className={className}
      style={
        {
          "--ar": String(image.dimensions?.aspectRatio ?? 1.5),
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

  return (
    <div
      ref={rootRef}
      className={styles.viewer}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.stage} aria-hidden="true">
        {/* The whole current gallery stays mounted: crossfades between
            images come free, and siblings are preloaded by the browser. */}
        {images.map((image, index) =>
          renderFrame(
            image,
            project.title,
            index === imageIndex
              ? `${styles.frame} ${styles.active}`
              : styles.frame,
            projectIndex === 0 && index === 0,
          ),
        )}
        {outgoing &&
          renderFrame(
            outgoing.image,
            outgoing.title,
            `${styles.frame} ${styles.outgoing}`,
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
