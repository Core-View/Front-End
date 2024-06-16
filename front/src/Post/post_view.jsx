import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';

import './post_view.css';
import './post_view_fb.css';
import './post_view_fb_popup.css';

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
  // ============================================================= Post Details Start =============================================================
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/post/details/${post_id}`
        );
        const postData = response.data;

        const userIds = [...new Set([postData.user_id])];
        await fetchUserInfos(userIds);

        setPost(postData);
        setLoading(false);
      } catch (err) {
        setError(`게시글을 가져오는 데 실패했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [post_id]);

  // const post_id = post.post_id;
  const title = post.post_title;
  const likes = post.likes;
  console.log('좋아요');
  console.log(likes);
  const authorId = post.user_id;
  const language = post.language;
  const date = post.post_date;
  const content = post.post_content ? post.post_content.trim().split('\n') : []; // 줄 단위로 쪼개기
  const code = post.post_code ? post.post_code.trim() : ''; // 줄 단위로 쪼개지 않음
  // ============================================================= Post Details End =============================================================

  // ============================================================= User Info Start =============================================================
  const [userInfos, setUserInfos] = useState({});

  const fetchUserInfos = async (userIds) => {
    const userInfoPromises = userIds.map((id) =>
      axios
        .get(`http://localhost:3000/mypage/${id}`)
        .then((response) => ({
          userId: id,
          data: response.data,
        }))
        .catch(() => ({
          userId: id,
          data: { nickname: '탈퇴한 회원' }, // 사용자 정보가 없는 경우 처리
        }))
    );

    const userInfoResponses = await Promise.all(userInfoPromises);

    const newUserInfos = {};
    userInfoResponses.forEach((response) => {
      newUserInfos[response.userId] = response.data;
    });

    setUserInfos((prevUserInfos) => ({
      ...prevUserInfos,
      ...newUserInfos,
    }));
  };
  // ============================================================= User Info End =============================================================

  // ============================================================= Feedback Data Start =============================================================
  const [feedback, setFeedback] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    line: null,
    text: '',
    codeContent: '',
  });

  useEffect(() => {
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
        const userIds = [
          ...new Set([authorId, ...response.data.map((fb) => fb.user_id)]),
        ];
        await fetchUserInfos(userIds);
        setFeedback(feedbackData);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // 피드백이 없을 경우, feedback 상태를 빈 객체로 설정
          setFeedback({});
        } else {
          setError(`피드백을 가져오는 데 실패했습니다: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [post_id, authorId]);
  // ============================================================= Feedback Data End =============================================================

  // ============================================================= HANDLE Start =============================================================
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
  // ============================================================= HANDLE End =============================================================

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

  // ============================================================= Return Start =============================================================
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
        <span className="post-author">
          {userInfos[authorId]?.nickname || '탈퇴한 회원'}
        </span>
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
                  {userInfos[
                    feedback[index][feedback[index].length - 1].user_id
                  ]?.nickname || '탈퇴한 회원'}
                  :{' '}
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
                  {userInfos[fb.user_id]?.nickname || '탈퇴한 회원'}:{' '}
                  {fb.feedback_comment}
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
    </div>
  );
  // ============================================================= Return End =============================================================
};

export default PostView;
