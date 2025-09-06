import { useRef, useEffect, useState, useContext } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import MouseContextProvider, { MouseContext } from './MouseContext'
import ModalShowreel from './modal-showreel'


// count for timing
const HeroTitle = [
    { count: 1, h1s: ['VFX', 'GENERALIST'] },
    { count: 3, h1s: ['KIM', 'TAE', 'KYUN,', 'SOUTH', 'KOREA'] },
    { count: 8, h1s: ['CURRENTLY', 'AVAILABLE', 'FOR', 'FREELANCE'] },
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
            <section className={`hero-comp ${isOpen ? 'blur-effect' : ''}`}>
                <div className={'centering ' + align}
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
                                            v === "M83" || v === "STUDIO" ? (
                                                <a key={indexing} href="https://m83.co.kr/" target="_blank" rel="noopener noreferrer">
                                                    <motion.h1
                                                        key={indexing}
                                                        initial={{ opacity: 0, translateY: -30 }}
                                                        animate={{ opacity: 1, translateY: 0 }}
                                                        transition={{ default: { duration: 1, ease: [0.19, 1, 0.22, 1], delay: 1 + indexing * 0.1 } }}
                                                    >
                                                        {v}
                                                    </motion.h1>
                                                </a>
                                            ) : (
                                                <motion.h1
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
                                                    key={indexing}
                                                    initial={{ opacity: 0, translateY: -30 }}
                                                    animate={{ opacity: 1, translateY: 0 }}
                                                    transition={{ default: { duration: 1, ease: [0.19, 1, 0.22, 1], delay: 1 + indexing * 0.1 } }}
                                                >
                                                    {v}
                                                </motion.h1>
                                            )
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