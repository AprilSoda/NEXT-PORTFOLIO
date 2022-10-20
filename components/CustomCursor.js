import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const mainCursor = useRef(null);

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
    gsap.to(mainCursor.current, {
        duration: 1,
        x: e.clientX - mainCursor.current.clientWidth / 2,
        y: e.clientY - mainCursor.current.clientHeight / 2,
        ease: "expo.out"
      });
    });

    document.addEventListener("mouseenter", (e) => {
      gsap.to(mainCursor.current,{
        duration: 0.5,
        scale: 1,
        ease: "expo.out"
      })
    })


    document.addEventListener("mouseleave", (e) => {
      gsap.to(mainCursor.current,{
        duration: 0.5,
        scale: 0,
        ease: "expo.out"
      })
    })
    
    return () => {};
  }, []);

  
  return <div className="main-cursor" ref={mainCursor} style={{scale: '0'}}></div>;
};

export default CustomCursor;
