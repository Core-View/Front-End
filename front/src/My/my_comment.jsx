import React, { useState, useEffect } from 'react';
import './my_comment.css';
import { useNavigate } from 'react-router-dom';
import { TbListSearch } from 'react-icons/tb';

const Empty = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredPosts(
      comments.filter((comment) =>
        comment.post_title.toLowerCase().includes(query.toLowerCase())
      )
    );
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
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

  // 데이터가 배열인지 확인하는 코드 추가
  useEffect(() => {
    if (!Array.isArray(filteredPosts)) {
      setFilteredPosts([]);
    }
  }, [filteredPosts]);

  // 현재 페이지에 따라 표시할 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = Array.isArray(filteredPosts)
    ? filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="my_comment-container">
      <section className="my_comment-top">
        <div className="my_comment-top-right">
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
            <h4>내가 댓글 쓴 글</h4>
          </div>
          {currentPosts.length > 0 ? (
            currentPosts.map((comment) => (
              <li
                key={comment.post_id}
                onClick={() => handlePostClick(comment.post_id)}
              >
                {comment.post_title}
              </li>
            ))
          ) : (
            <li>검색 결과가 없습니다.</li>
          )}
        </ul>
      </section>
      <section className="my_comment-bot">
        <ul className="my_comment_pagination">
          {Array.from(
            { length: Math.ceil(filteredPosts.length / postsPerPage) },
            (_, i) => (
              <li
                key={i + 1}
                className={`my_comment_page-item ${
                  currentPage === i + 1 ? 'active' : ''
                }`}
              >
                <button
                  onClick={() => paginate(i + 1)}
                  className="my_comment_page-link"
                >
                  {i + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
};

export default Empty;
