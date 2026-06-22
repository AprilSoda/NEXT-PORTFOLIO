import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Transition from "../../components/Transition";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About = () => {
    const [isMounted, setIsMounted] = useState(false);
    const smallsizeweb = useMediaQuery({ query: `(max-width: 768px)` });
    const container = useRef(null);

    useEffect(() => {
        // 의도적 mount 가드: useMediaQuery의 SSR/CSR 하이드레이션 불일치 방지
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const currentYear = new Date().getFullYear();
    let difference = currentYear - 2014;

    // Scroll-triggered reveals, reusing the existing line-mask markup. Lenis
    // scrolls natively so reveal-on-enter triggers work without extra wiring.
    useGSAP(() => {
        if (!isMounted) return;
        const ease = "expo.out";
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // intro — title lines mask up + image clip reveal
            gsap.from(".about-title .title > div > *", {
                yPercent: 115, opacity: 0, duration: 1.1, ease, stagger: 0.08,
                scrollTrigger: { trigger: ".about-title", start: "top 85%", once: true },
            });
            gsap.fromTo(".about-title .img-inner",
                { clipPath: "inset(100% 0% 0% 0%)" },
                {
                    clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease,
                    scrollTrigger: { trigger: ".about-title", start: "top 80%", once: true },
                });
            gsap.from(".about-title .img-inner figure img", {
                scale: 1.25, duration: 1.7, ease,
                scrollTrigger: { trigger: ".about-title", start: "top 80%", once: true },
            });

            // story rows — image reveal + caption + line-by-line paragraph
            gsap.utils.toArray(".s-story li").forEach((row) => {
                const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } });
                const fig = row.querySelector(".img figure");
                if (fig) tl.fromTo(fig, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease }, 0);
                const img = row.querySelector(".img figure img");
                if (img) tl.from(img, { scale: 1.2, duration: 1.5, ease }, 0);
                const cap = row.querySelector(".img p");
                if (cap) tl.from(cap, { y: 18, opacity: 0, duration: 0.8, ease }, 0.3);
                const lines = row.querySelectorAll(".paragraph > div > div");
                if (lines.length) tl.from(lines, { yPercent: 100, duration: 0.9, ease, stagger: 0.05 }, 0.15);
            });

            // section labels
            gsap.from(".s-story .about span, .s-skill .skill span", {
                opacity: 0, y: 10, duration: 0.8, ease, stagger: 0.15,
                scrollTrigger: { trigger: ".s-story", start: "top 85%", once: true },
            });

            // skill section
            gsap.timeline({ scrollTrigger: { trigger: ".s-skill", start: "top 75%", once: true } })
                .from(".s-skill .tryhard h4", { y: 40, opacity: 0, duration: 1, ease })
                .from(".s-skill .tryhardgrid .s-9", { y: 24, opacity: 0, duration: 0.7, ease, stagger: 0.1 }, 0.1)
                .from(".s-skill .tryhardgrid .tile > div", { y: 18, opacity: 0, duration: 0.6, ease, stagger: 0.03 }, 0.2);

            ScrollTrigger.refresh();
        });
    }, { scope: container, dependencies: [isMounted] });

    if (!isMounted) {
        return null;
    }

    return (
        <Transition>
            <div ref={container}>
                <section className="about-title">
                    <div className="about-title-wrapper">
                        <div className="title">
                            {!smallsizeweb ? (
                                <>
                                    <div>
                                        <h1> Hey I&apos; m TaeKyun Kim </h1>
                                    </div>
                                    <div>
                                        <h1> VFX Generalist, </h1>
                                    </div>
                                    <div>
                                        <h1> Interest in Space & Film </h1>
                                    </div>
                                    <div>
                                        <h6> hello@kimtaekyun.dev </h6>
                                    </div>
                                    <div>
                                        <h6>
                                            {" "}
                                            Seoul, South Korea{" "}
                                            <span> (UTC+9) </span>
                                        </h6>
                                    </div>
                                    <div style={{ marginTop: "2rem" }}>
                                        <a href="/cv.pdf" download className="cv-download-btn">
                                            <Button>
                                                Download CV
                                            </Button>
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        style={{
                                            transform:
                                                "rotate(-10deg) translate(-8px,10px)",
                                            transformOrigin: "left bottom",
                                        }}
                                    >
                                        <h1
                                            style={{
                                                fontSize: "22px",
                                                fontWeight: "300",
                                                fontStyle: "italic",
                                                color: "#ee344a",
                                            }}
                                        >
                                            {" "}
                                            Hey I&apos;m{" "}
                                        </h1>
                                    </div>
                                    <div
                                        style={{
                                            transform:
                                                "rotate(-10deg) translate(-6px,10px)",
                                            transformOrigin: "left bottom",
                                        }}
                                    >
                                        <h1
                                            style={{
                                                fontSize: "22px",
                                                fontWeight: "300",
                                                fontStyle: "italic",
                                                color: "#ee344a",
                                            }}
                                        >
                                            {" "}
                                            TaeKyun Kim{" "}
                                        </h1>
                                    </div>
                                    <div>
                                        <h1> VFX Generalist, </h1>
                                    </div>
                                    <div>
                                        <h1> Interest in </h1>
                                    </div>
                                    <div>
                                        <h1> Space & Film </h1>
                                    </div>
                                    <div style={{ marginTop: "3vh" }}>
                                        <h6> hello@kimtaekyun.dev </h6>
                                    </div>
                                    <div>
                                        <h6>
                                            {" "}
                                            Seoul, South Korea{" "}
                                            <span> (UTC+9) </span>
                                        </h6>
                                    </div>
                                    <div style={{ marginTop: "3vh" }}>
                                        <a href="/cv.pdf" download className="cv-download-btn">
                                            <Button>
                                                Download CV
                                            </Button>
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="img-wrapper">
                            <div className="img-inner">
                                <figure>
                                    <Image
                                        src="/about-1.webp"
                                        alt="TaeKyun Kim"
                                        width={800}
                                        height={1000}
                                        style={{ width: '100%', height: 'auto' }}
                                        priority
                                        quality={90}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="s-story">
                    <div className="about">
                        <span> ABOUT KIM </span>
                    </div>
                    <ul>
                        <li className="row1">
                            <div className="img">
                                <figure>
                                    <Image
                                        src="/about-2.jpg"
                                        alt="Seoul Institute Of The Art Film Shoot"
                                        width={1200}
                                        height={800}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{ width: '100%', height: 'auto' }}
                                        quality={85}
                                        loading="lazy"
                                    />
                                </figure>
                                <p> Seoul Institute Of The Art Film Shoot </p>
                            </div>
                            <div className="paragraph">
                                <div>
                                    <div> Born in October 15, 1998 </div>
                                </div>
                                <div>
                                    <div>
                                        {" "}
                                        I was interested in Computer Graphic
                                        in{" "}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {" "}
                                        age of 16 after over {difference} years
                                        of time,{" "}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {" "}
                                        passion & curiosity, I continue to
                                        refine{" "}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {" "}
                                        a process that make’s great movie.{" "}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {" "}
                                        which i beginning to learn
                                        Film-making,{" "}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        {" "}
                                        Directing, Editing, Sound design,{" "}
                                    </div>
                                </div>
                                <div>
                                    <div> Set design, etc.. </div>
                                </div>
                            </div>
                        </li>
                        <li className="row2">
                            <div className="img">
                                <figure>
                                    <Image
                                        src="/about-3.jpg"
                                        alt="Short Oh hako Shoot"
                                        width={1200}
                                        height={800}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{ width: '100%', height: 'auto' }}
                                        quality={85}
                                        loading="lazy"
                                    />
                                </figure>
                                <p> Short Oh hako Shoot </p>
                            </div>
                            <div className="paragraph">
                                <div>
                                    <div>In the process of learning </div>
                                </div>
                                <div>
                                    <div>
                                        i greatly gravitate to visual
                                        effect{" "}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        so creacte the team call AFTER
                                        WORKS™{" "}
                                    </div>
                                </div>
                                <div>
                                    <div>and I produced Motion Graphic, </div>
                                </div>
                                <div>
                                    <div>VFX Film, Advertisement. </div>
                                </div>
                                <div>
                                    <div>
                                        This led me to try many VFX programs.
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        However, I have learned that not only is
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        visual appeal important, but
                                        storytelling is
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        even more important. So I'm currently
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        in film school to study how important
                                    </div>
                                </div>
                                <div>
                                    <div>visual storytelling is. </div>
                                </div>
                            </div>
                        </li>
                        <li className="row3">
                            <div className="img">
                                <figure>
                                    <Image
                                        src="/about-4.jpg"
                                        alt="Vancouver Travel"
                                        width={1200}
                                        height={800}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        style={{ width: '100%', height: 'auto' }}
                                        quality={85}
                                        loading="lazy"
                                    />
                                </figure>
                                <p> Vancouver travel </p>
                            </div>
                            <div className="paragraph">
                                <div>
                                    <div>That being said, except for work</div>
                                </div>
                                <div>
                                    <div>I love Art, Music, Drawing,</div>
                                </div>
                                <div>
                                    <div>Movie, Rocket Science, Coding,</div>
                                </div>
                                <div>
                                    <div>Love Computer, Build home office,</div>
                                </div>
                                <div>
                                    <div>Travel, Game.</div>
                                </div>
                                <div>
                                    <div>or trying to spend time </div>
                                </div>
                                <div>
                                    <div>with my family. </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>
                {/* <section className='s-awards'>

                    <div className='awards'>
                        <span> AWARDS </span>
                    </div>
                    <div className='awards-wrapper'>
                        <div className='awards-inner'>
                            <div className='awards-inner-item'>
                                <h2> 2023</h2>
                                <br />
                                <h3> South Korea</h3>
                                <br />
                                <p> The 4th Suryeohan Hapcheon Film Festival, Korean Competition Section  </p>
                                <p> The 1st Eunpyeong Youth Film Festival, Competition Section </p>
                                <p> The 15th Seoul Yeongdeungpo International Extreme-Short Image & Film Festival, Official Invitation </p>
                                <p> The 9th Seoul International Food Film Festival, Korean Short Competition </p>
                                <p> The 18th Korea University Film Festival, Special Jury Prize by the Executive Committee </p>
                                <p> The 7th Meonae Village Film Festival, Comma Award </p>
                                <br />
                                <h3> France </h3>
                                <br />
                                <p> The 29th Nancy International Film Festival, International Short Film Section </p>
                                <br />
                                <h3> Canada </h3>
                                <p> The 27th Vancouver Asian Film Festival, International Short Film Section </p>
                                <h3> Japan </h3>
                                <p> The 26th Kyoto International Student Film Festival, Executive Committee Award </p>
                                <h3> Spain </h3>
                                <p> 8th Galician Freaky Film Festival, International Short Film Section </p>
                            </div>
                        </div>
                    </div>
                </section> */}
                <section className="s-skill">
                    <div className="skill">
                        <span> SKILL </span>
                    </div>
                    <div className="tryhard">
                        {" "}
                        <h4>
                            {" "}
                            Over {difference} years dedicated to doing it
                            better...{" "}
                        </h4>
                    </div>
                    <div className="tryhardgrid">
                        <div className="service">
                            <div className="s-9"> SERVICE AREAS </div>
                            <div className="tile excep">
                                <div> VFX Supervisor </div>
                                <div> Compositer </div>
                                <div> 3D Generalist </div>
                                <div> Cinematographer </div>
                            </div>
                        </div>
                        <div className="three_general">
                            <div className="s-9"> PROGRAM </div>
                            <div className="tile">
                                <div>Premiere Pro</div>
                                <div>
                                    Davinci Resolve <span>{"(main)"}</span>
                                </div>
                                <div>
                                    Blender<span>{"(main)"}</span>
                                </div>
                                <div>Maya</div>
                                <div>Houdini</div>
                                <div>After Effects</div>
                                <div>
                                    Nuke<span>{"(main)"}</span>
                                </div>
                                <div>
                                    3DEqualizer<span>{"(main)"}</span>
                                </div>
                                <div>PF Track</div>
                                <div>Mocha Pro</div>
                                <div>Terragen 4</div>
                                <div>Gaea</div>
                                <div>Mari</div>
                                <div>Substance Painter</div>
                                <div>
                                    Flow Production Tracking {"(ShotGrid)"}
                                </div>
                                <div>Autodesk RV</div>
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
