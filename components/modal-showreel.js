import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaPipButton,
  MediaFullscreenButton,
} from 'media-chrome/react';

// Self-hosted showreel on Cloudflare R2 (no YouTube UI). Set
// NEXT_PUBLIC_SHOWREEL_URL (and optionally _POSTER) to your R2 files. The
// fallback sample keeps the player renderable in dev before the reel is uploaded.
const SHOWREEL_SRC =
  process.env.NEXT_PUBLIC_SHOWREEL_URL ||
  'https://download.samplelib.com/mp4/sample-5s.mp4'; // placeholder until the R2 reel URL is set
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
          <button className="modal-close" aria-label="Close showreel" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

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
              <MediaControlBar>
                <MediaPlayButton />
                <MediaSeekBackwardButton seekOffset={10} />
                <MediaSeekForwardButton seekOffset={10} />
                <MediaTimeRange />
                <MediaTimeDisplay showDuration />
                <MediaMuteButton />
                <MediaVolumeRange />
                <MediaPipButton />
                <MediaFullscreenButton />
              </MediaControlBar>
            </MediaController>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
