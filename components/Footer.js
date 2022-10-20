import React from 'react'

function Footer() {

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    };

  return (
    <footer>
    <p>Copyright © 2021 Kim Tae Kyun</p>
    <button onClick={scrollToTop}>↑ Back to top</button>
    </footer>
  )
}

export default Footer