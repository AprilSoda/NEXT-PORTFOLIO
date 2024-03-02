import React, { useRef, useEffect, useContext } from "react";
import { gsap } from "gsap";
gsap.config({
    autoSleep: 60,
    force3D: false,
    nullTargetWarn: false
})


import { MouseContext } from "../components/MouseContext";

import Arrow from "../public/Arrow.svg";

const CustomCursor = () => {
    const mainCursor = useRef(null);
    const hoverCursor = useRef(null);
    const showreelCursor = useRef(null);
    const mainCursor_inner = useRef(null);
    const showreeltext = useRef(null);

    const { cursorType } = useContext(MouseContext);

    useEffect(() => {
        function mousemoveEvent(e) {
            gsap.to(mainCursor.current, {
                duration: 1,
                x: e.clientX - mainCursor.current.clientWidth / 2,
                y: e.clientY - mainCursor.current.clientHeight / 2,
                ease: "expo.out",
            });
        }

        function mouseenterEvent(e) {
            gsap.to(mainCursor.current, {
                duration: 0.5,
                scale: 1,
                ease: "expo.out",
            });
        }

        function mouseleaveEvent(e) {
            gsap.to(mainCursor.current, {
                duration: 0.5,
                scale: 0,
                ease: "expo.out",
            });
        }

        function mouseHoverEvent(e) {
            gsap.to(mainCursor_inner.current, {
                duration: 0.5,
                scale: 0,
                ease: "expo.out",
            });
            gsap.to(hoverCursor.current, {
                duration: 0.5,
                scale: 1,
                ease: "expo.out",
            });
        }

        document.addEventListener("mousemove", (e) => {
            mousemoveEvent(e);
        });
        document.addEventListener("mouseenter", (e) => {
            mouseenterEvent(e);
        });
        document.addEventListener("mouseleave", (e) => {
            mouseleaveEvent(e);
        });

        return () => {
            document.removeEventListener("mousemove", (e) => {
                mousemoveEvent(e);
            });
            document.removeEventListener("mouseenter", (e) => {
                mouseenterEvent(e);
            });
            document.removeEventListener("mouseleave", (e) => {
                mouseleaveEvent(e);
            });
        };
    }, []);



    if (cursorType === "hover") {
        gsap.killTweensOf([mainCursor_inner.current, hoverCursor.current]); // 이전 애니메이션 중지
        gsap.to(mainCursor_inner.current, {
            duration: 1,
            scale: 0,
            ease: "expo.out",
        });
        gsap.to(hoverCursor.current, {
            duration: 1,
            scale: 1,
            ease: "expo.out",
        });
    } else if (cursorType === "showreel") {
        gsap.killTweensOf([mainCursor_inner.current, showreelCursor.current, showreeltext.current]); // 이전 애니메이션 중지
        gsap.to(mainCursor_inner.current, {
            duration: 0,
            scale: 0,
            ease: "expo.out",
        });
        gsap.to(showreelCursor.current, {
            duration: 1,
            scale: 1,
            ease: "expo.out",
        });
        gsap.to(showreeltext.current, {
            delay: 0.5,
            duration: 1,
            opacity: 1,
            ease: "expo.out"
        });
    } else {
        gsap.killTweensOf([mainCursor_inner.current, hoverCursor.current, showreelCursor.current, showreeltext.current]); // 이전 애니메이션 중지
        gsap.to(mainCursor_inner.current, {
            duration: 0.5,
            scale: 1,
            ease: "power2.inout",
        });
        gsap.to(hoverCursor.current, {
            duration: 0.5,
            scale: 0,
            ease: "power2.inout",
        });
        gsap.to(showreelCursor.current, {
            duration: 0.2,
            scale: 0,
            ease: "power2.in",
        });
        gsap.to(showreeltext.current, {
            duration: 0.5,
            opacity: 0,
            ease: "power2.out"
        });
    }
    return (
        <div className="main-cursor" ref={mainCursor}>
            <div
                className="main-cursor-inner"
                ref={mainCursor_inner}>
            </div>
            <div
                className="hover-cursor"
                ref={hoverCursor}
                style={{ transform: "scale(0)" }}
            >
                <Arrow />
            </div>
            <div
                className="showreel-cursor"
                ref={showreelCursor}
                style={{ transform: "scale(0)" }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden' }} viewBox="0 0 1024 1024" version="1.1">
                    <path d="M891.161 512l-749.992 450v-900l749.992 450z" />
                </svg>
                <p ref={showreeltext}>PLAY SHOWREEL</p>
            </div>
        </div>
    );
};

export default CustomCursor;
