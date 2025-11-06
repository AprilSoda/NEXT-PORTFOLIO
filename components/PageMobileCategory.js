import React, { useRef, useEffect } from "react";
import gsap from "gsap";

import { AnimatePresence, motion } from "framer-motion"; // Framer Motion for handling presence
import SVG_CLOSE from "../public/SVG_CLOSE.svg";

const PageMobileCategory = ({ handleMobileCateogry, setHandleMobileCateogry, Categories, setSelectedCategory, selectedCategory }) => {
  const container = useRef(null);

  useEffect(() => {
    if (!handleMobileCateogry) {
      setHandleMobileCateogry(false);
    }
  }, [handleMobileCateogry, setHandleMobileCateogry]);

  const handleClick = () => {
    setHandleMobileCateogry(false)
  };

  return (
    <AnimatePresence>
      {handleMobileCateogry && (
        <motion.div className="modal_cate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="modal_overlay"> </div>
          <motion.div className='modal_body'
            initial={{ y: "2rem" }}
            animate={{ y: 0 }}
            exit={{ y: "2rem" }}
            transition={{ duration: 0.2 }}
            onClick={handleClick}
          >
            <div className="modal_content">
              <div className="modal_overflow-y scrollbar--hidden">
                <div className='modal_header'>
                  <div className='mod_header'>
                    <div> {selectedCategory} </div>
                    <div onClick={handleClick}> <SVG_CLOSE /> </div>
                  </div>
                  <hr />
                </div>
                <div className='mod_content'>
                  <ul className='feed_item_list'>
                    {Array.isArray(Categories) ? Categories.map((category, index) => (
                      <li key={index}>
                        <a
                          className={`item ${selectedCategory === category ? 'is--on' : ''}`}
                          onClick={() => { setSelectedCategory(category); setHandleMobileCateogry(false); }}
                        >
                          {category}
                        </a>
                      </li>
                    )) : "No Category"}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageMobileCategory;
