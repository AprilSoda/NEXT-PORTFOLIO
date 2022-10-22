import React, { useRef, useEffect, useContext } from "react";
import { gsap } from "gsap";

import { MouseContext } from "../components/MouseContext";

import Arrow from "../public/Arrow.svg";

const CustomCursor = () => {
    const mainCursor = useRef(null);
    const hoverCursor = useRef(null);

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
    cursorType === false
        ? gsap.to(hoverCursor.current, {
              duration: 1,
              scale: 0,
              ease: "expo.out",
          })
        : gsap.to(hoverCursor.current, {
              duration: 1,
              scale: 1,
              ease: "expo.out",
          });

    return (
        <div className="main-cursor" ref={mainCursor} style={{ scale: "0" }}>
            <div
                className="hover-cursor"
                ref={hoverCursor}
                style={{ scale: "0" }}
            >
                <Arrow />
            </div>
        </div>
    );
};

export default CustomCursor;
