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

// Matches the track transition duration in the module CSS.
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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const wheelAccum = useRef(0);
  const wheelLast = useRef(0);
  const wheelEventLast = useRef(0);
  // Per-project horizontal position, remembered across vertical navigation and
  // read during render (so a project pre-mounts at the exact arrival image the
  // commit lands on — same key ⇒ the frame persists, no re-mount/blur).
  const [imageMemory, setImageMemory] = useState<Record<string, number>>({});

  // Two persistent carousel tracks — vertical (projects) and horizontal
  // (images). Each: `*Shift` is the live translate (−1/0/1 track-lengths),
  // `*Resetting` drops the transition for the single commit frame, `*DirHint`
  // is which side the sole neighbour sits on when there are exactly two
  // (prev === next). Refs guard against overlapping slides.
  const [vShift, setVShift] = useState(0);
  const [vResetting, setVResetting] = useState(false);
  const [vDirHint, setVDirHint] = useState<1 | -1>(1);
  const vSliding = useRef(false);
  const vSlideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vSlideRaf = useRef<number | null>(null);

  const [hShift, setHShift] = useState(0);
  const [hResetting, setHResetting] = useState(false);
  const [hDirHint, setHDirHint] = useState<1 | -1>(1);
  const hSliding = useRef(false);
  const hSlideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hSlideRaf = useRef<number | null>(null);

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

  // Horizontal (image) navigation — translate the image track by one slot,
  // then commit + reset. `wrap()` looping preserved (only neighbours render).
  const goToImage = useCallback(
    (dir: 1 | -1) => {
      if (hSliding.current || vSliding.current) return;
      if (images.length < 2 || !project) return;

      hSliding.current = true;
      if (dir !== hDirHint) setHDirHint(dir);
      setHShift(-dir);
      const reduced = prefersReducedMotion();

      if (hSlideTimer.current) clearTimeout(hSlideTimer.current);
      hSlideTimer.current = setTimeout(
        () => {
          setHResetting(true);
          setImageIndex((index) => wrap(index + dir, images.length));
          setHShift(0);
          hSlideRaf.current = requestAnimationFrame(() => {
            setHResetting(false);
            hSliding.current = false;
          });
        },
        reduced ? 0 : TRANSITION_MS,
      );
    },
    [images.length, project, hDirHint],
  );

  // Vertical (project) navigation — translate the project track by one slot,
  // then commit + reset.
  const goToProject = useCallback(
    (dir: 1 | -1) => {
      if (vSliding.current || hSliding.current) return;
      if (projects.length < 2 || !project) return;

      vSliding.current = true;
      // Remember where the current project's carousel is, so it pre-mounts at
      // that image when it becomes a neighbour on the way back.
      setImageMemory((m) => ({ ...m, [project._id]: imageIndex }));
      if (dir !== vDirHint) setVDirHint(dir);
      setVShift(-dir);
      const reduced = prefersReducedMotion();

      if (vSlideTimer.current) clearTimeout(vSlideTimer.current);
      vSlideTimer.current = setTimeout(
        () => {
          const nextIndex = wrap(projectIndex + dir, projects.length);
          const nextProj = projects[nextIndex];
          const nextLen = nextProj?.images?.length ?? 0;
          const remembered = imageMemory[nextProj._id] ?? 0;
          setVResetting(true);
          setProjectIndex(nextIndex);
          setImageIndex(remembered < nextLen ? remembered : 0);
          setVShift(0);
          vSlideRaf.current = requestAnimationFrame(() => {
            setVResetting(false);
            vSliding.current = false;
          });
        },
        reduced ? 0 : TRANSITION_MS,
      );
    },
    [projects, projectIndex, imageIndex, project, vDirHint, imageMemory],
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
      if (snapTimer.current) clearTimeout(snapTimer.current);
      if (vSlideTimer.current) clearTimeout(vSlideTimer.current);
      if (hSlideTimer.current) clearTimeout(hSlideTimer.current);
      if (vSlideRaf.current) cancelAnimationFrame(vSlideRaf.current);
      if (hSlideRaf.current) cancelAnimationFrame(hSlideRaf.current);
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

  const renderFrame = (image: ViewerImage, title: string, priority = false) => (
    <figure
      key={image._key}
      className={`${styles.frame} ${styles.active}`}
      style={{ "--ar": String(image.dimensions?.aspectRatio ?? 1.5) } as React.CSSProperties}
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

  // Persistent vertical window: current + immediate neighbour project(s).
  const plen = projects.length;
  const projectRows: { proj: ViewerProject; slot: number }[] = [
    { proj: project, slot: 0 },
  ];
  if (plen >= 2) {
    const nextIdx = wrap(projectIndex + 1, plen);
    const prevIdx = wrap(projectIndex - 1, plen);
    if (nextIdx === prevIdx) {
      projectRows.push({ proj: projects[nextIdx], slot: vDirHint });
    } else {
      projectRows.push({ proj: projects[prevIdx], slot: -1 });
      projectRows.push({ proj: projects[nextIdx], slot: 1 });
    }
  }

  // Persistent horizontal window for the CURRENT project: current + immediate
  // neighbour image(s). Neighbour projects render only their arrival image.
  const ilen = images.length;
  const imageCells: { img: ViewerImage; slot: number }[] = currentImage
    ? [{ img: currentImage, slot: 0 }]
    : [];
  if (ilen >= 2 && currentImage) {
    const nextI = wrap(imageIndex + 1, ilen);
    const prevI = wrap(imageIndex - 1, ilen);
    if (nextI === prevI) {
      imageCells.push({ img: images[nextI], slot: hDirHint });
    } else {
      imageCells.push({ img: images[prevI], slot: -1 });
      imageCells.push({ img: images[nextI], slot: 1 });
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
          // Vertical project track. Every row (current + neighbours) mounts an
          // inner horizontal image track, so all frames are persistent,
          // already-painted, opacity-1 elements — a slide only translates a
          // track, never mounts or re-rasterizes a frame mid-animation.
          <div
            className={`${styles.track}${vResetting ? ` ${styles.noTransition}` : ""}`}
            style={{ transform: `translate3d(0, ${vShift * 100}%, 0)` }}
          >
            {projectRows.map(({ proj, slot }) => {
              const isCurrent = proj._id === project._id;
              const cells = isCurrent
                ? imageCells
                : (() => {
                    const arrival = proj.images?.[arrivalIndexFor(proj)];
                    return arrival ? [{ img: arrival, slot: 0 }] : [];
                  })();
              return (
                <div
                  key={proj._id}
                  className={styles.row}
                  style={{ "--slot": slot } as React.CSSProperties}
                >
                  <div
                    className={`${styles.htrack}${isCurrent && hResetting ? ` ${styles.noTransition}` : ""}`}
                    style={
                      isCurrent
                        ? { transform: `translate3d(${hShift * 100}%, 0, 0)` }
                        : undefined
                    }
                  >
                    {cells.map((cell) => (
                      <div
                        key={cell.img._key}
                        className={styles.hcell}
                        style={{ "--slot": cell.slot } as React.CSSProperties}
                      >
                        {renderFrame(
                          cell.img,
                          proj.title,
                          projectIndex === 0 && isCurrent && cell.slot === 0,
                        )}
                      </div>
                    ))}
                  </div>
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
