import React, { useState, useEffect } from 'react';
import styles from '../styles/Arrow.module.scss';

const Arrow = () => {
  const [showArrow, setShowArrow] = useState("hide");


  // 상황에 따라 왼쪽 아래에 있는 화살표를 보여주거나 숨김

  // 홈페이지이거나 스크롤이 0이면 화살표를 숨김
  // 스크롤이 100px 이상이면 화살표를 보여주고
  // 숨기는 방식은 .transition_children > * 요소의 높이를 구해서 스크롤이 그 높이보다 크거나 같으면 숨김
  // 그래서 footer가 좀 크면 화살표가 더 빨리 사라짐

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const nextElement = document.querySelector('.transition_children > *').offsetHeight;


      if (window.location.pathname === '/' || scrollTop <= 0) {
        setShowArrow("hide");
      } else {
        if (scrollTop > 100) {
          setShowArrow("show");
          if (scrollTop + windowHeight >= nextElement + 50) {
            setShowArrow("bottom");
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={styles.ar}>
      <button
        className={`${styles.bt} ${styles[showArrow]}`}
        onClick={scrollToTop}
      >
        <span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrowIcon}><path d="M13.707 9.293C13.5195 9.10553 13.2652 9.00021 13 9.00021C12.7348 9.00021 12.4805 9.10553 12.293 9.293L9 12.586V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V12.586L3.707 9.293C3.5184 9.11084 3.2658 9.01005 3.0036 9.01233C2.7414 9.0146 2.49059 9.11977 2.30518 9.30518C2.11977 9.49059 2.0146 9.7414 2.01233 10.0036C2.01005 10.2658 2.11084 10.5184 2.293 10.707L7.293 15.707C7.48053 15.8945 7.73484 15.9998 8 15.9998C8.26516 15.9998 8.51947 15.8945 8.707 15.707L13.707 10.707C13.8945 10.5195 13.9998 10.2652 13.9998 10C13.9998 9.73484 13.8945 9.48053 13.707 9.293Z"></path></svg></span>
      </button>
    </nav>
  );
};

export default Arrow;
