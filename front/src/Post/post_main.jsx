import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

import './post_main_pagination.css';
import './post_main.css';

const Empty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page') || '0', 10);
  const initialSortOrder = queryParams.get('sort') || 'latest';

  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [postsPerPage, setPostsPerPage] = useState(15);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const [userInfos, setUserInfos] = useState({});

  const languageIcons = {
    other: '/images/language_icons/other_icon.png',
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
  };

  const fetchUserInfos = async (userIds) => {
    const userInfoPromises = userIds.map((id) =>
      axios
        .get(`http://localhost:3000/mypage/${id}`)
        .then((response) => ({
          userId: id,
          data: response.data,
        }))
        .catch(() => ({
          userId: id,
          data: { nickname: '탈퇴한 회원' },
        }))
    );

    const userInfoResponses = await Promise.all(userInfoPromises);

    const newUserInfos = {};
    userInfoResponses.forEach((response) => {
      newUserInfos[response.userId] = response.data;
    });

    setUserInfos((prevUserInfos) => ({
      ...prevUserInfos,
      ...newUserInfos,
    }));
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/notice/view');
        setNotices(response.data.notice);
        setLoading(false);
      } catch (err) {
        setError('공지를 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/post/${sortOrder}`
        );
        const postsData = response.data;

        const userIds = [...new Set(postsData.map((post) => post.user_id))];
        await fetchUserInfos(userIds);

        setPosts(postsData);
        setFilteredPosts(postsData);
        setLoading(false);
      } catch (err) {
        setError('게시글을 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortOrder]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '0', 10);
    const sort = queryParams.get('sort') || 'latest';

    if (page !== currentPage) {
      setCurrentPage(page);
    }
    if (sort !== sortOrder) {
      setSortOrder(sort);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterPosts(query, selectedLanguages);
    setCurrentPage(0);
  };

  const handleLanguageToggle = (language) => {
    const newSelectedLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((lang) => lang !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(newSelectedLanguages);
    filterPosts(searchQuery, newSelectedLanguages);
    setCurrentPage(0);
  };

  const filterPosts = (query, languages) => {
    let filtered = posts;
    if (query) {
      filtered = filtered.filter((post) =>
        post.post_title.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (languages.length > 0) {
      filtered = filtered.filter((post) => languages.includes(post.language));
    }
    setFilteredPosts(filtered);
  };

  const handlePostClick = (post) => {
    navigate(`/post_view/${post.post_id}`);
  };

  const handleNoticeClick = (id) => {
    navigate(`/notice/view/${id}`);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
    navigate(`${location.pathname}?page=${selectedPage}&sort=${sortOrder}`);
  };

  const handlePostsPerPageChange = (e) => {
    setPostsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setLoading(true);
    setCurrentPage(0);
    navigate(`${location.pathname}?page=0&sort=${order}`);
  };

  const offset = currentPage * postsPerPage;
  const currentPageData = filteredPosts.slice(offset, offset + postsPerPage);

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
            [...notices]
              .reverse()
              .slice(0, 3)
              .map((notice, index) => (
                <li
                  key={index}
                  onClick={() => handleNoticeClick(notice.NOTICE_ID)}
                >
                  <div className="post-main-meta">
                    <div className="post-main-title">
                      <img
                        src="/icons/notice_icon.png"
                        alt=""
                        className="post-main-language-icon"
                      />{' '}
                      {notice.NOTICE_TITLE}
                    </div>
                    <div className="post-main-user-name"></div>
                    <div className="post-main-date">
                      {formatDate(notice.NOTICE_DATE)}
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
        <div className="view-all-button-container">
          <button
            className="view-all-button"
            onClick={() => navigate('/post_notification')}
          >
            공지 전체보기
          </button>
        </div>
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
      <section className="post-top">
        <div className="sort-buttons">
          <button
            className={sortOrder === 'latest' ? 'active' : ''}
            onClick={() => handleSortOrderChange('latest')}
          >
            최신순
          </button>
          <button
            className={sortOrder === 'mostlike' ? 'active' : ''}
            onClick={() => handleSortOrderChange('mostlike')}
          >
            좋아요순
          </button>
        </div>
      </section>
      <section className="post-mid">
        <div className="post-language-buttons">
          <button
            className={selectedLanguages.includes('other') ? 'active' : ''}
            onClick={() => handleLanguageToggle('other')}
          >
            <img
              src="/images/language_icons/other_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            기타
          </button>
          <button
            className={selectedLanguages.includes('c') ? 'active' : ''}
            onClick={() => handleLanguageToggle('c')}
          >
            <img
              src="/images/language_icons/c_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            C
          </button>
          <button
            className={selectedLanguages.includes('cpp') ? 'active' : ''}
            onClick={() => handleLanguageToggle('cpp')}
          >
            <img
              src="/images/language_icons/cpp_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            C++
          </button>
          <button
            className={selectedLanguages.includes('java') ? 'active' : ''}
            onClick={() => handleLanguageToggle('java')}
          >
            <img
              src="/images/language_icons/java_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            Java
          </button>
          <button
            className={selectedLanguages.includes('python') ? 'active' : ''}
            onClick={() => handleLanguageToggle('python')}
          >
            <img
              src="/images/language_icons/python_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            Python
          </button>
        </div>
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
                    {/* {post.post_id}. {post.post_title} */}
                    {post.post_title}
                  </div>
                  <div className="post-main-user-name">
                    {userInfos[post.user_id]?.nickname || '탈퇴한 회원'}
                  </div>
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
          forcePage={currentPage} // 현재 페이지를 강제로 설정합니다.
        />
      </section>
    </div>
  );
};

export default Empty;
