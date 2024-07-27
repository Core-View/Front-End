import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
  const myrole = cookies.get('role');

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
    other: '/images/language_icons/other_icon.png',
  };

  useEffect(() => {
    fetchUserData();
    fetchPostData();
    fetchCommentData();
    fetchLikeData();
  },[]);

  const fetchUserData = async () => { //user 정보 가져오는 api요청
    axios
      .get(`http://localhost:3000/mypage/`, {
        headers: {
          Authorization: cookies.get('accessToken'),
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          const data = response.data.userInfo;
            if (!data.profile_picture || data.profile_picture === 'null') {
              data.profile_picture = `${process.env.PUBLIC_URL}/images/original_profile.png`;
            } else {
              data.profile_picture = `${process.env.PUBLIC_URL}/${data.profile_picture}`;
            }
          setUserInfo(data);
        }
      })
      .catch((err) => {
        console.log('마이 페이지 접근 요청 할때 catch된 에러', err.messsage);
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
                console.log('잘 됬으니까 다시 마이 페이지로 넘어가기');
                return navigate('/my/main');
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

  const fetchPostData = async () => { //user가 작성한 글 정보 가져오는 api요청
    axios
      .get(`http://localhost:3000/mypage/posts`, {
        headers: {
          Authorization: cookies.get('accessToken'),
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          const data = response.data.posts;
          const processedData = data.map((post) => ({
            ...post,
            profile_picture:
              post.profile_picture === 'null' || !post.profile_picture
                ? `${process.env.PUBLIC_URL}/images/original_profile.png`
                : `${process.env.PUBLIC_URL}/${post.profile_picture}`,
          }));
          setPosts(processedData || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching post data:', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          console.log('Request data:', error.request);
        } else {
          console.log('Error message:', error.message);
        }
      });
  };

  const fetchCommentData = async () => {  //user가 댓글 단 글의 정보를 가져오는 api요청
    axios
      .get(`http://localhost:3000/mypage/feedback`, {
        headers: {
          Authorization: cookies.get('accessToken'),
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          const data = response.data.feedbacks;
          const processedData = data.map((comment) => ({
            ...comment,
            profile_picture:
              comment.profile_picture === 'null' || !comment.profile_picture
                ? `${process.env.PUBLIC_URL}/images/original_profile.png`
                : `${process.env.PUBLIC_URL}/${comment.profile_picture}`,
          }));
          setComments(processedData || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching comment data:', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          console.log('Request data:', error.request);
        } else {
          console.log('Error message:', error.message);
        }
      });
  };

  const fetchLikeData = async () => { //user가 좋아요한 글의 정보를 가져오는 api요청
    axios
      .get(`http://localhost:3000/mypage/likedPosts`, {
        headers: {
          Authorization: cookies.get('accessToken'),
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          const data = response.data.likedPosts;
          const processedData = data.map((like) => ({
            ...like,
            profile_picture:
              like.profile_picture === 'null' || !like.profile_picture
                ? `${process.env.PUBLIC_URL}/images/original_profile.png`
                : `${process.env.PUBLIC_URL}/${like.profile_picture}`,
          }));
          setLikes(processedData || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching like data:', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          console.log('Request data:', error.request);
        } else {
          console.log('Error message:', error.message);
        }
      });
  };

  const handlePasswordChange = (e) => { //입력한 password 쿠기에 저장 위해 변수 저장
    setUserPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e) => { //user가 비밀번호 확인하기 위한 api요청
    e.preventDefault();
    axios
      .post(
        `http://localhost:3000/password/verify/`,
        { user_password },
        {
          headers: {
            Authorization: cookies.get('accessToken'),
          },
        }
      )
      .then((response) => {
        if (response.data.success === true) {
          cookies.set('user_password', user_password);
          navigate('/my/modify');
        } else {
          console.log("왜에러이지");
          setErrorMessage('비밀번호가 일치하지 않습니다.');
        }
      })
      .catch((error) => {
        console.log("Password verification error:", error);
        setErrorMessage('비밀번호 검증 중 오류가 발생했습니다.');
        if (error.response) {
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
        } else if (error.request) {
          console.log('Error request data:', error.request);
        } else {
          console.log('Error message:', error.message);
        }
      });
  };

  const formatDate = (dateString) => {  //작성한 글의 작성 날짜를 원하는 형식으로 고쳐주는 코드
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd', { locale: ko });
  };

  const handlePostClick = (post) => { //글 클릭시 그 글의 페이지로 이동
    navigate(`/post_view/${post.post_id}`);
  };

  const getMoreLink = () => {
    switch (activeTab) {
      case 'Mypost':
        return '/my/posting';
      case 'Myfeedback':
        return '/my/comment';
      case 'Mylike':
        return '/my/like';
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

  console.log("사진경로",userInfo.profile_picture);

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
                    if(myrole === 2){
                      navigate('/my/modify');
                    }else{
                      setIsModalOpen(true);
                      setUserPassword('');
                      setErrorMessage('');
                    }
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
                      {post.user_nickname}
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
                      {comment.nickname}
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
                      {like.user_nickname}
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
