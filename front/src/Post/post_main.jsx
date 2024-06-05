import React, { useState } from "react";
import "./post_main.css";
import { useNavigate } from "react-router-dom";
import { PiPencilLineFill } from "react-icons/pi";
import { TbListSearch } from "react-icons/tb";

const Empty = () => {
  const navigate = useNavigate();

  // 하드코딩된 게시글 데이터
  const posts = [
    "헬로 월드가 안 나와요.",
    "제가 원하는 결과가 안 나와요.",
    "코딩이 즐거워요.",
    "print,console.log,for,if,else,while,enumerate",
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

  return (
    <div className="Poster-container">
      <section className="post-top">
        <div className="post-top-left">
          <div className="new-hot">
            <div>New</div>
            <div>Hot</div>
          </div>
          <ul className="keyword">
            <li>많이뜨는</li>
            <li>키워드</li>
          </ul>
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
            <h4>카테고리</h4>
          </div>
          <li>카테</li>
          <li>고리</li>
          <li>여러개</li>
        </ul>
        <ul className="post-list">
          <div>
            <h4>게시글목록</h4>
          </div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <li key={index}>{post}</li>
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
