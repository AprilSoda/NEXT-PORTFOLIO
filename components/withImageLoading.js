import React, { useState, useEffect } from 'react';
import Head from 'next/head';

function withImageLoading(WrappedComponent, imageUrls) {
  return function WithImageLoading(props) {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
      const imagePromises = imageUrls.map((imageUrl) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = imageUrl;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      const timeout = setTimeout(() => {
        setImagesLoaded(true);
      }, 10000);

      Promise.all(imagePromises)
        .then(() => {
          clearTimeout(timeout);
          setImagesLoaded(true);
        })
        .catch((error) => {
          console.error('Error loading images:', error);
          clearTimeout(timeout);
          setImagesLoaded(true);
        });
    }, []);

    return imagesLoaded ? (
      <WrappedComponent {...props} />
    ) : (
    <>
    <div className="animation-container">
        {/* <div className="red-line">
            <div className="green-line" />
        </div> */}
        <div className='text'>Loading...</div>
    </div>
    </>
    );
  };
}

export default withImageLoading;
