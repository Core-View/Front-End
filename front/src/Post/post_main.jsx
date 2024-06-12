import React, { useState, useEffect } from "react";
import "./post_main.css";
import { useNavigate } from "react-router-dom";
import { PiPencilLineFill } from "react-icons/pi";
import { TbListSearch } from "react-icons/tb";
import axios from "axios";

const Empty = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 서버에서 게시글 데이터를 가져옴
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/post/latest");
        setPosts(response.data);
        setFilteredPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError("게시글을 가져오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 검색 핸들러
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredPosts(
      posts.filter((post) =>
        post.post_title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    navigate(`/post_view/${post.post_id}`, { state: { post } });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="poster-container">
      <section className="post-top">
        <div className="post-top-left">
          {/* 추가 기능을 위한 공간 */}
        </div>
        <div className="post-top-right">
          <div className="pencil">
            <PiPencilLineFill
              className="post_search"
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
                [{post.language}] {post.post_title}
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
