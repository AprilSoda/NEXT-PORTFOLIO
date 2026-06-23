// Global film-grain overlay — a fixed, very low-opacity SVG-noise layer over the
// whole page with a subtle CSS flicker. Cheap (no WebGL/canvas), pointer-events
// none, and the flicker is disabled under prefers-reduced-motion (see
// styles/design-system.scss). Mounted globally in pages/_app.js.
export default function FilmGrain() {
  return <div className="film-grain" aria-hidden="true" />;
}
