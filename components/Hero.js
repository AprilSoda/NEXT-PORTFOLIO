import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Button from './Button'
import ShowreelButton from './ShowreelButton'
import { identity, heroLines } from '../content/site'
import { useT } from '../lib/i18n'

// Client-only + lazy: the media-chrome player (web components) must not run on
// the server, and there's no need to ship it until the showreel is opened.
const ModalShowreel = dynamic(() => import('./modal-showreel'), { ssr: false })

// Hero background loop — self-hosted on Cloudflare R2 (muted, looping), replacing
// the YouTube embed. Swap this URL (or set NEXT_PUBLIC_HERO_BG_URL) to change it;
// defaults to the showreel reel.
const BG_VIDEO_SRC =
  process.env.NEXT_PUBLIC_HERO_BG_URL ||
  'https://pub-c3b8ef19e7734097bf89d561c8f76ca8.r2.dev/video/hero-bg.mp4'


// Running word offset per line, so the stagger continues across lines
const HeroTitle = heroLines.map((h1s, i) => ({
    count: heroLines.slice(0, i).reduce((n, line) => n + line.length, 0) + 1,
    h1s,
}))


export default function Hero() {
    const videoRef = useRef(null)
    const [align, setAlign] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [reelReady, setReelReady] = useState(false);
    const [heroInView, setHeroInView] = useState(true);
    const heroRef = useRef(null)
    const { pick } = useT();

    const thisYear = () => {
        const year = new Date().getFullYear()
        return year
    }

    // The background loop only plays while it can be seen, and never for
    // visitors who prefer reduced motion
    useEffect(() => {
        const video = videoRef.current
        if (!video) return undefined
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
        const sync = () => {
            if (heroInView && !isOpen && !document.hidden) video.play().catch(() => {})
            else video.pause()
        }
        sync()
        document.addEventListener('visibilitychange', sync)
        return () => document.removeEventListener('visibilitychange', sync)
    }, [heroInView, isOpen])

    // The floating reel button belongs to the hero — hide it once the
    // visitor scrolls on to the sections below
    useEffect(() => {
        const el = heroRef.current
        if (!el || typeof IntersectionObserver === 'undefined') return undefined
        const io = new IntersectionObserver(([entry]) => setHeroInView(entry.intersectionRatio > 0.4), { threshold: [0, 0.4, 1] })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlign('right');
        }, 3200);
        return () => clearTimeout(timer);
    }, []);

    // Reveal the "Play Showreel" button only after the hero title has finished
    // sliding right (align → 'right' at 5s, then its 2s CSS transition settles).
    useEffect(() => {
        if (align !== 'right') return undefined;
        const t = setTimeout(() => setReelReady(true), 1200);
        return () => clearTimeout(t);
    }, [align]);

    return (
        <>
            <ModalShowreel isOpen={isOpen} onClose={() => setIsOpen(false)} />
            {reelReady && (heroInView || isOpen) && (
                <ShowreelButton isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
            )}
            <section ref={heroRef} className={`hero-comp ${isOpen ? 'blur-effect' : ''}`}>
                <motion.div
                    className="hero-meta u-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <span className="hero-meta__role">{pick(identity.role)}</span>
                    <span className="hero-meta__status">
                        <i /> {pick(identity.status)}
                    </span>
                    <span className="hero-meta__loc">{pick(identity.location)} — {thisYear()}</span>
                </motion.div>
                <div className={'centering ' + align}>
                    {HeroTitle.map((HeroTitle, i) => {
                        const indexs = HeroTitle.count
                        return (
                            <div key={i} className='outter'>
                                <div className='inner'>
                                    {HeroTitle.h1s.map((v, i) => {
                                        var indexing = i + indexs
                                        return (
                                            <motion.h1
                                                key={indexing}
                                                initial={{ opacity: 0, translateY: -30 }}
                                                animate={{ opacity: 1, translateY: 0 }}
                                                transition={{ default: { duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.6 + indexing * 0.08 } }}
                                            >
                                                {v}
                                            </motion.h1>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="bg-area">
                    <motion.div
                        className="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ default: { duration: 2.4, delay: 1 } }}
                    >
                        <video
                            ref={videoRef}
                            className="bg-video"
                            src={BG_VIDEO_SRC}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                        />
                    </motion.div>
                </div>
                <motion.div
                    className="copy-area"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 3 }}
                >
                    <div className="social">
                        <Button>
                            <a href="https://www.imdb.com/name/nm16975542/" target="_blank" rel="noreferrer">
                                <svg fill="#ffffff" width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="social_link">
                                    <g><path d="M8.4,21.1H5.9V9.9h3.8l0.7,4.7h0.1L11,9.9h3.8v11.2h-2.5v-6.7h-0.1l-0.9,6.7H9.4l-1-6.7h0L8.4,21.1L8.4,21.1z" /><path d="M15.8,9.8c0.4,0,3.2-0.1,4.7,0.1c1.2,0.1,1.8,1.1,1.9,2.3c0.1,2.2,0.1,4.4,0.1,6.6c0,0.2,0,0.5-0.1,0.8   c-0.2,0.9-0.7,1.4-1.9,1.5c-1.5,0.1-3,0.1-4.4,0.1c0,0-0.1,0-0.2,0V9.8z M18.8,11.9v7.2c0.5,0,0.8-0.2,0.8-0.7c0-1.9,0-3.9,0-5.9   C19.6,12,19.4,11.8,18.8,11.9z" /><path d="M2,21.1V9.9h2.9v11.2H2z" /><path d="M29.9,14.1c-0.1-0.8-0.6-1.2-1.4-1.4c-0.8-0.1-1.6,0-2.3,0.7V9.9h-2.8v11.2H26c0.1-0.2,0.1-0.4,0.2-0.5c0,0,0,0,0.1,0   c0.1,0.1,0.2,0.2,0.3,0.3c0.7,0.5,1.5,0.6,2.3,0.3c0.7-0.3,1-0.9,1-1.6c0-0.8,0.1-1.7,0.1-2.6C30,16,30,15,29.9,14.1L29.9,14.1z    M27.1,19.1c0,0.2-0.2,0.4-0.4,0.4s-0.4-0.2-0.4-0.4v-4.3c0-0.2,0.2-0.4,0.4-0.4s0.4,0.2,0.4,0.4V19.1z" /></g>
                                </svg>
                            </a>
                        </Button>
                        <Button>
                            <a href="https://www.instagram.com/lsingleplayer/" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="social_link">
                                    <path d="M12,2.982c2.937,0,3.285.011,4.445.064a6.072,6.072,0,0,1,2.042.379,3.4,3.4,0,0,1,1.265.823,3.4,3.4,0,0,1,.823,1.265,6.072,6.072,0,0,1,.379,2.042c.053,1.16.064,1.508.064,4.445s-.011,3.285-.064,4.445a6.072,6.072,0,0,1-.379,2.042,3.644,3.644,0,0,1-2.088,2.088,6.072,6.072,0,0,1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.072,6.072,0,0,1-2.042-.379,3.4,3.4,0,0,1-1.265-.823,3.4,3.4,0,0,1-.823-1.265,6.072,6.072,0,0,1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.072,6.072,0,0,1,.379-2.042,3.4,3.4,0,0,1,.823-1.265,3.4,3.4,0,0,1,1.265-.823,6.072,6.072,0,0,1,2.042-.379c1.16-.053,1.508-.064,4.445-.064M12,1c-2.987,0-3.362.013-4.535.066a8.108,8.108,0,0,0-2.67.511A5.625,5.625,0,0,0,1.577,4.8a8.108,8.108,0,0,0-.511,2.67C1.013,8.638,1,9.013,1,12s.013,3.362.066,4.535a8.108,8.108,0,0,0,.511,2.67A5.625,5.625,0,0,0,4.8,22.423a8.108,8.108,0,0,0,2.67.511C8.638,22.987,9.013,23,12,23s3.362-.013,4.535-.066a8.108,8.108,0,0,0,2.67-.511A5.625,5.625,0,0,0,22.423,19.2a8.108,8.108,0,0,0,.511-2.67C22.987,15.362,23,14.987,23,12s-.013-3.362-.066-4.535a8.108,8.108,0,0,0-.511-2.67A5.625,5.625,0,0,0,19.2,1.577a8.108,8.108,0,0,0-2.67-.511C15.362,1.013,14.987,1,12,1Z"></path><path d="M12,6.351A5.649,5.649,0,1,0,17.649,12,5.649,5.649,0,0,0,12,6.351Zm0,9.316A3.667,3.667,0,1,1,15.667,12,3.667,3.667,0,0,1,12,15.667Z"></path><circle cx="17.872" cy="6.128" r="1.32"></circle>
                                </svg>
                            </a>
                        </Button>
                        <Button><a href="https://www.linkedin.com/in/tae-kyun-kim/" target="_blank" rel="noreferrer">
                            <svg height="24px" width="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social_link">
                                <path d="M23,0H1C0.4,0,0,0.4,0,1v22c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V1C24,0.4,23.6,0,23,0z M7.1,20.5H3.6V9h3.6 V20.5z M5.3,7.4c-1.1,0-2.1-0.9-2.1-2.1c0-1.1,0.9-2.1,2.1-2.1c1.1,0,2.1,0.9,2.1,2.1C7.4,6.5,6.5,7.4,5.3,7.4z M20.5,20.5h-3.6 v-5.6c0-1.3,0-3-1.8-3c-1.9,0-2.1,1.4-2.1,2.9v5.7H9.4V9h3.4v1.6h0c0.5-0.9,1.6-1.8,3.4-1.8c3.6,0,4.3,2.4,4.3,5.5V20.5z"></path>
                            </svg>
                        </a></Button>
                    </div>
                    <div>
                        copyright <span>{thisYear()}</span> &#169; All right reserved
                    </div>
                </motion.div>
            </section>
        </>
    )
}