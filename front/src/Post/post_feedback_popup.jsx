import React, { useEffect, useRef, useState } from 'react';
import './post_feedback_popup.css';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import Draggable from 'react-draggable';

const FeedbackPopup = ({
  popup,
  setPopup,
  handleFeedbackSubmit,
  loggedInUserId,
  loginError,
  refreshFeedback,
}) => {
  const feedbackListRef = useRef(null);
  const [likedFeedback, setLikedFeedback] = useState({});
  const [opacity, setOpacity] = useState(1);
  const [scrollPosition, setScrollPosition] = useState({
    top: window.scrollY,
    left: window.scrollX,
  });

  useEffect(() => {
    if (feedbackListRef.current) {
      feedbackListRef.current.scrollTop = feedbackListRef.current.scrollHeight;
    }
  }, [popup.feedback]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPopup({
          show: false,
          line: null,
          text: '',
          codeContent: '',
        });
      }
    };

    if (popup.show) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [popup.show, setPopup]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        top: window.scrollY,
        left: window.scrollX,
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleThumbsUpClick = (feedbackIndex) => {
    setLikedFeedback((prevLikedFeedback) => ({
      ...prevLikedFeedback,
      [feedbackIndex]: !prevLikedFeedback[feedbackIndex],
    }));
  };

  const handleFeedbackSubmitWithRefresh = async () => {
    await handleFeedbackSubmit();
    await refreshFeedback();
  };

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  return (
    <>
      {popup.show && (
        <Draggable handle=".popup-header">
          <div
            className="popup"
            style={{
              opacity: opacity,
              position: 'absolute',
              top: `calc(${scrollPosition.top}px)`,
              left: `calc(50% + ${scrollPosition.left}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="popup-header">
              <h3>Line: {popup.line + 1} 피드백 팝업</h3>
              <button
                className="popup-close"
                onClick={() =>
                  setPopup({
                    show: false,
                    line: null,
                    text: '',
                    codeContent: '',
                  })
                }
              >
                &times;
              </button>
            </div>
            <p className="warning-text">욕설 및 비하발언은 제재 대상입니다.</p>
            <div className="post-code">{popup.codeContent}</div>
            <div className="feedback-list" ref={feedbackListRef}>
              {popup.feedback &&
                popup.feedback.map((fb, fbIndex) => (
                  <div key={fbIndex} className="feedback-text">
                    <div>
                      <span className="feedback-nickname">
                        {fb.user_nickname}
                      </span>
                      : {fb.feedback_comment}
                    </div>
                    <span
                      className={`thumbs-up-icon ${
                        likedFeedback[fbIndex] ? 'liked' : ''
                      }`}
                      onClick={() => handleThumbsUpClick(fbIndex)}
                    >
                      {likedFeedback[fbIndex] ? (
                        <FaThumbsUp />
                      ) : (
                        <FaRegThumbsUp />
                      )}
                    </span>
                  </div>
                ))}
            </div>
            <br />
            <div className="popup-inner">
              <textarea
                rows="4"
                placeholder={
                  loggedInUserId
                    ? '피드백을 남겨주세요.'
                    : '로그인 후 이용해주세요.'
                }
                value={popup.text}
                onChange={(e) => setPopup({ ...popup, text: e.target.value })}
                disabled={!loggedInUserId}
              />
              <div className="popup-buttons">
                <button
                  className="cancel-button"
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
                <button
                  className="submit-button"
                  onClick={handleFeedbackSubmitWithRefresh}
                  disabled={!loggedInUserId}
                >
                  전송
                </button>
              </div>
            </div>
            <div className="opacity-slider">
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={opacity}
                onChange={handleOpacityChange}
              />
            </div>
          </div>
        </Draggable>
      )}
      {loginError && <div className="login-error">{loginError}</div>}
    </>
  );
};

export default FeedbackPopup;
