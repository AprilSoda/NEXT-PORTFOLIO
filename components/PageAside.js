import React, { useState } from 'react';
import useIsMobile from './useIsMobile';
import PageMobileCategory from './PageMobileCategory';

//SVG
import SVG_OPEN from '../public/SVG_OPEN.svg';
import SVG_CLOSE from '../public/SVG_CLOSE.svg';

export default function PageAside({ blogs, setSelectedCategory, selectedCategory }) {
  const [handleMobileCateogry, setHandleMobileCateogry] = useState(false);

  // 블로그 데이터에서 카테고리 추출
  const allMultiSelectNames = blogs.flatMap(blog =>
    blog.properties.cateogry.multi_select.map(item => item.name)
  );
  const Categories = ["ALL", ...new Set(allMultiSelectNames)];

  return (
    <>
      <div className="head-wrap">
        <PageMobileCategory
          handleMobileCateogry={handleMobileCateogry}
          setHandleMobileCateogry={setHandleMobileCateogry}
          Categories={Categories}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <div className="head-category-area">
          <button className="head-category" onClick={() => { setHandleMobileCateogry(!handleMobileCateogry) }}>
            {selectedCategory}
            <span>
              <SVG_OPEN />
            </span>
          </button>
        </div>
      </div>
      <aside className="nav-area active">
        <div className="nav-container">
          <div className="nav-inner scrollbar--hidden">
            <a className="btn-cancel"> <SVG_CLOSE /> </a>
            <ul className="nav-items">
              <li className="cate-level-1  is--open">
                <a className="item is--on"><span>🔥</span>인기 카테고리</a>
                <ul className="level-2-wrap">
                  {Categories.map((category, index) => {
                    return (
                      <li className="cate-level-2" key={index}>
                        <a
                          className={`item ${selectedCategory === category ? 'is--on' : ''}`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};