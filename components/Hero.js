import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link'

const HeroTitle = [
    {count: 1, h1s:['VFX', 'GENERALIST']},
    {count: 3, h1s:['KIM', 'TAE', 'KYUN,', 'BORN', 'IN', 'KOREA']},
    {count: 8, h1s:['CURRENTLY', 'IN','FILM-SCHOOL']},
    {count: 11, h1s:['+8', 'YEAR','OF','EXPERIENCE']},
    {count: 15, h1s:['FEEL', 'FREE', 'TO', 'CONTACT']},
]


export default function Hero() {
    const videoRef = useRef(null)
    const [MenuReveal, setMenuReveal] = useState("");
    const smallsizeweb = useMediaQuery({ query: `(max-width: 768px)` });

    const thisYear = () => {
        const year = new Date().getFullYear()
        return year
    }

    useEffect(() => {
        if (videoRef && videoRef.current) {
          videoRef.current.play()
        }
      }, [videoRef])

    useEffect(()=> {
        setTimeout(function() {
            setMenuReveal('right');
        }, 5000);
      })

    return(
    <>
        <section className="hero-comp">
            <div className={'centering ' + MenuReveal}>
                    {HeroTitle.map(( HeroTitle, i ) => {
                        const indexs = HeroTitle.count
                        return(
                        <div key={i} className='outter'> 
                            <div className='inner'>
                                {HeroTitle.h1s.map(( v, i ) => {
                                    var indexing = i + indexs
                                    return (
                                    <motion.h1
                                        key={indexing}
                                        initial={{ opacity: 0, translateY: -30 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{ default:{duration: 1, ease: [0.19, 1, 0.22, 1], delay: 1 + indexing * 0.1}}}
                                    >
                                        {v}
                                    </motion.h1>
                                )})}
                            </div>
                        </div>
                    )})}
            </div>
            <div className="bg-area">
                <motion.video 
                    className="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition= {{ default: {duration: 3, delay: 2 }}}
                    muted preload="true" ref={videoRef} loop>
                    <source src="https://player.vimeo.com/external/256453827.hd.mp4?s=f4225f4a6ceb33a9ca56b9f613f6cf4c083c7345&profile_id=175" type="video/mp4" />
                </motion.video>
            </div>
            <motion.div
                className="copy-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3 }}
                >
                &#169; Kimtaekyun. All right reserved. <span>{thisYear()}</span>
            </motion.div>
        </section>
    </>
    )
}