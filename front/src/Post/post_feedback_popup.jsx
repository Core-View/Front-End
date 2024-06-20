import React, { useEffect, useRef, useState } from "react";
import "./post_feedback_popup.css";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const FeedbackPopup = ({
  popup,
  setPopup,
  handleFeedbackSubmit,
  loggedInUserId,
  loginError,
  refreshFeedback, // 추가된 부분
}) => {
  const feedbackListRef = useRef(null);
  const [likedFeedback, setLikedFeedback] = useState({});

  useEffect(() => {
    if (feedbackListRef.current) {
      feedbackListRef.current.scrollTop = feedbackListRef.current.scrollHeight;
    }
  }, [popup.feedback]);

  const handleThumbsUpClick = (feedbackIndex) => {
    setLikedFeedback((prevLikedFeedback) => ({
      ...prevLikedFeedback,
      [feedbackIndex]: !prevLikedFeedback[feedbackIndex],
    }));
  };

  const handleFeedbackSubmitWithRefresh = async () => {
    await handleFeedbackSubmit();
    await refreshFeedback(); // 피드백 목록 새로고침
  };

  return (
    <>
      {popup.show && (
        <div className="popup">
          <div className="popup-header">
            <h3>Line: {popup.line + 1} 피드백 팝업</h3>
            <button
              className="popup-close"
              onClick={() =>
                setPopup({
                  show: false,
                  line: null,
                  text: "",
                  codeContent: "",
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
                      likedFeedback[fbIndex] ? "liked" : ""
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
                  ? "피드백을 남겨주세요."
                  : "로그인 후 이용해주세요."
              }
              value={popup.text}
              onChange={(e) => setPopup({ ...popup, text: e.target.value })}
              style={{ resize: "none" }}
              disabled={!loggedInUserId} // 로그인이 안된 경우 비활성화
            />
            <div className="popup-buttons">
              <button
                className="cancel-button"
                onClick={() =>
                  setPopup({
                    show: false,
                    line: null,
                    text: "",
                    codeContent: "",
                  })
                }
              >
                취소
              </button>
              <button
                className="submit-button"
                onClick={handleFeedbackSubmitWithRefresh} // 변경된 부분
                disabled={!loggedInUserId} // 로그인이 안된 경우 비활성화
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
      {loginError && <div className="login-error">{loginError}</div>}
    </>
  );
};

export default FeedbackPopup;
