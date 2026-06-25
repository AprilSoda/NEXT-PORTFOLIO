import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaPlayButton,
  MediaFullscreenButton,
} from 'media-chrome/react';

// ┌──────────────────────────────────────────────────────────────────────┐
// │  CHANGE THE SHOWREEL VIDEO HERE                                        │
// │  Self-hosted MP4 on Cloudflare R2 (no YouTube UI). Swap this URL to    │
// │  change the reel — or set NEXT_PUBLIC_SHOWREEL_URL to override it.     │
// └──────────────────────────────────────────────────────────────────────┘
const SHOWREEL_SRC =
  process.env.NEXT_PUBLIC_SHOWREEL_URL ||
  'https://pub-c3b8ef19e7734097bf89d561c8f76ca8.r2.dev/video/2026_SHOWREEL_%EA%B9%80%ED%83%9C%EA%B7%A0.mp4';
const SHOWREEL_POSTER = process.env.NEXT_PUBLIC_SHOWREEL_POSTER || '';

export default function ModalShowreel({ isOpen, onClose }) {
  const videoRef = useRef(null);

  // Close on Escape while open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // The modal opens from a click (user gesture), so play with sound is allowed.
  useEffect(() => {
    if (!isOpen) return;
    const v = videoRef.current;
    if (v) {
      v.muted = false;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <MediaController className="showreel-player">
              <video
                ref={videoRef}
                slot="media"
                src={SHOWREEL_SRC}
                poster={SHOWREEL_POSTER || undefined}
                preload="auto"
                autoPlay
                playsInline
              />
              {/* Minimal controls: play/pause, scrubber, time, fullscreen only. */}
              <MediaControlBar>
                <MediaPlayButton />
                <MediaTimeRange />
                <MediaFullscreenButton />
              </MediaControlBar>
            </MediaController>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
