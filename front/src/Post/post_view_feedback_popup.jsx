import React, { useEffect, useRef, useState, useCallback } from 'react';
import './post_view_feedback_popup.css';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import Draggable from 'react-draggable';
import axios from 'axios';

const FeedbackPopup = ({
  popup,
  setPopup,
  handleFeedbackSubmit,
  loggedInUserId,
  loginError,
  refreshFeedback,
  likedFeedback,
  setLikedFeedback,
}) => {
  const feedbackListRef = useRef(null);
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

  const handleThumbsUpClick = useCallback(
    async (feedbackId, index) => {
      if (!loggedInUserId) {
        alert('로그인이 필요합니다.');
        return;
      }

      const isLiked = likedFeedback[feedbackId];
      const url = isLiked
        ? `http://localhost:3000/api/feedbacklikes/${isLiked}`
        : 'http://localhost:3000/api/feedbacklikes';

      const options = isLiked
        ? { method: 'DELETE' }
        : {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: loggedInUserId,
              feedback_id: feedbackId,
            }),
          };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Response error data:', errorData);
          throw new Error('Network response was not ok');
        }

        const data = isLiked ? null : await response.json();

        setLikedFeedback((prevLikedFeedback) => {
          const newLikedFeedback = { ...prevLikedFeedback };
          if (isLiked) {
            delete newLikedFeedback[feedbackId];
          } else {
            newLikedFeedback[feedbackId] = data.id;
          }
          return newLikedFeedback;
        });
      } catch (error) {
        console.error('Failed to process feedback like/unlike:', error);
      }
    },
    [loggedInUserId, likedFeedback, setLikedFeedback]
  );

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
                popup.feedback.map((fb, index) => (
                  <div key={fb.feedback_id} className="feedback-text">
                    <div>
                      <span className="feedback-nickname">
                        [{fb.feedback_id}] {fb.user_nickname}
                      </span>
                      : {fb.feedback_comment}
                    </div>
                    <span
                      className={`thumbs-up-icon ${
                        likedFeedback[fb.feedback_id] ? 'liked' : ''
                      }`}
                      id={`span${fb.feedback_id}`}
                      onClick={() => handleThumbsUpClick(fb.feedback_id, index)}
                    >
                      {likedFeedback[fb.feedback_id] ? (
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
