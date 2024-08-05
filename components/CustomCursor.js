import React, { useRef, useEffect, useContext, useState } from "react";
import { gsap } from "gsap";
import { MouseContext } from "../components/MouseContext";
import Arrow from "../public/Arrow.svg";
import useIsMobile from './useIsMobile';

gsap.config({
    autoSleep: 60,
    force3D: false,
    nullTargetWarn: false
})

const CustomCursor = () => {
    const isMobile = useIsMobile();
    const mainCursor = useRef(null);
    const hoverCursor = useRef(null);
    const showreelCursor = useRef(null);
    const mainCursor_inner = useRef(null);
    const showreeltext = useRef(null);

    const { cursorType } = useContext(MouseContext);

    useEffect(() => {
        if (isMobile) return; // 모바일인 경우 이벤트 리스너를 추가하지 않음

        function mousemoveEvent(e) {
            if (!mainCursor.current) return;
            gsap.to(mainCursor.current, {
                duration: 1,
                x: e.clientX - mainCursor.current.clientWidth / 2,
                y: e.clientY - mainCursor.current.clientHeight / 2,
                ease: "expo.out",
            });
        }

        function mouseenterEvent(e) {
            if (!mainCursor.current) return;
            gsap.to(mainCursor.current, {
                duration: 0.5,
                scale: 1,
                ease: "expo.out",
            });
        }

        function mouseleaveEvent(e) {
            if (!mainCursor.current) return;
            gsap.to(mainCursor.current, {
                duration: 0.5,
                scale: 0,
                ease: "expo.out",
            });
        }

        document.addEventListener("mousemove", mousemoveEvent);
        document.addEventListener("mouseenter", mouseenterEvent);
        document.addEventListener("mouseleave", mouseleaveEvent);

        return () => {
            document.removeEventListener("mousemove", mousemoveEvent);
            document.removeEventListener("mouseenter", mouseenterEvent);
            document.removeEventListener("mouseleave", mouseleaveEvent);
        };
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) return; // 모바일인 경우 GSAP 애니메이션을 실행하지 않음

        if (cursorType === "hover") {
            gsap.killTweensOf([mainCursor_inner.current, hoverCursor.current]);
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
            gsap.killTweensOf([mainCursor_inner.current, showreelCursor.current, showreeltext.current]);
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
            gsap.killTweensOf([mainCursor_inner.current, hoverCursor.current, showreelCursor.current, showreeltext.current]);
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
    }, [cursorType, isMobile]);

    if (isMobile) return null; // 모바일인 경우 커서를 렌더링하지 않음

    return (
        <>
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
        </>
    );
};

export default CustomCursor;
