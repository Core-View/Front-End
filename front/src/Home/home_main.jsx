import React, { useState, useEffect } from 'react';
import './home_main.css';
import { SlArrowRight } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 import

const Main = () => {
  const navigate = useNavigate();

  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [newestPosts, setNewestPosts] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    navigate(`/post_view/${post.post_id}`, { state: { post } });
  };

  useEffect(() => {
    // 서버에서 기여도 랭킹 가져옴
    const fetchFeedback = async () => {
      try {
        const rankingResponse = await axios.get(
          `http://localhost:3000/post/top-contributors`
        );

        setRanking(rankingResponse.data);
        setLoading(false);
      } catch (err) {
        setError(`랭킹을 가져오는 데 실패했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [latestResponse, likesResponse] = await Promise.all([
          axios.get('http://localhost:3000/post/latest'),
          axios.get('http://localhost:3000/post/latest'),
        ]);

        setNewestPosts(latestResponse.data.slice(0, 5));
        setRecommendedPosts(likesResponse.data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError(`게시글을 가져오는 데 실패했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
  };

  return (
    <div className="home-container">
      <section className="home_left">
        <div className="ranking">
          <h2>기여도 랭킹</h2>
          <ul className="ranking-list">
            {ranking.map((user, index) => (
              <li key={index}>
                <div className="ranking-meta">
                  <div className="ranking-user-id">{user.user_id}</div>
                  <div className="ranking-contribution">
                    {user.total_contribution}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="home_mid">
        <div className="post recommend">
          <h2>추천 게시글 (좋아요 순)</h2>
          <ul className="postcode">
            {recommendedPosts.map((post, index) => (
              <li key={index} onClick={() => handlePostClick(post)}>
                <div className="post-main-meta">
                  <div className="post-main-title">
                    <img
                      src={languageIcons[post.language]}
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
            ))}
          </ul>
        </div>
        <div className="post newest">
          <h2>최신 게시글 (시간 순)</h2>
          <ul className="postcode">
            {newestPosts.map((post, index) => (
              <li key={index} onClick={() => handlePostClick(post)}>
                <div className="post-main-meta">
                  <div className="post-main-title">
                    <img
                      src={languageIcons[post.language]}
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
            ))}
          </ul>
        </div>
      </section>
      <section className="home_right" onClick={() => navigate('/post_main')}>
        <SlArrowRight style={{ fontSize: '60px' }} />
        <div>전체 보기</div>
      </section>
    </div>
  );
};

export default Main;
