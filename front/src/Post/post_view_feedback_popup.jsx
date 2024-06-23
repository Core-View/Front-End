import React, { useEffect, useRef, useState, useCallback } from 'react';
import './post_view_feedback_popup.css';
// import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import Draggable from 'react-draggable';
import axios from 'axios';
import Contribution from '../Common/Contribution';

const FeedbackPopup = ({
  popup,
  setPopup,
  handleFeedbackSubmit,
  loggedInUserId,
  loginError,
  refreshFeedback,
  postWriterId,
  // likedFeedback,
  // setLikedFeedback,
}) => {
  const feedbackListRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [scrollPosition, setScrollPosition] = useState({
    top: window.scrollY,
    left: window.scrollX,
  });
  const [contributions, setContributions] = useState({});

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

  const fetchContribution = useCallback(async (userId) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/post/contribution',
        {
          user_id: userId,
        }
      );
      return response.data.user_contribute;
    } catch (error) {
      console.error(
        `Failed to fetch contribution for user ID ${userId}:`,
        error
      );
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchContributions = async () => {
      const uniqueUserIds = [
        ...new Set(popup.feedback.map((fb) => fb.user_id)),
      ];
      const contributionsData = {};
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const contribution = await fetchContribution(userId);
          if (contribution !== null) {
            contributionsData[userId] = contribution;
          }
        })
      );
      setContributions(contributionsData);
    };

    if (popup.show) {
      fetchContributions();
    }
  }, [popup.feedback, fetchContribution, popup.show]);

  const handleFeedbackSubmitWithRefresh = async () => {
    await handleFeedbackSubmit();
    await refreshFeedback();
  };

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  };

  const handleFeedbackDelete = async (feedback_id) => {
    if (!window.confirm('정말로 이 피드백을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/feedbacks/${feedback_id}`
      );

      if (response.status === 200) {
        alert('피드백이 삭제되었습니다.');
        await refreshFeedback();
        setPopup((prevPopup) => ({
          ...prevPopup,
          feedback: prevPopup.feedback.filter(
            (fb) => fb.feedback_id !== feedback_id
          ),
        }));
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('There was a problem with your delete operation:', error);
    }
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
                    <div className="profile-info">
                      {contributions[fb.user_id] !== undefined && (
                        <div className="contribution-icon-style">
                          <Contribution
                            contribute={contributions[fb.user_id]}
                          />
                        </div>
                      )}
                      <span className="feedback-nickname">
                        {fb.user_nickname}
                      </span>
                      : {fb.feedback_comment}
                    </div>
                    {(loggedInUserId === fb.user_id ||
                      loggedInUserId === postWriterId) && (
                      <button
                        className="feedback-delete-button"
                        onClick={() => handleFeedbackDelete(fb.feedback_id)}
                      >
                        삭제
                      </button>
                    )}
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
