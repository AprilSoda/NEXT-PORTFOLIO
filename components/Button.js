import React, { useRef } from "react";
import { gsap } from "gsap";

const Button = ({ children, type }) => {
  const target = useRef();

  function handleMouseMove(e) {
    const { clientX: cx, clientY: cy } = e.nativeEvent;
    const bounding = target.current.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = target.current;
    const strength = type === 'pic' ? 50 : 20;

    gsap.to(target.current, {
      duration: 0.5,
      x: ((cx - bounding.left) / width - 0.5) * strength + "px",
      y: ((cy - bounding.top) / height - 0.5) * strength + "px",
      ease: "Power4.out"
    });
  }

  const handleMouseLeave = (e) => {
    gsap.to(target.current, {
      duration: 0.5,
      x: 0,
      y: 0,
      color: "rgb(256, 256, 256)",
      scale: 1,
      ease: "expo.out"
    });
  };

  const handelMouseEnter = (e) => {
    gsap.to(target.current, {
      duration: 0.5,
      color: "rgb(200, 200, 200)",
      scale: 1.2,
      ease: "expo.out"
    });
  };

  return (
    <div
      className={type === 'pic' ? 'target_pic' : 'target_box'}
      ref={target}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handelMouseEnter}
    >
      {children}
    </div>
  );
};

export default Button;
