import React from 'react'

function Footer() {

//using moment.js to get current year
const year = new Date().getFullYear();


const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    };

  return (
    <footer>
    <p>Copyright © {year} Kim Tae Kyun</p>
    <button onClick={scrollToTop}>↑ Back to top</button>
    </footer>
  )
}

export default Footer