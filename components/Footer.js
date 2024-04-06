import React from 'react'

function Footer() {

  //using moment.js to get current year
  const year = new Date().getFullYear();


  return (
    <footer>
      <div>
        <p>Copyright {year} © All rights reserved </p>
        <button> Back to top</button>
      </div>
    </footer>
  )
}

export default Footer