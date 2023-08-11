import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useMediaQuery } from 'react-responsive';

import Heroimg from '../../public/img/about-1.webp'
import img1 from '../../public/img/about-2.jpg'
import img2 from '../../public/img/about-3.jpg'
import img3 from '../../public/img/about-4.jpg'
import Transition from '../../components/Transition';
import Footer from '../../components/Footer';


const About = () => {
    const smallsizeweb = useMediaQuery({ query: `(max-width: 768px)` });

    return (
        <Transition>
            <div style={{ fontFamily: "Helvetica Now Display"}}>
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
                                    <Image rel="preload" priority src={Heroimg} />
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="s-story">
                    <div className='about'>
                        <span> ABOUT KIM </span>
                    </div>
                    <ul>
                        <li className='row1'>
                            <div className='img' >
                                <figure>
                                    <Image rel="preload" src={img1} alt="Seoul Institute Of The Art Film Shoot" />
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
                                <div><div> Directing, Editing, Sound design, </div></div>
                                <div><div> Set design, etc..  </div></div>
                            </div>
                        </li>
                        <li className='row2'>
                            <div className='img'>
                                <figure>
                                    <Image rel="preload" src={img2} alt="Short Oh hako Shoot" />
                                </figure>
                                <p> Short Oh hako Shoot </p>
                            </div>
                            <div className='paragraph'>
                                <div><div>In the process of learning </div></div>
                                <div><div>i greatly gravitate to visual effect  </div></div>
                                <div><div>so creacte the team call AFTER WORKS™  </div></div>
                                <div><div>and I produced Motion Graphic, </div></div>
                                <div><div>VFX Film, Advertisement. </div></div>
                                <div><div>This led me to try many VFX programs.</div></div>
                                <div><div>However, I have learned that not only is</div></div>
                                <div><div>visual appeal important, but storytelling is</div></div>
                                <div><div>even more important. So I'm currently</div></div>
                                <div><div>in film school to study how important</div></div>
                                <div><div>visual storytelling is. </div></div>
                            </div>
                        </li>
                        <li className='row3'>
                            <div className='img'>
                                <figure>
                                    <Image rel="preload" src={img3} alt="Vancouver Travel" />
                                </figure>
                                <p> Vancouver travel </p>
                            </div>
                            <div className='paragraph'>
                                <div><div>That being said, except for work</div></div>
                                <div><div>I love Art, Music, Drawing,</div></div>
                                <div><div>Movie, Rocket Science, Coding,</div></div>
                                <div><div>Love Computer, Build home office,</div></div>
                                <div><div>Travel, Game.</div></div>
                                <div><div>or trying to spend time </div></div>
                                <div><div>with my family. </div></div>
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
                                <div> VFX Supervisor </div>
                                <div> Compositer </div>
                                <div> Cinematographer </div>
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
                                <div>Maya</div>
                                <div>Houdini</div>
                                <div>After Effects</div>
                                <div>Nuke<span>{"(main)"}</span></div>
                                <div>3DEqualizer<span>{"(main)"}</span></div>
                                <div>PF Track</div>
                                <div>Mocha Pro</div>
                                <div>Marvelous Designer</div>
                                <div>Terragen 4</div>
                                <div>Gaea</div>
                                <div>Mari</div>
                                <div>Substance Painter</div>
                                <div>Unreal Engine</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </Transition>
    );
};

export default About;