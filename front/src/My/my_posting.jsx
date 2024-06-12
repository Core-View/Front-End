import React, { useState, useEffect } from "react";
import "./my_posting.css";
import { useNavigate } from "react-router-dom";
import { PiPencilLineFill } from "react-icons/pi";
import { TbListSearch } from "react-icons/tb";

const Empty = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredPosts(
      posts.filter((post) =>
        post.post_title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handlePostClick = (post_id) => {
    navigate(`/post_view/${post_id}`);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mypage/1/posts`);
        const data = await response.json();
        setPosts(data || []);
        setFilteredPosts(data || []); // 초기 상태를 전체 게시글로 설정
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };
    fetchPostData();
  }, []);

  return (
    <div className="my_Poster-container">
      <section className="my_post-top">
        <div className="my_post-top-right">
          <div className="my_pencil">
            <PiPencilLineFill
              className="my_post_search"
              onClick={() => {
                navigate("/post_code");
              }}
            />
          </div>
          <TbListSearch className="my_post_search" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="검색"
          />
        </div>
      </section>
      <section className="my_post-mid">
        <ul className="my_post-list">
          <div>
            <h4>전체 게시글</h4>
          </div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <li key={post.post_id} onClick={() => handlePostClick(post.post_id)}>
                {post.post_title}
              </li>
            ))
          ) : (
            <li>검색 결과가 없습니다.</li>
          )}
        </ul>
      </section>
      <section className="my_post-bot">
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
