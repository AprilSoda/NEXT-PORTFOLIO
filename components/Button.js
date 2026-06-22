import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/router";

const Button = ({ children, type }) => {
  const target = useRef();
  const router = useRouter();

  function handleMouseMove(e) {
    const { clientX: cx, clientY: cy } = e.nativeEvent;
    const bounding = target.current.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = target.current;
    const strength = type === 'pic' ? 50 : 20;
    const nx = (cx - bounding.left) / width;   // 0 (left) .. 1 (right)
    const ny = (cy - bounding.top) / height;   // 0 (top) .. 1 (bottom)

    const tween = {
      duration: 0.5,
      x: (nx - 0.5) * strength + "px",
      y: (ny - 0.5) * strength + "px",
      ease: "Power4.out"
    };

    // Steelworks-style directional stretch: the scaled image grows from the
    // cursor side (origin follows the pointer) so it "stretches" toward it.
    if (type === 'pic') {
      tween.transformOrigin = `${nx * 100}% ${ny * 100}%`;
    }

    gsap.to(target.current, tween);
  }

  const handleMouseLeave = (e) => {
    gsap.to(target.current, {
      duration: 0.5,
      x: 0,
      y: 0,
      color: "rgb(256, 256, 256)",
      scale: 1,
      transformOrigin: "50% 50%",
      ease: "expo.out"
    });
  };

  const handleMouseEnter = (e) => {
    gsap.to(target.current, {
      duration: 0.5,
      color: "rgb(200, 200, 200)",
      scale: 1.2,
      ease: "expo.out"
    });
  };

  useEffect(() => {
    const handleRouteChange = () => {
      gsap.to(target.current, {
        duration: 0.5,
        x: 0,
        y: 0,
        color: "rgb(256, 256, 256)",
        scale: 1,
        transformOrigin: "50% 50%",
        ease: "expo.out"
      });
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <div
      className={type === 'pic' ? 'target_pic' : 'target_box'}
      ref={target}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </div>
  );
};

export default Button;