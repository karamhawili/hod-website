"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { FALLBACK_BLUR } from "@/lib/blur";
import type { VIEWER_PROJECTS_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./ProjectViewer.module.css";

type ViewerProject = VIEWER_PROJECTS_QUERY_RESULT[number];
type ViewerImage = NonNullable<ViewerProject["images"]>[number];

interface ProjectViewerProps {
  projects: VIEWER_PROJECTS_QUERY_RESULT;
  // Active landing filter — encoded into the return URL so the close ✕ lands
  // back on the same filtered rotation.
  category?: string;
}

// Matches the vertical track + horizontal frame slide durations in the CSS.
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

// useLayoutEffect on the server logs a warning; fall back to useEffect there.
// The deep-link hash read below only ever matters on the client anyway.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ProjectViewer({
  projects,
  category,
}: ProjectViewerProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  // Always start at 0 on the server (the hash isn't visible there); a deep-link
  // /#<slug> is applied before paint by the layout effect below.
  const [projectIndex, setProjectIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  // Horizontal (image) slide in flight: the frame left behind slides out while
  // the new active frame slides in. Vertical (project) slides no longer use
  // this — they translate the persistent row-track instead.
  const [outgoing, setOutgoing] = useState<{
    image: ViewerImage;
    title: string;
    axis: "x";
    dir: 1 | -1;
  } | null>(null);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelAccum = useRef(0);
  const wheelLast = useRef(0);
  const wheelEventLast = useRef(0);
  // Per-project horizontal position, remembered across vertical navigation and
  // read during render (so neighbour rows pre-mount the exact arrival image the
  // commit will land on — same key ⇒ the frame persists, no re-mount/blur).
  const [imageMemory, setImageMemory] = useState<Record<string, number>>({});
  // Vertical project-track animation: `trackShift` (−1/0/1 stage-heights) is
  // the live translate; `resetting` drops the transition for the single commit
  // frame; `dirHint` is which side the sole neighbour sits on when there are
  // exactly two projects (prev === next).
  const [trackShift, setTrackShift] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [dirHint, setDirHint] = useState<1 | -1>(1);
  const vSliding = useRef(false);
  const vSlideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vSlideRaf = useRef<number | null>(null);
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

  // The image a project shows on arrival: its remembered horizontal position,
  // clamped in case the gallery shrank under a live content update.
  const arrivalIndexFor = useCallback(
    (proj: ViewerProject) => {
      const len = proj.images?.length ?? 0;
      const remembered = imageMemory[proj._id] ?? 0;
      return remembered < len ? remembered : 0;
    },
    [imageMemory],
  );

  // Link to a project's detail page carrying a `from` return URL that restores
  // this exact filtered rotation + project (the close ✕ reads it). The project
  // rides in the hash (`/#<slug>`) — the same channel scroll uses — and the
  // category stays a query param (server-meaningful filter).
  const projectHref = (slug: string) => {
    const query = category
      ? `?${new URLSearchParams({ category }).toString()}`
      : "";
    const back = `/${query}#${encodeURIComponent(slug)}`;
    return `/project/${slug}?from=${encodeURIComponent(back)}`;
  };

  const beginSlide = useCallback(
    (dir: 1 | -1, image: ViewerImage, title: string) => {
      setOutgoing({ image, title, axis: "x", dir });
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
      outgoingTimer.current = setTimeout(() => setOutgoing(null), TRANSITION_MS);
    },
    [],
  );

  const goToImage = useCallback(
    (dir: 1 | -1) => {
      if (vSliding.current) return;
      if (images.length < 2 || !currentImage || !project) return;
      beginSlide(dir, currentImage, project.title);
      setImageIndex((index) => wrap(index + dir, images.length));
    },
    [images.length, currentImage, project, beginSlide],
  );

  // Vertical (project) navigation — translate the persistent row-track by one
  // slot, then commit + reset. `wrap()` looping is preserved because the window
  // only ever renders the immediate neighbours.
  const goToProject = useCallback(
    (dir: 1 | -1) => {
      if (vSliding.current || outgoing) return;
      if (projects.length < 2 || !project) return;

      vSliding.current = true;
      // Remember where the current project's carousel is, so it pre-mounts at
      // that image when it becomes a neighbour on the way back.
      setImageMemory((m) => ({ ...m, [project._id]: imageIndex }));
      // Two-project case: place the sole neighbour on the travelled side first
      // (instant, off-screen) so it enters from the right edge.
      if (dir !== dirHint) setDirHint(dir);
      setTrackShift(-dir);

      // Reduced motion: no track transition, so don't wait — commit next tick.
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (vSlideTimer.current) clearTimeout(vSlideTimer.current);
      vSlideTimer.current = setTimeout(() => {
        const nextIndex = wrap(projectIndex + dir, projects.length);
        const nextProj = projects[nextIndex];
        const nextLen = nextProj?.images?.length ?? 0;
        const remembered = imageMemory[nextProj._id] ?? 0;
        // Commit in one batched render: transition off, re-slot, shift back to
        // 0 — the centered neighbour stays put visually.
        setResetting(true);
        setProjectIndex(nextIndex);
        setImageIndex(remembered < nextLen ? remembered : 0);
        setTrackShift(0);
        vSlideRaf.current = requestAnimationFrame(() => {
          setResetting(false);
          vSliding.current = false;
        });
      }, reduced ? 0 : TRANSITION_MS);
    },
    [projects, projectIndex, imageIndex, project, outgoing, dirHint, imageMemory],
  );

  // The neighbour a drag reveals in `dir` — resolved in handlers (so render
  // never depends on it) and stored in drag state.
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
      const img = imgs[arrivalIndexFor(p)];
      return p && img ? { image: img, title: p.title } : null;
    },
    [project, images, imageIndex, projectIndex, projects, arrivalIndexFor],
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

  // Deep-link: honour a /#<slug> hash on load so a shared/refreshed URL — and
  // the close-✕ return round-trip, which now also rides the hash — lands on the
  // right project. Runs before paint to avoid a flash from project 0 to the
  // linked one. Can't seed useState from the hash — the server never sees it,
  // so that would hydration-mismatch.
  useIsomorphicLayoutEffect(() => {
    const slug = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!slug) return;
    const i = projects.findIndex((p) => p.slug === slug);
    if (i > 0) setProjectIndex(i);
    // Mount-only: a deep link is read once; later hash edits aren't tracked.
  }, []);

  // Reflect the current project in the URL hash as the rotation moves — one
  // place that covers wheel/touch/keyboard. Hash + replaceState is deliberate:
  // cheap, and does NOT trigger a Next navigation / server refetch (unlike a
  // query param). Skip the first run so a fresh "/" (or a hash we just honoured
  // above) stays untouched until the user actually navigates.
  const hashSynced = useRef(false);
  useEffect(() => {
    const slug = projects[projectIndex]?.slug;
    if (!slug) return;
    if (!hashSynced.current) {
      hashSynced.current = true;
      return;
    }
    const { pathname, search } = window.location;
    window.history.replaceState(
      null,
      "",
      `${pathname}${search}#${encodeURIComponent(slug)}`,
    );
  }, [projectIndex, projects]);

  useEffect(
    () => () => {
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
      if (snapTimer.current) clearTimeout(snapTimer.current);
      if (vSlideTimer.current) clearTimeout(vSlideTimer.current);
      if (vSlideRaf.current) cancelAnimationFrame(vSlideRaf.current);
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
        router.push(projectHref(project.slug));
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
          setImageMemory((m) => ({ ...m, [project._id]: imageIndex }));
          const nextIndex = wrap(projectIndex + dir, projects.length);
          const nextProj = projects[nextIndex];
          const nextLen = nextProj?.images?.length ?? 0;
          const remembered = imageMemory[nextProj._id] ?? 0;
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

  // Horizontal carousel offsets: the incoming frame enters from the edge the
  // navigation points at; the outgoing one exits the opposite way.
  const enterVars: React.CSSProperties = outgoing
    ? ({ "--enter-x": `${outgoing.dir * 100}vw` } as React.CSSProperties)
    : {};
  const exitVars: React.CSSProperties = outgoing
    ? ({ "--exit-x": `${outgoing.dir * -100}vw` } as React.CSSProperties)
    : {};

  // The persistent vertical window: current + its immediate neighbour(s). Two
  // projects share one neighbour (prev === next) placed on `dirHint`'s side;
  // three or more get distinct prev/next rows. Keyed by project id so the
  // incoming row is reused (already painted) across a commit.
  const len = projects.length;
  const rows: { proj: ViewerProject; slot: number }[] = [{ proj: project, slot: 0 }];
  if (len >= 2) {
    const nextIdx = wrap(projectIndex + 1, len);
    const prevIdx = wrap(projectIndex - 1, len);
    if (nextIdx === prevIdx) {
      rows.push({ proj: projects[nextIdx], slot: dirHint });
    } else {
      rows.push({ proj: projects[prevIdx], slot: -1 });
      rows.push({ proj: projects[nextIdx], slot: 1 });
    }
  }

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
          <div
            className={`${styles.track}${resetting ? ` ${styles.noTransition}` : ""}`}
            style={{ "--shift": trackShift } as React.CSSProperties}
          >
            {rows.map(({ proj, slot }) => {
              const isCurrent = proj._id === project._id;
              return (
                <div
                  key={proj._id}
                  className={styles.row}
                  style={{ "--slot": slot } as React.CSSProperties}
                >
                  {isCurrent ? (
                    <>
                      {/* Current project: whole gallery mounted; only the
                          active frame is visible, and horizontal nav animates
                          it in while the outgoing copy animates out. */}
                      {images.map((image, index) =>
                        renderFrame(
                          image,
                          proj.title,
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
                  ) : (
                    // Neighbour project: only its arrival image, pre-mounted so
                    // it's already painted when it slides to center.
                    (() => {
                      const arrival = proj.images?.[arrivalIndexFor(proj)];
                      return arrival
                        ? renderFrame(
                            arrival,
                            proj.title,
                            `${styles.frame} ${styles.active}`,
                          )
                        : null;
                    })()
                  )}
                </div>
              );
            })}
          </div>
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
          <Link href={projectHref(project.slug)} className={styles.cta}>
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
