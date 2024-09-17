import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageAside({ blogs, setSelectedCategory, selectedCategory }) {

  // 블로그 데이터에서 카테고리 추출
  const allMultiSelectNames = blogs.flatMap(blog =>
    blog.properties.cateogry.multi_select.map(item => item.name)
  );
  const Categories = ["ALL", ...new Set(allMultiSelectNames)];

  //Animation
  const asideRef = useRef(null);
  // useEffect(() => {
  //   gsap.from()

  return (
    <>
      <div className="head-wrap">
        <div className="head-category-area">
          <button className="head-category">
            {selectedCategory}
            <span>
              <svg width="12" height="8" viewBox="0 0 12 8">
                <path
                  d="M6.00006 7.3146L11.6569 1.65775L10.2427 0.243536L6.00064 4.4856L1.75723 0.242188L0.343018 1.6564L6.00006 7.3146Z">
                </path>
              </svg>
            </span>
          </button>
        </div>
      </div>
      <aside className="nav-area is--open">
        <div className="nav-container">
          <div className="nav-inner scrollbar--hidden">
            <a className="btn-cancel">닫기</a>
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