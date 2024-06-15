import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import './my_main.css';
import { FaCircleCheck } from 'react-icons/fa6';

const Mypage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggenIn, setIsLoggedIn] = useState(false);
  //JSON 데이터로부터 사용자 정보를 받아오기 위한 상태 추가
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    email: '',
    nickname: '',
    profile_picture: '',
    introduction: '',
  });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]); // 댓글 단 게시글 제목 저장
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user_password, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // 기여도를 백분율로 계산
  const percentage = 22.6;
  const getColor = (percentage) => {
    if (percentage >= 80) return '#4caf50'; // 녹색
    if (percentage >= 60) return '#8bc34a'; // 연한 녹색
    if (percentage >= 40) return '#cddc39'; // 노란색
    if (percentage >= 20) return '#ffc107'; // 주황색
    return '#f44336'; // 빨간색
  };
  /*useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/check-login');
      const data = await response.json();
      if (data.loggedIn) {
        setIsLoggedIn(true);
      } else {
        navigate('/users/sign-in');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      navigate('/users/sign-in');
    }
  };

  checkLoginStatus();
}, [navigate]);*/

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mypage/17`);
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mypage/17/posts`);
        const data = await response.json();
        setPosts(data || []); // API가 posts 배열을 반환하는지 확인하고 상태를 업데이트
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };
    const fetchCommentData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mypage/17/feedback`);
        const data = await response.json();
        setComments(data || []); // API가 posts 배열을 반환하는지 확인하고 상태를 업데이트
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };
    fetchUserData();
    fetchPostData();
    fetchCommentData();
  }, [isLoggenIn, id]);

  const handlePasswordChange = (e) => {
    setUserPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/password/verify/17', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_password }),
      });
      console.log('비밀번호: ', user_password);
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

  /*if (!isLoggenIn) {
    return <Navigate to='/users/sign-in' replace />;
  }*/
  //console.log('데이터: ',userInfo.profile_picture);
    const totalLikes = 10;
    //const totalLikes = userInfo.post_likes.length + userInfo.feedback_likes.length;
    const handlePostClick = (post) => {
      navigate(`/post_view/${post.post_id}`,{ state: { post } });
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
              src={userInfo.profile_picture || '/images/original_profile.png'}
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
                ❤️{totalLikes}
              </span>
            </div>
            <br />
            <div className="contribution">
              <span>기여도</span>
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
                  {posts.slice(0, 5).map((post) => (
                    <li
                      key={post.post_id}
                      onClick={() => handlePostClick(post.post_id)}
                    >
                      {post.post_title}
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
                내가 댓글 단 글
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
                  {comments.slice(0, 5).map((comment) => (
                    <li
                      key={comment.post_id}
                      onClick={() => handlePostClick(comment.post_id)}
                    >
                      {comment.post_title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>댓글 단 게시글이 없습니다.</p>
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
