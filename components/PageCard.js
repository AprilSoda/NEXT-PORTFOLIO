import React, { useEffect, useState, useRef, useContext } from 'react';
import PageTime from '../components/PageTime';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

gsap.config({
  autoSleep: 60,
  force3D: false,
});

import { MouseContext } from '../components/MouseContext';

export default function PageCard({ blogs, selectedCategory }) {
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const { handleCursorChange } = useContext(MouseContext);

  const container = useRef(null);

  useEffect(() => {
    // 카테고리 필터링
    const updatedBlogs = blogs.filter(blog => {
      // multi_select는 배열 형태로 되어 있음
      const categories = blog.properties.cateogry.multi_select.map(item => item.name);
      return selectedCategory === 'ALL' || categories.includes(selectedCategory);
    });
    setFilteredBlogs(updatedBlogs);
  }, [selectedCategory, blogs]);

  //Animation
  useGSAP(() => {
    // 초기 상태 설정
    gsap.set(".card", { opacity: 0, y: 50 });

    // 애니메이션 실행
    gsap.to(".card", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
    });
  }, { scope: container, revertOnUpdate: true, dependencies: [filteredBlogs] });



  return (
    <>
      <main className="content-area">
        <div className="item-list top-group">
          <div className="title">
            <h1>Recent Post</h1>
          </div>
          <div className="card-area" ref={container}>
            {filteredBlogs.map((blog, index) => (
              <div className="card"
                key={index + 1}
              >
                <div className="card-inner">
                  <a
                    className="thumnail"
                    href={`blogs/${blog.id}`}
                    onMouseEnter={() => handleCursorChange("hover")}
                    onMouseLeave={() => handleCursorChange("off")}
                  >
                    <img loading="lazy" src={blog.cover ? blog.cover.external.url : ""} />
                  </a>
                  <div className="title-subtitle-date">
                    <div className="title"><a href={`blogs/${blog.id}`}>{blog.properties.title.title[0].plain_text}</a></div>
                    {/* <div className="subtitle"><span>수원대학교 졸업작품 오하꼬의 조명감독의 입장에서 적은 블로그입니다.</span></div> */}
                    <div className="date">
                      <span> {PageTime(blog.created_time)} </span>
                    </div>
                  </div>
                  <div className="tag_category">
                    {blog.properties.cateogry.multi_select.slice(0, 2).map((item, index) => (
                      <a key={index} href="#">{item.name}</a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}