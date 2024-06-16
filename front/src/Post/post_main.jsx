import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 import

import './post_main_pagination.css';
import './post_main.css';

const Empty = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(15); // 페이지당 게시글 수 기본값

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
  };

  useEffect(() => {
    // 서버에서 공지 데이터를 가져옴
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/notice/view');
        setNotices(response.data);
        setLoading(false);
      } catch (err) {
        setError('공지를 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    // 서버에서 게시글 데이터를 가져옴
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/post/latest');
        setPosts(response.data);
        setFilteredPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('게시글을 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 검색 핸들러
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = posts.filter((post) =>
      post.post_title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    navigate(`/post_view/${post.post_id}`, { state: { post } });
  };

  // 페이지 변경 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // 페이지당 게시글 수 변경 핸들러
  const handlePostsPerPageChange = (e) => {
    setPostsPerPage(Number(e.target.value));
    setCurrentPage(0); // 페이지 수 변경 시 첫 페이지로 이동
  };

  const offset = currentPage * postsPerPage;
  const currentPageData = filteredPosts.slice(offset, offset + postsPerPage);

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const differenceInDays = (now - date) / (1000 * 60 * 60 * 24);

    if (differenceInDays < 1) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } else {
      return date.toLocaleDateString('ko-KR');
    }
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
          <h2>공지사항</h2>
        </div>
      </section>
      <section className="post-top">
        <ul className="notice-list">
          <h4 className="post-main-meta">
            <div className="post-main-title">제목</div>
            <div className="post-main-user-name">작성자</div>
            <div className="post-main-date">작성날짜</div>
          </h4>
          {notices.length > 0 ? (
            notices.slice(0, 3).map((post, index) => (
              <li key={index} onClick={() => handlePostClick(post)}>
                <div className="post-main-meta">
                  <div className="post-main-title">
                    <img
                      src="/icons/notice_icon.png"
                      alt=""
                      className="post-main-language-icon"
                    />{' '}
                    {post.post_title}
                  </div>
                  <div className="post-main-user-name">{post.user_id}</div>
                  <div className="post-main-date">
                    {formatDate(post.post_date)}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>게시글이 없습니다.</li>
          )}
        </ul>
      </section>
      <section className="post-top">
        <div className="post-top-left">
          <h2>전체 게시글</h2>
        </div>
        <div className="post-top-right">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요."
          />
        </div>
        <div className="posts-per-page">
          <label htmlFor="postsPerPage">게시글 보기: </label>
          <select
            id="postsPerPage"
            value={postsPerPage}
            onChange={handlePostsPerPageChange}
          >
            <option value={10}>10개 씩</option>
            <option value={15}>15개 씩</option>
            <option value={30}>30개 씩</option>
            <option value={50}>50개 씩</option>
          </select>
        </div>
      </section>
      <section className="post-mid">
        <ul className="post-cate">
          <div>
            <h4>🔥Hot</h4>
          </div>
          <li>React</li>
          <li>Hello</li>
          <li>GitHub</li>
        </ul>
        <ul className="post-list">
          <h4 className="post-main-meta">
            <div className="post-main-title">제목</div>
            <div className="post-main-user-name">작성자</div>
            <div className="post-main-date">작성날짜</div>
          </h4>
          {currentPageData.length > 0 ? (
            currentPageData.map((post, index) => (
              <li key={index} onClick={() => handlePostClick(post)}>
                <div className="post-main-meta">
                  <div className="post-main-title">
                    <img
                      src={languageIcons[post.language]}
                      alt=""
                      className="post-main-language-icon"
                    />{' '}
                    {post.post_id}. {post.post_title}
                  </div>
                  <div className="post-main-user-name">{post.user_id}</div>
                  <div className="post-main-date">
                    {formatDate(post.post_date)}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>게시글이 없습니다.</li>
          )}
        </ul>
      </section>
      <section className="post-bot">
        <ReactPaginate
          previousLabel={'이전'}
          nextLabel={'다음'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(filteredPosts.length / postsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </section>
    </div>
  );
};

export default Empty;
