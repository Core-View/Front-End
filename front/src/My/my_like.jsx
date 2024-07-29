import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(15); // 페이지당 게시글 수 기본값

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
    other: '/images/language_icons/other_icon.png',
  };
  useEffect(() => {
    fetchPosts();;
  });

  const fetchPosts = async () => { //user가 좋아요한 글의 정보를 가져오는 api요청
    axios
      .get(`http://localhost:3000/mypage/likedPosts`, {
        headers: {
          Authorization: cookies.get('accessToken'),
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          const postsData = response.data.likedPosts;
          const processedData = postsData.map((like) => ({
            ...like,
            profile_picture:
              like.profile_picture === 'null' || !like.profile_picture
                ? `${process.env.PUBLIC_URL}/images/original_profile.png`
                : `${process.env.PUBLIC_URL}/${like.profile_picture}`,
          }));
          setPosts(processedData || []);
          setFilteredPosts(processedData || []);
        }
      })
      .catch((err) => {
        console.log('좋아요 페이지 접근 요청 할때 catch된 에러', err.messsage);
        if (err.response.status === 401) {
          console.log(
            '401 에러 가 떴을때! 만료가 되었답니다! 그리고 refresh 토큰 받는 요청 get으로 보냄'
          );
          axios
            .get('http://localhost:3000/token/refresh', {
              headers: {
                Authorization: cookies.get('accessToken'),
              },
            })
            .then((response) => {
              if (response.status === 200) {
                console.log(
                  '리프래시 토큰으로 요청 보냈을때 받은 응답',
                  response
                );
                cookies.set('accessToken', response.data.Authorization);
                console.log('토큰 설정해주기', cookies.get('accessToken'));
                console.log('잘 됬으니까 다시 좋아요 페이지로 넘어가기');
                return navigate('/my/like');
              } else if (response.status === 400) {
                console.log('그 밖의 오류났을때, 일단 400일때 그냥 통과하기');
                return navigate(-1);
              }
            })
            .catch((err) => {
              if (err.response.status === 401) {
                console.log(
                  '리프래시에서 401이 떴을때, 권한 다 지우고 로그인 화면으로 보내기'
                );
                alert('권한이 없습니다.');
                cookies.remove('accessToken');
                cookies.remove('admin');
                console.log(
                  '권한 다 지웠습니다',
                  cookies.get('accessToken'),
                  cookies.get('admin')
                );
                return navigate('/users/sign-in');
              }
            });
        }
      });
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
