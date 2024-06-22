import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 import

import { format } from 'date-fns';
import { Cookies } from 'react-cookie';

import './my_like.css';

const Empty = () => {
    const cookies = new Cookies();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(15); // 페이지당 게시글 수 기본값
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
  };
  useEffect(() => {
    const userId = cookies.get('user_id');
    if (userId) {
      setIsLoggedIn(true);
      fetchPosts(userId);
    } else {
      navigate('/users/sign-in');
    }
    setIsLoading(false);
  }, [navigate]);

  const fetchPosts = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3000/mypage/${userId}/feedback`);
        const postsData = await response.json();
        const processedData = postsData.map(comment => ({
          ...comment,
          profile_picture: (comment.profile_picture === "null" || !comment.profile_picture)
            ? `${process.env.PUBLIC_URL}/images/original_profile.png`
            : comment.profile_picture,
        }));
        setPosts(processedData || []);
        setFilteredPosts(processedData || []);
        setLoading(false);
      } catch (error) {
        setError('게시글을 가져오는 데 실패했습니다.');
        console.error('Error fetching like data:', error);
        setLoading(false);
      }
  };

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
    navigate(`/post_view/${post.post_id}`);
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
    return format(date, 'yyyy-MM-dd', { locale: ko });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to='/users/sign-in' replace />;
  }

  return (
    <div className="mylike-container">
      <section className="mylike-top">
        <div className="mylike-top-left">
          <h2>전체 게시글</h2>
        </div>
        <div className="mylike-top-right">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요."
          />
        </div>
        <div className="mylike-per-page">
          <label htmlFor="mylikePerPage">게시글 보기: </label>
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
      <section className="mylike-mid">
        <ul className="mylike-list">
          <h4 className="mylike-main-meta">
            <div className="mylike-main-title">제목</div>
            <div className="mylike-main-user-name">작성자</div>
            <div className="mylike-main-date">작성날짜</div>
          </h4>
          {currentPageData.length > 0 ? (
            currentPageData.map((post, index) => (
              <li key={index} onClick={() => handlePostClick(post)}>
                <div className="mylike-main-meta">
                  <div className="mylike-main-title">
                    <img
                      src={languageIcons[post.language]}
                      alt=""
                      className="mylike-main-language-icon"
                    />{' '}
                    {post.post_id}. {post.post_title}
                  </div>
                  <div className='my-like-main-profile'>
                    <img
                      src={post.profile_picture}
                      alt="profile"
                      className="my-like-main-picture"/>
                  </div>
                  <div className="mylike-main-user-name">
                    {post.user_nickname || '탈퇴한 회원'}
                  </div>
                  <div className="mylike-main-date">
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
      <section className="mylike-bot">
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
