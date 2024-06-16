import React, { useState, useEffect } from 'react';
import './home_main.css';
import { SlArrowRight } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 import

const Main = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 정보를 저장할 상태
  const [userInfos, setUserInfos] = useState({});

  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [newestPosts, setNewestPosts] = useState([]);
  const [ranking, setRanking] = useState([]);

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
          data: { nickname: '탈퇴한 회원' }, // 사용자 정보가 없는 경우 처리
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
    const fetchPostsAndRankings = async () => {
      try {
        const [latestResponse, likesResponse, rankingResponse] =
          await Promise.all([
            axios.get('http://localhost:3000/post/latest'),
            axios.get('http://localhost:3000/post/mostlike'),
            axios.get('http://localhost:3000/post/top-contributors'),
          ]);

        const newestPostsData = latestResponse.data.slice(0, 5);
        const recommendedPostsData = likesResponse.data.slice(0, 5);
        const rankingData = rankingResponse.data;

        const userIds = [
          ...new Set([
            ...newestPostsData.map((post) => post.user_id),
            ...recommendedPostsData.map((post) => post.user_id),
            ...rankingData.map((rank) => rank.user_id),
          ]),
        ];

        await fetchUserInfos(userIds);

        setNewestPosts(newestPostsData);
        setRecommendedPosts(recommendedPostsData);
        setRanking(rankingData);
        setLoading(false);
      } catch (err) {
        setError(`데이터를 가져오는 데 실패했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPostsAndRankings();
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
                  <div className="ranking-user-id">
                    {userInfos[user.user_id]?.nickname || '탈퇴한 회원'}
                  </div>
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
                  <div className="post-main-user-name">
                    {userInfos[post.user_id]?.nickname || '탈퇴한 회원'}
                  </div>
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
                  <div className="post-main-user-name">
                    {userInfos[post.user_id]?.nickname || '탈퇴한 회원'}
                  </div>
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
