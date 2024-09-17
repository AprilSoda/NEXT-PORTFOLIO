import React, { useContext, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MouseContext } from "../components/MouseContext";
import Arrow from "../public/Arrow.svg";
import useIsMobile from "./useIsMobile";

gsap.config({
    autoSleep: 60,
    force3D: false,
    nullTargetWarn: false,
});

const CustomCursor = () => {
    const xTo = useRef();
    const yTo = useRef();
    const app = useRef();
    const isMobile = useIsMobile();
    const { cursorType } = useContext(MouseContext);

    const style = {
        position: "fixed",
        padding: "10px",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        pointerEvents: "none"
    };

    const { contextSafe } = useGSAP(() => {
        if (isMobile) return;
        xTo.current = gsap.quickTo(".main-cursor", "x", { duration: 0.5, ease: "expo.out" });
        yTo.current = gsap.quickTo(".main-cursor", "y", { duration: 0.5, ease: "expo.out" });
    }, { scope: app });

    useEffect(() => {
        if (isMobile) return;

        const animateCursorType = () => {
            gsap.killTweensOf(".main-cursor-inner, .hover-cursor, .showreel-cursor, .showreel-text");

            switch (cursorType) {
                case "hover":
                    gsap.to(".main-cursor-inner", { duration: 0.5, scale: 0, opacity: 0, ease: "expo.out" });
                    gsap.to(".hover-cursor", { duration: 0.5, scale: 1, opacity: 1, ease: "expo.out" });
                    gsap.to(".showreel-cursor", { duration: 0.5, scale: 0, opacity: 0, ease: "expo.out" });
                    gsap.to(".showreel-text", { duration: 0.5, opacity: 0, ease: "expo.out" });
                    break;
                case "showreel":
                    gsap.to(".main-cursor-inner", { duration: 0.5, scale: 0, opacity: 0, ease: "expo.out" });
                    gsap.to(".hover-cursor", { duration: 0.5, scale: 0, opacity: 0, ease: "expo.out" });
                    gsap.to(".showreel-cursor", { duration: 0.5, scale: 1, opacity: 1, ease: "expo.out" });
                    gsap.to(".showreel-text", { delay: 0.5, duration: 1, opacity: 1, ease: "expo.out" });
                    break;
                default:
                    gsap.to(".main-cursor-inner", { duration: 0.5, scale: 1, opacity: 1, ease: "expo.out" });
                    gsap.to(".hover-cursor", { duration: 0.5, scale: 0, opacity: 0, ease: "expo.out" });
                    gsap.to(".showreel-cursor", { duration: 0.5, scale: 0, opacity: 0, ease: "expo.out" });
                    gsap.to(".showreel-text", { duration: 0.5, opacity: 0, ease: "expo.out" });
            }
        };

        animateCursorType();
    }, [cursorType, isMobile]);

    useEffect(() => {
        if (isMobile) return;

        const onMouseMove = contextSafe((e) => {
            xTo.current(e.clientX);
            yTo.current(e.clientY);
        });

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [contextSafe, isMobile]);

    if (isMobile) return null;

    return (
        <div className="Cursor_app" style={style} ref={app}>
            <div className="main-cursor">
                <div className="main-cursor-inner" />
                <div className="hover-cursor" style={{ transform: "scale(0)" }}>
                    <Arrow />
                </div>
                <div className="showreel-cursor" style={{ transform: "scale(0)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden' }}>
                        <path d="M891.161 512l-749.992 450v-900l749.992 450z" />
                    </svg>
                    <p className="showreel-text">PLAY SHOWREEL</p>
                </div>
            </div>
        </div>
    );
};

export default CustomCursor;