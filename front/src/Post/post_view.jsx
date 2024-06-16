// PostView.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import FeedbackPopup from './post_feedback_popup';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';

import './post_view.css';
import './post_view_fb.css';

const PostView = () => {
  const cookies = new Cookies();
  const loggedInUserId = cookies.get('user_id'); // 로그인된 사용자 ID 가져오기
  const { post_id } = useParams();
  // const { post } = location.state;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [loginError, setLoginError] = useState(''); // 로그인 에러 상태 추가
  const maxLength = 50; // 최근 피드백 출력 길이

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
  };

  const [post, setPost] = useState({});
  const [feedback, setFeedback] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    line: null,
    text: '',
    codeContent: '',
    feedback: [],
  });

  useEffect(() => {
    const fetchPostAndFeedback = async () => {
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
        setLoading(false);
      } catch (err) {
        setError(`데이터를 가져오는 데 실패했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPostAndFeedback();
  }, [post_id]);

  const title = post.post_title;
  const likes = post.likes;
  const author = post.user_nickname;
  const language = post.language;
  const date = post.post_date;
  const content = post.post_content ? post.post_content.trim().split('\n') : [];
  const code = post.post_code ? post.post_code.trim() : '';
  const result = post.post_result;

  // 피드백 버튼 클릭 핸들
  const handleFeedbackClick = (lineIndex, lineCode) => {
    setPopup({
      show: true,
      line: lineIndex,
      text: '',
      codeContent: lineCode,
      feedback: feedback[lineIndex] || [],
    });
  };

  // 피드백 전송 핸들
  const handleFeedbackSubmit = async () => {
    if (popup.text.trim() === '') return;

    const newFeedback = feedback[popup.line]
      ? [
          ...feedback[popup.line],
          { user_id: loggedInUserId, feedback_comment: popup.text },
        ]
      : [{ user_id: loggedInUserId, feedback_comment: popup.text }];
    setFeedback({ ...feedback, [popup.line]: newFeedback });

    const feedbackHandleData = {
      post_id: post_id,
      user_id: loggedInUserId,
      feedback_comment: popup.text,
      feedback_codenumber: popup.line,
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

      // 피드백 전송 후 팝업 상태 업데이트
      setPopup((prevPopup) => ({
        ...prevPopup,
        feedback: newFeedback,
        text: '',
      }));
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const truncateText = (text, maxLength) => {
    const newlineIndex = text.indexOf('\n');
    if (newlineIndex !== -1 && newlineIndex <= maxLength) {
      return text.slice(0, newlineIndex) + '...';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="post-view">
      <div className="post-header">
        <h1 className="post-title">
          <img src={languageIcons[language]} alt="" className="language-icon" />{' '}
          {title}
        </h1>
        <div className="post-meta">
          <span className="post-date">{date}</span>
          <span className="post-likes">
            <MdFavoriteBorder className="icon" />
            <MdFavorite className="icon" /> {likes}
          </span>
        </div>
        <span className="post-author">{author}</span>
      </div>
      <div className="post-content">
        {content.map((line, index) => (
          <div key={index} className="post-line">
            <span>{line}</span>
          </div>
        ))}
      </div>
      <pre className="post-code">
        {code.split('\n').map((line, index) => (
          <div key={index} className="post-code-line">
            <span className="non-drag">
              <span className="line-number">{index + 1} | </span>
            </span>
            <span>{line}</span>
            <button
              className={`feedback-button ${feedback[index] ? 'active' : ''}`}
              onClick={() => handleFeedbackClick(index, line)}
            >
              피드백 {feedback[index] ? `(${feedback[index].length})` : ''}
            </button>
            {feedback[index] && feedback[index].length > 0 && (
              <div className="feedback-text">
                <div className="non-drag">
                  [최근 피드백]{' '}
                  {truncateText(
                    feedback[index][feedback[index].length - 1]
                      .feedback_comment,
                    maxLength
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </pre>
      <FeedbackPopup
        popup={popup}
        setPopup={setPopup}
        handleFeedbackSubmit={handleFeedbackSubmit}
        loggedInUserId={loggedInUserId}
        loginError={loginError}
      />
      <div className="post-result">
        <h4>코드 실행 결과</h4>
        <br></br>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default PostView;
