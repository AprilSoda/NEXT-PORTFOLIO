import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Persistent morphing FAB: "Play Showreel" that magnetically trails the cursor
// around its home spot; on open it becomes "Close" and flies to the top-right
// corner (above the modal); on close it morphs back and resumes following.
// Rendered client-only (gated by `mounted` in Hero) so window is always defined.
const SPRING = { stiffness: 140, damping: 20, mass: 0.5 };

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function ShowreelButton({ isOpen, onToggle }) {
  const homeX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const homeY = typeof window !== 'undefined' ? window.innerHeight * 0.62 : 0;
  const xRaw = useMotionValue(homeX);
  const yRaw = useMotionValue(homeY);
  const x = useSpring(xRaw, SPRING);
  const y = useSpring(yRaw, SPRING);
  const home = useRef({ x: homeX, y: homeY });

  // Keep the home point centered on resize.
  useEffect(() => {
    const setHome = () => {
      home.current = { x: window.innerWidth / 2, y: window.innerHeight * 0.62 };
      if (!isOpen) {
        xRaw.set(home.current.x);
        yRaw.set(home.current.y);
      }
    };
    window.addEventListener('resize', setHome);
    return () => window.removeEventListener('resize', setHome);
  }, [isOpen, xRaw, yRaw]);

  useEffect(() => {
    if (isOpen) {
      // Fly to the bottom-right corner and stay put while the modal is open.
      const margin = 36;
      const halfW = 64;
      const halfH = 26;
      xRaw.set(window.innerWidth - margin - halfW);
      yRaw.set(window.innerHeight - margin - halfH);
      return undefined;
    }

    // Closed: magnetic follow — pulled partway toward the cursor within a radius,
    // springing back home when the cursor moves away.
    xRaw.set(home.current.x);
    yRaw.set(home.current.y);
    const onMove = (e) => {
      const { x: hx, y: hy } = home.current;
      const dx = e.clientX - hx;
      const dy = e.clientY - hy;
      const dist = Math.hypot(dx, dy);
      const R = 320;
      const pull = 0.45;
      if (dist < R) {
        xRaw.set(hx + dx * pull);
        yRaw.set(hy + dy * pull);
      } else {
        xRaw.set(hx);
        yRaw.set(hy);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isOpen, xRaw, yRaw]);

  return (
    <motion.div
      className="showreel-fab"
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <button
        type="button"
        className={`showreel-fab__btn ${isOpen ? 'is-close' : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close showreel' : 'Play showreel'}
      >
        <span className="showreel-fab__icon">{isOpen ? <CloseIcon /> : <PlayIcon />}</span>
        <span className="showreel-fab__label">{isOpen ? 'Close' : 'Play Showreel'}</span>
      </button>
    </motion.div>
  );
}
