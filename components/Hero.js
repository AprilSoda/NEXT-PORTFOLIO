import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const HeroTitle = [
    {count: 1, h1s:['VFX', 'GENERALIST']},
    {count: 3, h1s:['KIM', 'TAE', 'KYUN,', 'BORN', 'IN', 'KOREA']},
    {count: 8, h1s:['CURRENTLY', 'IN','FILM-SCHOOL']},
    {count: 11, h1s:['+8', 'YEAR','OF','EXPERIENCE']},
    {count: 15, h1s:['FEEL', 'FREE', 'TO', 'CONTACT']},
]


export default function Hero() {
    const videoRef = useRef(null)
    const [align, setalign] = useState("");

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

    return(
    <>
        <section className="hero-comp">
            <div className={'centering ' + align}>
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
                <motion.div
                    className="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition= {{ default: {duration: 3, delay: 2 }}}
                >
                    <div class="youtube-container">
                    <iframe src="https://www.youtube.com/embed/T_aDkRDeaJ4?vol=0&autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=T_aDkRDeaJ4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </motion.div>
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