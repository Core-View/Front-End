import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import './post_view.css';
import './post_view_fb.css';
import './post_view_fb_popup.css';

const PostView = () => {
  const { post_id } = useParams();
  const location = useLocation();
  const { post } = location.state;

  const title = post.post_title;
  const likes = -1; // 좋아요 기능이 구현되지 않아서 임시로 -1 설정
  const author = post.user_id;
  const language = post.language;
  const date = post.post_date;
  const content = post.post_content.trim().split('\n'); // 줄 단위로 쪼개기
  const code = post.post_code.trim(); // 줄 단위로 쪼개지 않음

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    line: null,
    text: '',
    codeContent: '',
  });

  const languageIcons = {
    c: '/images/language_icons/c_icon.png',
    cpp: '/images/language_icons/cpp_icon.png',
    java: '/images/language_icons/java_icon.png',
    python: '/images/language_icons/python_icon.png',
  };

  useEffect(() => {
    // 서버에서 피드백 데이터를 가져옴
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/feedbacks/post/${post_id}`
        );
        const feedbackData = response.data.reduce((acc, fb) => {
          if (!acc[fb.feedback_codenumber]) {
            acc[fb.feedback_codenumber] = [];
          }
          acc[fb.feedback_codenumber].push(fb);
          return acc;
        }, {});
        setFeedback(feedbackData);
        setLoading(false);
      } catch (err) {
        setError(`피드백을 가져오는 데 실패했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [post_id]);

  // 현재 로그인된 유저의 Id
  const loggedInUserId = '18';

  // 피드백 버튼 클릭 핸들
  const handleFeedbackClick = (lineIndex, lineCode) => {
    setPopup({ show: true, line: lineIndex, text: '', codeContent: lineCode }); // 코드 내용 추가
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

    const feedbackData = {
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
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }

    setPopup({ ...popup, text: '' });
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

  const maxLength = 50; // 원하는 길이로 설정

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="post-view">
      <h1 className="post-title">
        <img src={languageIcons[language]} alt="" className="language-icon" />{' '}
        {title}
      </h1>
      <div className="post-meta">
        <span className="post-date">{date}</span>
        <span className="post-language">{language}</span>
      </div>
      <br></br>
      <div className="post-meta">
        <span className="post-likes">좋아요 {likes}</span>
        <span className="post-author">작성자 {author}</span>
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
                  {feedback[index][feedback[index].length - 1].user_id}:{' '}
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
      {popup.show && (
        <div className="popup">
          <h3>Line: {popup.line + 1} 피드백 팝업</h3>
          욕설 및 비하발언은 제재 대상입니다.
          <div className="post-code">{popup.codeContent}</div>
          <div className="feedback-list">
            {feedback[popup.line] &&
              feedback[popup.line].map((fb, fbIndex) => (
                <div key={fbIndex} className="feedback-text">
                  {fb.user_id}: {fb.feedback_comment}
                </div>
              ))}
          </div>
          <br></br>
          <div className="popup-inner">
            <textarea
              rows="4"
              placeholder="피드백을 남겨주세요."
              value={popup.text}
              onChange={(e) => setPopup({ ...popup, text: e.target.value })}
              style={{ resize: 'none' }}
            />
            <div className="popup-buttons">
              <button
                onClick={() =>
                  setPopup({
                    show: false,
                    line: null,
                    text: '',
                    codeContent: '',
                  })
                }
              >
                취소
              </button>
              <button onClick={handleFeedbackSubmit}>제출</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostView;
