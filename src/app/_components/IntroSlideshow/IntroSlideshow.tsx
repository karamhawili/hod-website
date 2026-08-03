"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { FALLBACK_BLUR } from "@/lib/blur";
import Logo from "@/components/Logo/Logo";
import type { INTRO_SLIDESHOW_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./IntroSlideshow.module.css";

const SESSION_KEY = "hod-intro-seen";
const SLIDE_MS = 6000; // hold time per image before cross-fading to the next
const FADE_OUT_MS = 700; // dismiss fade — keep in sync with .dismissing in CSS
// Full-screen hero quality. AVIF/WebP (auto format) at this quality is visually
// near-lossless; lower it if the payload becomes a concern.
const IMAGE_QUALITY = 90;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface IntroSlideshowProps {
  images: NonNullable<INTRO_SLIDESHOW_QUERY_RESULT>;
}

// Full-screen intro shown once per session on the home page: images cross-fade
// every ~6s (infinite) until the visitor clicks to enter, which fades the whole
// screen out to reveal the site. Rendered above the nav (z-index) with its own
// logo positioned to match the nav's exactly, so nothing shifts on dismiss.
export default function IntroSlideshow({ images }: IntroSlideshowProps) {
  const [show, setShow] = useState(true);
  const [index, setIndex] = useState(0);
  const [dismissing, setDismissing] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Skip if already seen this session. Runs before paint so repeat (client-nav)
  // arrivals in the same session never flash the intro.
  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) setShow(false);
  }, []);

  // Auto-advance while visible. Held still under reduced-motion.
  useEffect(() => {
    if (!show || dismissing || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, [show, dismissing, images.length]);

  useEffect(
    () => () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    },
    [],
  );

  const dismiss = useCallback(() => {
    if (dismissing) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Private mode / storage disabled — the intro just won't be suppressed.
    }
    setDismissing(true);
    dismissTimer.current = setTimeout(() => setShow(false), FADE_OUT_MS);
  }, [dismissing]);

  if (!show || images.length === 0) return null;

  return (
    <div
      className={`${styles.intro}${dismissing ? ` ${styles.dismissing}` : ""}`}
      onClick={dismiss}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          dismiss();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Enter site"
    >
      <div className={styles.slides} aria-hidden="true">
        {images.map((img, i) => (
          <div
            key={img._key}
            className={styles.slide}
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {img.asset && (
              <Image
                // Serve straight from Sanity's CDN per srcset width (device-
                // appropriate size, AVIF/WebP, full quality) instead of
                // re-optimizing through Next — no double-encoding, no quality
                // cap. blurDataURL still handles the placeholder.
                loader={({ width }) =>
                  urlFor(img)
                    .width(width)
                    .quality(IMAGE_QUALITY)
                    .auto("format")
                    .url()
                }
                src={urlFor(img).url()}
                alt={img.alt ?? ""}
                fill
                sizes="100vw"
                className={styles.img}
                placeholder="blur"
                blurDataURL={img.lqip ?? FALLBACK_BLUR}
                priority={i === 0}
              />
            )}
          </div>
        ))}
      </div>

      <Logo className={styles.logo} />
    </div>
  );
}
