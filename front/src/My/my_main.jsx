import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import './my_main.css';
import { parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 로케일 import
import { FaCircleCheck } from 'react-icons/fa6';
import { format } from 'date-fns';
import { Cookies } from 'react-cookie';
import Contribution from '../Common/Contribution';
import { IoSettings } from 'react-icons/io5';

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
  const [activeTab, setActiveTab] = useState('Mypost');

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
    other: '/images/language_icons/other_icon.png',
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
      if (!data.profile_picture || data.profile_picture === 'null') {
        data.profile_picture = `${process.env.PUBLIC_URL}/images/original_profile.png`;
      }
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPostData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/mypage/${userId}/posts`
      );
      const data = await response.json();
      const processedData = data.map((post) => ({
        ...post,
        profile_picture:
          post.profile_picture === 'null' || !post.profile_picture
            ? `${process.env.PUBLIC_URL}/images/original_profile.png`
            : post.profile_picture,
      }));
      setPosts(processedData || []);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const fetchCommentData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/mypage/${userId}/feedback`
      );
      const data = await response.json();
      const processedData = data.map((comment) => ({
        ...comment,
        profile_picture:
          comment.profile_picture === 'null' || !comment.profile_picture
            ? `${process.env.PUBLIC_URL}/images/original_profile.png`
            : comment.profile_picture,
      }));
      setComments(processedData || []);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };
  const fetchLikeData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/mypage/${userId}/likedPosts`
      );
      const data = await response.json();
      const processedData = data.map((like) => ({
        ...like,
        profile_picture:
          like.profile_picture === 'null' || !like.profile_picture
            ? `${process.env.PUBLIC_URL}/images/original_profile.png`
            : like.profile_picture,
      }));
      setLikes(processedData || []);
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
      const response = await fetch(
        `http://localhost:3000/password/verify/${userInfo.user_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_password }),
        }
      );
      const data = await response.json();
      if (data.success) {
        cookies.set('user_password', user_password);
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
    return <Navigate to="/users/sign-in" replace />;
  }

  const handlePostClick = (post) => {
    navigate(`/post_view/${post.post_id}`);
  };

  const getMoreLink = () => {
    switch (activeTab) {
      case 'Mypost':
        return '/my_posting';
      case 'Myfeedback':
        return '/my_comment';
      case 'Mylike':
        return '/my_like';
      default:
        return '/';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Mypost':
        return (
          <Mypost
            posts={posts}
            handlePostClick={handlePostClick}
            languageIcons={languageIcons}
            formatDate={formatDate}
          />
        );
      case 'Myfeedback':
        return (
          <Myfeedback
            comments={comments}
            handlePostClick={handlePostClick}
            languageIcons={languageIcons}
            formatDate={formatDate}
          />
        );
      case 'Mylike':
        return (
          <Mylike
            likes={likes}
            handlePostClick={handlePostClick}
            languageIcons={languageIcons}
            formatDate={formatDate}
          />
        );
      default:
        return null;
    }
  };

  console.log('전체', posts);
  return (
    <div className="allofthem">
      <div className="my_all">
        <div className="info_space">
          <div className="my_label">
            <h2>마이페이지</h2>
          </div>
          <div className="my_info_zone">
            <div className="my_profile_all_zone_one">
              <div className="image_profile">
                <img
                  src={userInfo.profile_picture}
                  alt="profile"
                  className="my_profile"
                />
              </div>
              <div className="my_modify">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setUserPassword('');
                    setErrorMessage('');
                  }}
                  className="modi_link"
                >
                  <span>
                    <IoSettings />
                  </span>
                </button>
              </div>
            </div>
            <div className="my_info_all_zone">
              <div className="my_rgood">
                <h3>좋아요</h3>
                <span
                  role="img"
                  aria-label="heart"
                  style={{ fontSize: '20px', marginRight: '10px' }}
                >
                  ❤️{userInfo.likes_received}
                </span>
              </div>
              <div className="my_contri">
                <h3>기여도</h3>
                <span>{userInfo.contribute}</span>
              </div>
              <div className="my_contri_icon">
                <h3>등급</h3>
                <span>
                  <Contribution contribute={userInfo.contribute} />
                </span>
              </div>
            </div>
          </div>
          <div className="my_introduce_zone">
            <div className="my_nickname">
              <span>{userInfo.nickname}</span>
            </div>
            <div className="my_introduce">
              <span>{userInfo.introduction || '제 꿈은 개발자입니다.'}</span>
            </div>
          </div>
          <div className="my_post_container">
            <div className="my_post_tabs">
              <div
                className={`my_tab ${activeTab === 'Mypost' ? 'active' : ''}`}
                onClick={() => setActiveTab('Mypost')}
              >
                Mypost
              </div>
              <div
                className={`my_tab ${
                  activeTab === 'Myfeedback' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('Myfeedback')}
              >
                Myfeedback
              </div>
              <div
                className={`my_tab ${activeTab === 'Mylike' ? 'active' : ''}`}
                onClick={() => setActiveTab('Mylike')}
              >
                Mylike
              </div>
              <div>
                <Link to={getMoreLink()}>
                  <button className="my_add_btn">Add</button>
                </Link>
              </div>
            </div>
            <div className="my_content">{renderContent(userInfo.user_id)}</div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="my_modal">
          <form
            onSubmit={handlePasswordSubmit}
            className="my_check_P my_modal-content"
          >
            <div className="my_close_btn">
              <span className="my_close" onClick={() => setIsModalOpen(false)}>
                &times;
              </span>
            </div>
            <div className="my_modal_font">
              <FaCircleCheck className="my_check_icon" />
              <h2>비밀번호 확인</h2>
            </div>
            <div className="last_div">
              <input
                type="password"
                value={user_password}
                onChange={handlePasswordChange}
                placeholder="비밀번호 입력"
                className="my_check_input"
                required
              />
              {errorMessage ? (
                <p className="my_error">{errorMessage}</p>
              ) : (
                <p></p>
              )}
            </div>
            <div>
              <button type="submit" className="my_modal_btn">
                확인
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const Mypost = ({ posts = [], handlePostClick, languageIcons, formatDate }) => {
  // posts가 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
  const validPosts = Array.isArray(posts) ? posts : [];
  const displayedPosts =
    validPosts.length < 6
      ? [...validPosts, ...Array(6 - validPosts.length).fill({})]
      : validPosts.slice(0, 6);

  return (
    <div className="grid-container">
      {displayedPosts.map((post, index) => (
        <div
          className="grid-item"
          key={index}
          onClick={() => post.post_id && handlePostClick(post)}
        >
          <div className="post-content">
            {post.post_id ? (
              <>
                <div className="post-header_my">
                  <img
                    src={post.profile_picture}
                    alt="profile"
                    className="feedback_picture"
                  />
                  <img
                    src={languageIcons[post.language]}
                    alt=""
                    className="feedback-language-icon"
                  />
                  <span>{post.post_title}</span>
                </div>
                <hr style={{ border: '1px solid #ddd' }} />
                <div className="post-meta">
                  <div className="post_user_div">
                    <span className="post-user">
                      {post.user_nickname || '탈퇴한 회원'}
                    </span>
                  </div>
                  <div className="post_date_div">
                    <span className="post-date">
                      {formatDate(post.post_date)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-box">Empty</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Myfeedback = ({
  comments = [],
  handlePostClick,
  languageIcons,
  formatDate,
}) => {
  const displayedComments =
    comments.length < 6
      ? [...comments, ...Array(6 - comments.length).fill({})]
      : comments.slice(0, 6);

  return (
    <div className="grid-container">
      {displayedComments.map((comment, index) => (
        <div
          className="grid-item"
          key={index}
          onClick={() => comment.post_id && handlePostClick(comment)}
        >
          <div className="post-content">
            {comment.post_id ? (
              <>
                <div className="post-header_my">
                  <img
                    src={comment.profile_picture}
                    alt="profile"
                    className="feedback_picture"
                  />
                  <img
                    src={languageIcons[comment.language]}
                    alt=""
                    className="feedback-language-icon"
                  />
                  <span>{comment.post_title}</span>
                </div>
                <hr style={{ border: '1px solid #ddd' }} />
                <div className="post-meta">
                  <div className="post_user_div">
                    <span className="post-user">
                      {comment.nickname || '탈퇴한 회원'}
                    </span>
                  </div>
                  <div className="post_date_div">
                    <span className="post-date">
                      {formatDate(comment.post_date)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-box">Empty</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Mylike = ({ likes = [], handlePostClick, languageIcons, formatDate }) => {
  const displayedLikes =
    likes.length < 6
      ? [...likes, ...Array(6 - likes.length).fill({})]
      : likes.slice(0, 6);

  return (
    <div className="grid-container">
      {displayedLikes.map((like, index) => (
        <div
          className="grid-item"
          key={index}
          onClick={() => like.post_id && handlePostClick(like)}
        >
          <div className="post-content">
            {like.post_id ? (
              <>
                <div className="post-header_my">
                  <img
                    src={like.profile_picture}
                    alt="profile"
                    className="feedback_picture"
                  />
                  <img
                    src={languageIcons[like.language]}
                    alt=""
                    className="feedback-language-icon"
                  />
                  <span>{like.post_title}</span>
                </div>
                <hr style={{ border: '1px solid #ddd' }} />
                <div className="post-meta">
                  <div className="post_user_div">
                    <span className="post-user">
                      {like.user_nickname || '탈퇴한 회원'}
                    </span>
                  </div>
                  <div className="post_date_div">
                    <span className="post-date">
                      {formatDate(like.post_date)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-box">Empty</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mypage;
