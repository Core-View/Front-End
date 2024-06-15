import React, { useState, useEffect } from 'react';
import './my_posting.css';
import { useNavigate } from 'react-router-dom';
import { PiPencilLineFill } from 'react-icons/pi';
import { TbListSearch } from 'react-icons/tb';

const Empty = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredPosts(
      posts.filter((post) =>
        post.post_title.toLowerCase().includes(query.toLowerCase())
      )
    );
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
  };

  const handlePostClick = (post_id) => {
    navigate(`/post_view/${post_id}`);
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mypage/123/posts`);
        const data = await response.json();
        setPosts(data || []);
        setFilteredPosts(data || []); // 초기 상태를 전체 게시글로 설정
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };
    fetchPostData();
  }, []);

  // filteredPosts가 배열인지 확인하고 배열이 아니면 빈 배열로 설정
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
    <div className="my_Poster-container">
      <section className="my_post-top">
        <div className="my_post-top-right">
          <div className="my_pencil">
            <PiPencilLineFill
              className="my_post_search"
              onClick={() => {
                navigate('/post_write');
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
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <li
                key={post.post_id}
                onClick={() => handlePostClick(post.post_id)}
              >
                {post.post_title}
              </li>
            ))
          ) : (
            <li>검색 결과가 없습니다.</li>
          )}
        </ul>
      </section>
      <section className="my_post-bot">
        <ul className="my_post_pagination">
          {Array.from(
            { length: Math.ceil(filteredPosts.length / postsPerPage) },
            (_, i) => (
              <li
                key={i + 1}
                className={`my_post_page-item ${
                  currentPage === i + 1 ? 'active' : ''
                }`}
              >
                <button
                  onClick={() => paginate(i + 1)}
                  className="my_post_page-link"
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
