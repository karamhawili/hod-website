"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor, urlForSized } from "@/sanity/lib/image";
import { FALLBACK_BLUR } from "@/lib/blur";
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
// Touch: below TAP = open project (no drag committed).
const TAP_THRESHOLD_PX = 10;
// Drag-follow: lock the gesture axis after this much movement; commit the
// navigation once the finger passes this fraction of the viewport, else spring
// back; the release snap animation lasts SNAP_MS.
const AXIS_LOCK_PX = 8;
// Commit if the finger travels this fraction of the viewport OR flicks faster
// than this (px/ms) — the flick makes short, quick swipes navigate too.
const DRAG_COMMIT_RATIO = 0.12;
const FLICK_VELOCITY = 0.5;
const SNAP_MS = 320;

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
  // Per-project horizontal position, remembered across vertical navigation.
  // A ref array: O(1) save/restore, no extra renders, no persistence beyond
  // the visit (which is the wanted scope).
  const imageMemory = useRef<number[]>([]);
  // Live drag-follow (touch): the finger drags the current frame while the
  // incoming neighbour follows in; on release it snaps forward (commit) or
  // back (cancel).
  const [drag, setDrag] = useState<{
    axis: "x" | "y";
    dir: 1 | -1;
    delta: number;
    snapping: boolean;
    incoming: { image: ViewerImage; title: string } | null;
  } | null>(null);
  const dragOrigin = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragAxis = useRef<"x" | "y" | "none" | null>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const project = projects[projectIndex] ?? null;
  const images = useMemo(() => project?.images ?? [], [project]);
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

  // The neighbour a drag reveals in `dir` — resolved in handlers (ref access)
  // and stored in drag state, so render never reads a ref.
  const resolveIncoming = useCallback(
    (axis: "x" | "y", dir: 1 | -1) => {
      if (!project) return null;
      if (axis === "x") {
        const img = images[wrap(imageIndex + dir, images.length)];
        return img ? { image: img, title: project.title } : null;
      }
      const nextIndex = wrap(projectIndex + dir, projects.length);
      const p = projects[nextIndex];
      const imgs = p?.images ?? [];
      const remembered = imageMemory.current[nextIndex] ?? 0;
      const img = imgs[remembered < imgs.length ? remembered : 0];
      return p && img ? { image: img, title: p.title } : null;
    },
    [project, images, imageIndex, projectIndex, projects],
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
      if (snapTimer.current) clearTimeout(snapTimer.current);
    },
    [],
  );

  // Touch drag-follow. `touch-action: none` on the viewer stops native
  // scrolling, so we track deltas directly and translate the frames live.
  const onTouchStart = (event: React.TouchEvent) => {
    if (drag?.snapping) return; // ignore new gestures mid-snap
    const touch = event.touches[0];
    dragOrigin.current = {
      x: touch.clientX,
      y: touch.clientY,
      t: performance.now(),
    };
    dragAxis.current = null;
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const origin = dragOrigin.current;
    if (!origin || !project) return;
    const touch = event.touches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;

    // Lock the axis on first real movement — but only if that axis is
    // navigable (>1 image / >1 project); otherwise the gesture is inert.
    if (!dragAxis.current) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK_PX) return;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      if (horizontal && images.length > 1) dragAxis.current = "x";
      else if (!horizontal && projects.length > 1) dragAxis.current = "y";
      else {
        dragAxis.current = "none";
        return;
      }
    }
    if (dragAxis.current === "none") return;

    const axis = dragAxis.current;
    const delta = axis === "x" ? dx : dy;
    const dir: 1 | -1 = delta < 0 ? 1 : -1;
    setDrag({
      axis,
      dir,
      delta,
      snapping: false,
      incoming: resolveIncoming(axis, dir),
    });
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const origin = dragOrigin.current;
    const axis = dragAxis.current;
    dragOrigin.current = null;
    dragAxis.current = null;
    if (!origin || !project) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;

    // No axis lock = a tap → open the project (ignore taps on the CTA link).
    if (!axis || axis === "none") {
      if (
        !axis &&
        Math.max(Math.abs(dx), Math.abs(dy)) < TAP_THRESHOLD_PX &&
        !(event.target as HTMLElement).closest("a")
      ) {
        router.push(`/project/${project.slug}`);
      }
      setDrag(null);
      return;
    }

    const delta = axis === "x" ? dx : dy;
    const dir: 1 | -1 = delta < 0 ? 1 : -1;
    const dim = axis === "x" ? window.innerWidth : window.innerHeight;
    const velocity = Math.abs(delta) / Math.max(1, performance.now() - origin.t);
    const commit =
      Math.abs(delta) >= dim * DRAG_COMMIT_RATIO || velocity >= FLICK_VELOCITY;

    if (snapTimer.current) clearTimeout(snapTimer.current);

    const incoming = resolveIncoming(axis, dir);

    if (commit) {
      // Snap the active frame fully off; the incoming one lands centered.
      setDrag({ axis, dir, delta: -dir * dim, snapping: true, incoming });
      snapTimer.current = setTimeout(() => {
        if (axis === "x") {
          setImageIndex((index) => wrap(index + dir, images.length));
        } else {
          imageMemory.current[projectIndex] = imageIndex;
          const nextIndex = wrap(projectIndex + dir, projects.length);
          const remembered = imageMemory.current[nextIndex] ?? 0;
          const nextLen = projects[nextIndex]?.images?.length ?? 0;
          setProjectIndex(nextIndex);
          setImageIndex(remembered < nextLen ? remembered : 0);
        }
        setDrag(null);
      }, SNAP_MS);
    } else {
      // Spring back to center.
      setDrag({ axis, dir, delta: 0, snapping: true, incoming });
      snapTimer.current = setTimeout(() => setDrag(null), SNAP_MS);
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
          placeholder="blur"
          blurDataURL={image.lqip ?? FALLBACK_BLUR}
          priority={priority}
        />
      )}
    </figure>
  );

  // ---- drag-follow render ----
  // A frame positioned by an inline transform (finger-tracked), with a snap
  // transition when releasing.
  const renderDragFrame = (
    image: ViewerImage,
    title: string,
    offset: string,
    key: string,
  ) => (
    <figure
      key={key}
      className={styles.frame}
      style={
        {
          "--ar": String(image.dimensions?.aspectRatio ?? 1.5),
          opacity: 1,
          willChange: "transform",
          transition: drag?.snapping ? `transform ${SNAP_MS}ms ease` : "none",
          transform:
            drag?.axis === "x"
              ? `translate(calc(-50% + ${offset}), -50%)`
              : `translate(-50%, calc(-50% + ${offset}))`,
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
          placeholder="blur"
          blurDataURL={image.lqip ?? FALLBACK_BLUR}
        />
      )}
    </figure>
  );

  const incomingBase = drag
    ? drag.axis === "x"
      ? `${drag.dir * 100}vw`
      : `${drag.dir * 100}dvh`
    : "0px";

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
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.stage} aria-hidden="true">
        {drag && currentImage ? (
          // Drag-follow: just the two moving frames (cheap to re-render per
          // touchmove) — the finger-tracked current image + the incoming one.
          <>
            {renderDragFrame(
              currentImage,
              project.title,
              `${drag.delta}px`,
              "drag-active",
            )}
            {drag.incoming &&
              renderDragFrame(
                drag.incoming.image,
                drag.incoming.title,
                `${incomingBase} + ${drag.delta}px`,
                "drag-incoming",
              )}
          </>
        ) : (
          <>
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
          </>
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
