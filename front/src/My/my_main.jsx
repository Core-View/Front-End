import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import './my_main.css';
import { parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 import
import { FaCircleCheck } from 'react-icons/fa6';
import { format } from 'date-fns';
import { Cookies } from 'react-cookie';
import Contribution from "../Common/Contribution";

const Mypage = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    nickname: '',
    email: '',
    profile_picture: '',
    introduction: '',
    contribute: '',
    likes_received: '',
  });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user_password, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const percentage = 22.6;

  const getColor = (percentage) => {
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 60) return '#8bc34a';
    if (percentage >= 40) return '#cddc39';
    if (percentage >= 20) return '#ffc107';
    return '#f44336';
  };
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
      fetchUserData(userId);
      fetchPostData(userId);
      fetchCommentData(userId);
      fetchLikeData(userId);
    } else {
      navigate('/users/sign-in');
    }
    setIsLoading(false);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/mypage/${userId}`);
      const data = await response.json();
      console.log('프로필이미지', data.profile_picture);
      if (!data.profile_picture) {
        data.profile_picture = `${process.env.PUBLIC_URL}/images/original_profile.png`;
      }
      setUserInfo(data);
      console.log('프로필이미지', data.profile_picture);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPostData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/mypage/${userId}/posts`);
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const fetchCommentData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/mypage/${userId}/feedback`);
      const data = await response.json();
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  const fetchLikeData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/mypage/${userId}/likedPosts`);
      const data = await response.json();
      setLikes(data || []);
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  const handlePasswordChange = (e) => {
    setUserPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/password/verify/${userInfo.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_password }),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/my_modify');
      } else {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setErrorMessage('비밀번호 검증 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd', { locale: ko });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to='/users/sign-in' replace />;
  }

  const handlePostClick = (post) => {
    navigate(`/post_view/${post.post_id}`);
  };

  return (
    <div className="my_all">
      <div className="contribution-bar">
        <div
          className="filled-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(percentage),
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span className="percentage-text">{`${percentage.toFixed(1)}%`}</span>
        </div>
      </div>
      <div className="myinfo_all">
        <div className="space1">
          <div className="image_profile">
            <img
              src={userInfo.profile_picture}
              alt="profile"
              className="my_profile"
            />
          </div>
          <div className="info_zone">
            <div className="name_zone">
              <span>{userInfo.nickname || '닉네임'}</span>
            </div>
            <br />
            <div className="intro_zone">
              <span>{userInfo.introduction || '자기 소개입니다'}</span>
            </div>
            <br />
          </div>
          <div className="activity">
            <div className="good">
              <span role="img" aria-label="heart" style={{ fontSize: '20px' }}>
                ❤️{userInfo.likes_received}
              </span>
            </div>
            <br />
            <div className="contribution">
              <Contribution contribute={userInfo.contribute} />
            </div>
            <br />
          </div>
          <div className="modify_zone">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setUserPassword('');
                setErrorMessage('');
              }}
              className="modi_link"
            >
              정보수정
            </button>
          </div>
        </div>
        <div className="space2">
          <div className="post_zone">
            <div className="my_posts">
              <Link to="/my_posting" className="all_post_link">
                나의 게시글
              </Link>
            </div>
            <div className="post_title">
              {posts.length > 0 ? (
                <ul className="post_code">
                  {posts.slice(0, 3).map((post,index) => (
                    <li key={post.post_id} onClick={() => handlePostClick(post)}>
                    <div className={`mymylike-main-meta ${index === posts.slice(0, 3).length - 1 ? 'no-underline' : ''}`}>
                      <div className="mymylike-main-title">
                        <img
                          src={languageIcons[post.language]}
                          alt=""
                          className="mymylike-main-language-icon"
                        />{' '}
                        {post.post_id}. {post.post_title}
                      </div>
                      <div className="mymylike-main-user-name">
                        {post.user_nickname || '탈퇴한 회원'}
                      </div>
                      <div className="mymylike-main-date">
                        {formatDate(post.post_date)}
                      </div>
                    </div>
                  </li>
                  ))}
                </ul>
              ) : (
                <p className="my_post_font">게시글이 없습니다.</p>
              )}
            </div>
          </div>
          <br />
          <br />
          <hr style={{ border: '1px solid #ddd' }} />
          <br />
          <br />
          <div className="comment_zone">
            <div className="my_comments">
              <Link to="/my_comment" className="all_comment_link">
                피드백 단 글
              </Link>
            </div>
            <hr
              style={{
                color: 'black',
                backgroundColor: 'black',
                height: '1px',
              }}
            />
            <div className="comment_title">
              {comments.length > 0 ? (
                <ul className="comment_code">
                  {comments.slice(0, 3).map((comment,index1) => (
                    <div className={`mymylike-main-meta ${index1 === comments.slice(0, 3).length - 1 ? 'no-underline' : ''}`}>
                      <div className="mymylike-main-title">
                        <img
                          src={languageIcons[comment.language]}
                          alt=""
                          className="mymylike-main-language-icon"
                        />{' '}
                        {comment.post_id}. {comment.post_title}
                      </div>
                      <div className="mymylike-main-user-name">
                        {comment.user_nickname || '탈퇴한 회원'}
                      </div>
                      <div className="mymylike-main-date">
                        {formatDate(comment.post_date)}
                      </div>
                    </div>
                  ))}
                </ul>
              ) : (
                <p>댓글 단 게시글이 없습니다.</p>
              )}
            </div>
          </div>
          <br />
          <br />
          <hr style={{ border: '1px solid #ddd' }} />
          <br />
          <br />
          <div className="comment_zone">
            <div className="my_comments">
              <Link to="/my_like" className="all_comment_link">
                내가 좋아요 한 글
              </Link>
            </div>
            <hr
              style={{
                color: 'black',
                backgroundColor: 'black',
                height: '1px',
              }}
            />
            <div className="comment_title">
              {likes.length > 0 ? (
                <ul className="comment_code">
                  {likes.slice(0, 3).map((like,index2) => (
                    <div className={`mymylike-main-meta ${index2 === likes.slice(0, 3).length - 1 ? 'no-underline' : ''}`}>
                    <div className="mymylike-main-title">
                      <img
                        src={languageIcons[like.language]}
                        alt=""
                        className="mymylike-main-language-icon"
                      />{' '}
                      {like.post_id}. {like.post_title}
                    </div>
                    <div className="mymylike-main-user-name">
                      {like.user_nickname || '탈퇴한 회원'}
                    </div>
                    <div className="mymylike-main-date">
                      {formatDate(like.post_date)}
                    </div>
                  </div>
                  ))}
                </ul>
              ) : (
                <p>좋아요 한 게시글이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="my_modal">
          <div className="my_modal-content">
            <div className="my_close_btn">
              <span className="my_close" onClick={() => setIsModalOpen(false)}>
                &times;
              </span>
            </div>
            <div className="my_modal_font">
              <FaCircleCheck className="my_check_icon" />
              <h2>비밀번호 확인</h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="my_check_P">
              <input
                type="password"
                value={user_password}
                onChange={handlePasswordChange}
                placeholder="비밀번호 입력"
                required
              />
              {errorMessage && <p className="my_error">{errorMessage}</p>}
              <button type="submit">확인</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mypage;
