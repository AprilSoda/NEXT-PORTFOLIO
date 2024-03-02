import { useRef, useEffect, useState, useContext } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import MouseContextProvider, { MouseContext } from './MouseContext'
import ModalShowreel from './modal-showreel'


// count for timing
const HeroTitle = [
    { count: 1, h1s: ['VFX', 'GENERALIST'] },
    { count: 3, h1s: ['KIM', 'TAE', 'KYUN,', 'SOUTH', 'KOREA'] },
    { count: 8, h1s: ['CURRENTLY', 'FREELANCING'] },
    { count: 11, h1s: ['FEEL', 'FREE', 'TO', 'CONTACT'] },
]


export default function Hero() {
    const videoRef = useRef(null)
    const [align, setalign] = useState("");
    const { handleCursorChange } = useContext(MouseContext);
    const [isOpen, setIsOpen] = useState(false);

    const thisYear = () => {
        const year = new Date().getFullYear()
        return year
    }

    useEffect(() => {
        if (videoRef && videoRef.current) {
            videoRef.current.play()
        }
    }, [videoRef])

    useEffect(() => {
        setTimeout(function () {
            setalign('right');
        }, 5000);
    })

    const videoOptions = {
        playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            mute: 1,
            loop: 1,
            playsinline: 1
        }
    };

    return (
        <>
            <ModalShowreel isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <section className="hero-comp">
                <div className={'centering ' + align}
                    onMouseEnter={() =>
                        handleCursorChange("showreel")
                    }
                    onMouseLeave={() =>
                        handleCursorChange("off")
                    }
                    onClick={() => {
                        setIsOpen(true);
                        handleCursorChange("off");
                    }}
                    style={{ cursor: 'pointer' }}
                >
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
                                                transition={{ default: { duration: 1, ease: [0.19, 1, 0.22, 1], delay: 1 + indexing * 0.1 } }}
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
                        transition={{ default: { duration: 3, delay: 2 } }}
                    >
                        <div className="youtube-container">
                            <iframe src="https://www.youtube.com/embed/T_aDkRDeaJ4?vol=0&autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=T_aDkRDeaJ4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    className="copy-area"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 3 }}
                >
                    <div className="social">
                        <Button><a href="https://www.instagram.com/lsingleplayer/" target="_blank" rel="noreferrer">Instagram</a></Button>
                        <Button><a href="https://www.linkedin.com/in/tae-kyun-kim/" target="_blank" rel="noreferrer">LinkedIn</a></Button>
                    </div>
                    <div>
                        &#169; Kimtaekyun. All right reserved. <span>{thisYear()}</span>
                    </div>
                </motion.div>
            </section>
        </>
    )
}