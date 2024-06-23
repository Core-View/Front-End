import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import FeedbackPopup from './post_feedback_popup';
import PostHeader from './post_view_header';
import PostContent from './post_view_component';
import PostCode from './post_view_code';
import PostResult from './post_view_result';
import './post_view.css';
import './post_view_fb.css';

const PostView = () => {
  const cookies = new Cookies();
  const loggedInUserId = cookies.get('user_id');
  const { post_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState('');

  const languageIcons = useMemo(
    () => ({
      c: '/images/language_icons/c_icon.png',
      cpp: '/images/language_icons/cpp_icon.png',
      java: '/images/language_icons/java_icon.png',
      python: '/images/language_icons/python_icon.png',
    }),
    []
  );

  const [post, setPost] = useState({});
  const [feedback, setFeedback] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    line: null,
    text: '',
    codeContent: '',
    feedback: [],
  });
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const fetchPostAndFeedback = useCallback(async () => {
    try {
      const [postResponse, feedbackResponse] = await Promise.all([
        axios.get(`http://localhost:3000/post/details/${post_id}`),
        axios.get(`http://localhost:3000/api/feedbacks/post/${post_id}`),
      ]);

      const postData = postResponse.data;
      const feedbackData = feedbackResponse.data.reduce((acc, fb) => {
        if (!acc[fb.feedback_codenumber]) {
          acc[fb.feedback_codenumber] = [];
        }
        acc[fb.feedback_codenumber].push(fb);
        return acc;
      }, {});

      setPost(postData);
      setFeedback(feedbackData);
      setLikesCount(postData.total_likes);

      const likedResponse = await axios.get(
        `http://localhost:3000/mypage/${loggedInUserId}/likedPosts`
      );
      const likedData = likedResponse.data;
      setLikedPosts(likedData);

      isLiked(likedData);
      setLoading(false);
    } catch (err) {
      setError(`데이터를 가져오는 데 실패했습니다: ${err.message}`);
      setLoading(false);
    }
  }, [post_id, loggedInUserId]);
  const user_image =
    post.user_image || `${process.env.PUBLIC_URL}/images/original_profile.png`;

  const isLiked = useCallback(
    (likedData) => {
      if (
        likedData.some((likedPost) => likedPost.post_id === parseInt(post_id))
      ) {
        setLiked(true);
      }
    },
    [post_id]
  );

  useEffect(() => {
    fetchPostAndFeedback();
  }, [fetchPostAndFeedback]);

  const handleFeedbackClick = useCallback(
    (lineIndex, lineCode) => {
      setPopup({
        show: true,
        line: lineIndex,
        text: '',
        codeContent: lineCode,
        feedback: feedback[lineIndex] || [],
      });
    },
    [feedback]
  );

  const handleFeedbackSubmit = useCallback(async () => {
    if (popup.text.trim() === '') return;

    const feedbackHandleData = {
      post_id: post_id,
      user_id: loggedInUserId,
      feedback_comment: popup.text,
      feedback_codenumber: popup.line,
      user_nickname: post.user_nickname,
    };

    try {
      const response = await fetch('http://localhost:3000/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackHandleData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newFeedback = feedback[popup.line]
        ? [
            ...feedback[popup.line],
            {
              user_id: loggedInUserId,
              feedback_comment: popup.text,
              user_nickname: '방금 작성한 피드백',
            },
          ]
        : [
            {
              user_id: loggedInUserId,
              feedback_comment: popup.text,
              user_nickname: '방금 작성한 피드백',
            },
          ];

      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [popup.line]: newFeedback,
      }));

      setPopup((prevPopup) => ({
        ...prevPopup,
        feedback: newFeedback,
        text: '',
      }));
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }, [
    popup.text,
    popup.line,
    loggedInUserId,
    post.user_nickname,
    feedback,
    post_id,
  ]);

  const truncateText = useCallback((text, maxLength) => {
    const newlineIndex = text.indexOf('\n');
    if (newlineIndex !== -1 && newlineIndex <= maxLength) {
      return text.slice(0, newlineIndex) + '...';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }, []);

  const handleLikeClick = useCallback(async () => {
    if (!loggedInUserId) {
      setMessage('로그인이 필요합니다.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }

    if (loggedInUserId === post.user_id) {
      setMessage('자신의 포스트에 좋아요를 누를 수 없습니다.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);

    const url = newLiked
      ? 'http://localhost:3000/post/like'
      : `http://localhost:3000/post/unlike/${post_id}/${loggedInUserId}`;

    const options = newLiked
      ? {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: post_id,
            user_id: loggedInUserId,
          }),
        }
      : { method: 'DELETE' };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setMessage(newLiked ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }, [liked, likesCount, loggedInUserId, post.user_id, post_id]);

  // if (loading) {
  //   return <div>로딩 중...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="post-view">
      {message && (
        <div className={`like-message ${showMessage ? 'show' : ''}`}>
          {message}
        </div>
      )}
      <PostHeader
        title={post.post_title}
        language={post.language}
        languageIcons={languageIcons}
        date={post.post_date}
        liked={liked}
        likesCount={likesCount}
        handleLikeClick={handleLikeClick}
        user_image={user_image}
        author={post.user_nickname}
      />
      <PostContent content={post.post_content} />
      <PostCode
        code={post.post_code}
        feedback={feedback}
        handleFeedbackClick={handleFeedbackClick}
        truncateText={truncateText}
      />
      <FeedbackPopup
        popup={popup}
        setPopup={setPopup}
        handleFeedbackSubmit={handleFeedbackSubmit}
        loggedInUserId={loggedInUserId}
        loginError={loginError}
        refreshFeedback={fetchPostAndFeedback}
      />
      <PostResult result={post.post_result} />
    </div>
  );
};

export default PostView;
