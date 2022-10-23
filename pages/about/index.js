import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

import Heroimg from '../../public/contact-1.webp'
import img1 from '../../public/contact-2.jpg'
import img2 from '../../public/contact-3.jpg'
import img3 from '../../public/contact-4.jpg'
import Transition from '../../components/Transition';
import Footer from '../../components/Footer';


const About = () => {
    const smallsizeweb = useMediaQuery({ query: `(max-width: 768px)` });


    // useEffect(() => {
    //     var ab = gsap.timeline()
    //     ab.addLabel("sp", 1.6)
    //     ab.to('.img-wrapper', { duration: 0, visibility: "visible" }, "sp")
    //     ab.from(".about-title .img-wrapper .img-inner:after", { duration: 1.4, width: "100%", ease: "Power2.Out" }, "sp+=0.5")
    //     ab.from('.img-wrapper .img-inner img', { duration: 1.4, scale: 1.6, ease: "Power2.inOut" }, "sp+=0.01")
    //     ab.from('.about-title .title div *', { duration: 1, y: "10vw", ease: "expo.out", stagger: 0.1 }, "sp+=0.2")
    // }, [])
    let on1 = useRef(null);

    return (
        <Transition>
            <div style={{ fontFamily: "Helvtica"}}>
                <section className='about-title'>
                    <div className='about-title-wrapper'>
                        <div className='title'>
                            {!smallsizeweb ? (
                                <>
                                    <div ><h1> Hey I&apos; m TaeKyun Kim </h1></div>
                                    <div ><h1> VFX Generalist, </h1></div>
                                    <div ><h1> Interest in Space & Film </h1></div>
                                    <div ><h6> lsingleplayerl@gmail.com </h6></div>
                                    <div ><h6> Seoul, South Korea <span> (UTC+9) </span></h6></div>
                                </>
                            ) : (
                                <>
                                    <div style={{ transform: "rotate(-10deg) translate(-8px,10px)", transformOrigin: "left bottom" }} ><h1 style={{ fontSize: "22px", fontWeight: "300", fontStyle: "italic", color: "#ee344a" }}> Hey I&apos;m </h1></div>
                                    <div style={{ transform: "rotate(-10deg) translate(-6px,10px)", transformOrigin: "left bottom" }}><h1 style={{ fontSize: "22px", fontWeight: "300", fontStyle: "italic", color: "#ee344a" }}> TaeKyun Kim </h1></div>
                                    <div><h1> VFX Generalist, </h1></div>
                                    <div><h1> Interest in </h1></div>
                                    <div><h1>  Space & Film </h1></div>
                                    <div style={{ marginTop: "3vh" }}><h6> lsingleplayerl@gmail.com </h6></div>
                                    <div ><h6> Seoul, South Korea <span> (UTC+9) </span></h6></div>
                                </>
                            )}
                        </div>
                        <div className='img-wrapper'>
                            <div className='img-inner'>
                                <figure>
                                    <Image src={Heroimg} />
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>
                <section ref={on1} className="s-story">
                    <div className='about'>
                        <span> ABOUT KIM </span>
                    </div>
                    <ul>
                        <li className='row1'>
                            <div className='img' >
                                <figure>
                                    <Image src={img1} alt="Seoul Institute Of The Art Film Shoot" />
                                </figure>
                                <p> Seoul Institute Of The Art Film Shoot </p>
                            </div>
                            <div className='paragraph' >
                                <div><div> Born in October 15, 1998 </div></div>
                                <div><div> I was interested in Computer Graphic in </div></div>
                                <div><div> age of 16 after over 8 years of time,  </div></div>
                                <div><div> passion & curiosity, I continue to refine </div></div>
                                <div><div> a process that make’s great movie. </div></div>
                                <div><div> which i beginning to learn Film-making,  </div></div>
                                <div><div> Directing, Editing, Sound design, Set design,  </div></div>
                                <div><div> ext.. and of course the excel.  </div></div>
                            </div>
                        </li>
                        <li className='row2'>
                            <div className='img'>
                                <figure>
                                    <Image src={img2} alt="Short Oh hako Shoot" />
                                </figure>
                                <p> Short Oh hako Shoot </p>
                            </div>
                            <div className='paragraph'>
                                <div><div>In the process of learning </div></div>
                                <div><div>i greatly gravitate to visual effect department </div></div>
                                <div><div>for how they can create.  </div></div>
                                <div><div>. </div></div>
                                <div><div>. </div></div>
                                <div><div>. </div></div>
                                <div><div>. </div></div>
                                <div><div>. </div></div>
                                <div><div>. </div></div>
                            </div>
                        </li>
                        <li className='row3'>
                            <div className='img'>
                                <figure>
                                    <Image src={img3} alt="Vancouver Travel" />
                                </figure>
                                <p> Vancouver travel </p>
                            </div>
                            <div className='paragraph'>
                                <div><div>That being said, when I’m not working, </div></div>
                                <div><div>i’m either learning new tech  </div></div>
                                <div><div>(virtual studio, production manegement)  </div></div>
                                <div><div>love to travel,  </div></div>
                                <div><div>reading lot of book,  </div></div>
                                <div><div>build my home office, gaming, </div></div>
                                <div><div>or trying to spend time with my family. </div></div>
                            </div>
                        </li>
                    </ul>
                </section>
                <section className='s-skill'>
                    <div className='skill'>
                        <span> SKILL </span>
                    </div>
                    <div className='tryhard'> <h4>Over 8 years dedicated to doing it better... </h4></div>
                    <div className='tryhardgrid'>
                        <div className='service'>
                            <div className='s-9'> SERVICE AREAS </div>
                            <div className='tile excep'>
                                <div>Film Direcctor</div>
                                <div>Web Development</div>
                                <div>3D Modeling</div>
                                <div>Motion Graphic</div>
                            </div>
                        </div>
                        <div className='editing'>
                            <div className='s-9'> Editing </div>
                            <div className='tile'>
                                <div>Premiere Pro</div>
                                <div>Davinci Resolve <span>{"(main)"}</span></div>
                            </div>
                        </div>
                        <div className='three_general'>
                            <div className='s-9'> 3D GENERAL </div>
                            <div className='tile'>
                                <div>blender<span>{"(main)"}</span></div>
                                <div>3ds Max</div>
                                <div>Cinema 4d</div>
                                <div>Maya</div>
                                <div>Houdini</div>
                                <div>After Effects<span>{"(main)"}</span></div>
                                <div>Nuke</div>
                                <div>PF Track<span>{"(main)"}</span></div>
                                <div>Mocha Pro</div>
                                <div>Marvelous Designer</div>
                                <div>Terragen 4</div>
                                <div>Substance Painter</div>
                                <div>Unreal Engine</div>
                            </div>
                        </div>
                        <div className='two_general'>
                            <div className='s-9'> 2D GENERAL </div>
                            <div className='tile'>
                                <div>Photoshop</div>
                                <div>Illustrator</div>
                                <div>Figma</div>
                            </div>
                        </div>
                        <div className='audio'>
                            <div className='s-9'> AUDIO </div>
                            <div className='tile'>
                                <div>Abletion Live</div>
                                <div>Audition</div>
                                <div>FL Studio</div>
                                <div>Logic Pro</div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='quote'>
                    <div><div>Express how our imagination can be.</div></div>
                    <div><div>what could be <div>built, destroyed, reshaped.</div></div></div>
                    <div><div>When that imagination comes to life,</div></div>
                    <div><div>it will be an <div>unbelievable sensation.</div></div></div>
                    <div><div>Even if that is a tiny detail,</div></div>
                    <div><div>it has <div> meaning.</div></div></div>
                </section>
            </div>
            <Footer />
        </Transition>
    );
};

export default About;