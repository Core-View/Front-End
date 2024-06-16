// FeedbackPopup.jsx
import React from 'react';
import './post_feedback_popup.css';

const FeedbackPopup = ({
  popup,
  setPopup,
  handleFeedbackSubmit,
  loggedInUserId,
  loginError,
}) => {
  return (
    <>
      {popup.show && (
        <div className="popup">
          <h3>Line: {popup.line + 1} 피드백 팝업</h3>
          욕설 및 비하발언은 제재 대상입니다.
          <div className="post-code">{popup.codeContent}</div>
          <div className="feedback-list">
            {popup.feedback &&
              popup.feedback.map((fb, fbIndex) => (
                <div key={fbIndex} className="feedback-text">
                  {fb.nickname || '탈퇴한 회원'}: {fb.feedback_comment}
                </div>
              ))}
          </div>
          <br></br>
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
              style={{ resize: 'none' }}
              disabled={!loggedInUserId} // 로그인이 안된 경우 비활성화
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
              <button
                onClick={handleFeedbackSubmit}
                disabled={!loggedInUserId} // 로그인이 안된 경우 비활성화
              >
                제출
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
