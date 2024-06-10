import React, { useState } from "react";
import "./post_main.css";
import { useNavigate } from "react-router-dom";
import { PiPencilLineFill } from "react-icons/pi";
import { TbListSearch } from "react-icons/tb";

const Empty = () => {
  const navigate = useNavigate();

  // 하드코딩된 게시글 데이터
  const posts = [
    "Hello, World가 안 나와요.",
    "제가 원하는 결과가 안 나와요.",
    "React와 Node.js를 이용한 웹 개발 질문",
    "Python으로 데이터 분석",
    "JavaScript 비동기 프로그래밍 관련 질문",
    "HTML5와 CSS3의 새로운 기능",
    "Machine Learning에서 기초 수학은 뭘 배우나요?",
    "Git과 GitHub을 이용한 버전 관리는 어떻게 하나요?",
    "Docker와 Kubernetes로 애플리케이션 배포"
  ];

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  // 검색 핸들러
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredPosts(
      posts.filter((post) =>
        post.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    navigate("/post_view", { state: { post } });
  };

  return (
    <div className="Poster-container">
      <section className="post-top">
        <div className="post-top-left">
          {/* <div className="new-hot">
            <div>New</div>
            <div>Hot</div>
          </div>
          <ul className="keyword">
            <li>많이뜨는</li>
            <li>키워드</li>
          </ul> */}
        </div>
        <div className="post-top-right">
          <div className="pencil">
            <PiPencilLineFill
              className="post_search "
              onClick={() => {
                navigate("/post_code");
              }}
            />
          </div>
          <TbListSearch className="post_search" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="검색"
          />
        </div>
      </section>
      <section className="post-mid">
        <ul className="post-cate">
          <div>
            <h4>많이 뜨는 카테고리</h4>
          </div>
          <li>React</li>
          <li>Hello</li>
          <li>GitHub</li>
        </ul>
        <ul className="post-list">
          <div>
            <h4>전체 게시글</h4>
          </div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <li key={index} onClick={() => handlePostClick(post)}>
                {post}
              </li>
            ))
          ) : (
            <li>검색 결과가 없습니다.</li>
          )}
        </ul>
      </section>
      <section className="post-bot">
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </section>
    </div>
  );
};

export default Empty;