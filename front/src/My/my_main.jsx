import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import './my_main.css';

const Mypage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggenIn, setIsLoggedIn] = useState(false);
  //JSON 데이터로부터 사용자 정보를 받아오기 위한 상태 추가
  const [userInfo, setUserInfo] = useState({
    user_id:'',
    email:'',
    nickname: '',
    profile_picture:'',
    introduction:''});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]); // 댓글 단 게시글 제목 저장
  // 기여도를 백분율로 계산
  const percentage = 40;
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
        const response = await fetch(`http://localhost:3000/mypage/1`);
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/post/searchPosts`);
        const data = await response.json();
        setPosts(data.posts || []);
        setComments(data.feedbacks ? data.feedbacks.map(feedback => ({ id: feedback.feedback_id, comment: feedback.comment })) : []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchPostLikeData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/post/likePost`);
        const data = await response.json();
        setPosts(data.posts || []);
        setComments(data.feedbacks ? data.feedbacks.map(feedback => ({ id: feedback.feedback_id, comment: feedback.comment })) : []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
      fetchUserData();
      fetchPostData();
      fetchPostLikeData();
  }, [isLoggenIn, id]);

  /*if (!isLoggenIn) {
    return <Navigate to='/users/sign-in' replace />;
  }*/
    const totalLikes = 10;
    //const totalLikes = userInfo.post_likes.length + userInfo.feedback_likes.length;
  return (
    <div className='my_all'>
      <div className="contribution-bar">
        <div className="filled-bar"
          style={{width: `${percentage}%`,
          backgroundColor: getColor(percentage)}}>
            <span className="percentage-text">{`${percentage.toFixed(1)}%`}</span>
        </div>
      </div>
      <div className='myinfo_all'>
        <div className='space1'>
          <div className='image_profile'>
            <img src={userInfo.profile_picture || "/images/original_profile.png"} alt="profile" className='my_profile'/>
          </div>
          <div className='info_zone'>
            <div className='name_zone'>
              <h3>{userInfo.nickname}</h3>
            </div>
            <div className='intro_zone'>
              <h5>{userInfo.introduction||'자기 소개입니다'}</h5>
            </div>
          </div>
          <div className='activity'>
            <div className='good'>
              <span role="img" aria-label="heart">❤️{totalLikes}</span>
            </div>
            <div className='contribution'>
              <h5>기여도</h5>
            </div>
          </div>
          <div className='modify_zone'>
            <Link to='/my_modify' className='modi_link'>정보수정</Link>
          </div>
        </div>
        <div className='space2'>
          <div className='post_zone'>
            <div className='my_posts'>
              <Link to="/my_posting" style={{textDecoration: "none", color:'black'}}>게시글</Link>
            </div>
            <div className='post_title'>
              {posts.length > 0 ? (
                <ul>
                {posts.map(post => (
                  <li key={post.id} style={{ listStyleType: 'none' }}>
                    <Link to={`/post/${post.post_id}`} className='post_link_style'>
                      {post.title}
                    </Link>
                  </li>
                ))}
                </ul>
                ) : (
                  <p>게시글이 없습니다.</p>
              )}
            </div>
          </div>
          <div className='comment_zone'>
            <div className='my_comments'>
              <Link to="/my_comment" style={{textDecoration: "none", color:'black'}}>댓글</Link>
            </div>
            <hr style={{ color: 'black', backgroundColor: 'black', height: '1px' }}/>
            <div className='comment_title'>
              {comments.length > 0 ? (
              <ul>
                {comments.map(comment => (
                  <li key={comment.id} style={{ listStyleType: 'none' }}>
                    <Link to={`/post/${comment.id}`} className='comment_link_style'>
                      {comment.comment}
                    </Link>
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
    </div>
  );
};

export default Mypage;
