import React, { useState, useEffect } from "react";
import "./my_comment.css";
import { useNavigate } from "react-router-dom";
import { PiPencilLineFill } from "react-icons/pi";
import { TbListSearch } from "react-icons/tb";

const Empty = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredPosts(
      comments.filter((comment) =>
        comment.feedback_comment.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handlePostClick = (post_id) => {
    navigate(`/post_view/${post_id}`);
  };

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mypage/1/feedback`);
        const data = await response.json();
        setComments(data || []); 
        setFilteredPosts(data || []); // 초기 상태를 전체 댓글로 설정
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };
    fetchCommentData();
  }, []);

  return (
    <div className="my_comment-container">
      <section className="my_comment-top">
        <div className="my_comment-top-right">
          <div className="pencil">
            <PiPencilLineFill
              className="my_comment_search"
              onClick={() => {
                navigate("/post_code");
              }}
            />
          </div>
          <TbListSearch className="my_comment_search" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="검색"
          />
        </div>
      </section>
      <section className="my_comment-mid">
        <ul className="my_comment-list">
          <div>
            <h4>전체 댓글 쓴 글</h4>
          </div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((comment) => (
              <li key={comment.post_id} onClick={() => handlePostClick(comment.post_id)}>
                {comment.post_title}
              </li>
            ))
          ) : (
            <li>검색 결과가 없습니다.</li>
          )}
        </ul>
      </section>
      <section className="my_comment-bot">
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
