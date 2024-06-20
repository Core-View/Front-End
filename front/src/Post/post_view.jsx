import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import FeedbackPopup from "./post_feedback_popup";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";

import "./post_view.css";
import "./post_view_fb.css";

const PostView = () => {
  const cookies = new Cookies();
  const loggedInUserId = cookies.get("user_id");
  const { post_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [loginError, setLoginError] = useState("");
  const maxLength = 50;

  const languageIcons = {
    c: "/images/language_icons/c_icon.png",
    cpp: "/images/language_icons/cpp_icon.png",
    java: "/images/language_icons/java_icon.png",
    python: "/images/language_icons/python_icon.png",
  };

  const [post, setPost] = useState({});
  const [feedback, setFeedback] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    line: null,
    text: "",
    codeContent: "",
    feedback: [],
  });
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const fetchPostAndFeedback = async () => {
    try {
      // 첫 번째 요청: post 및 feedback 데이터 가져오기
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

      console.log(postData);
      setPost(postData);
      setFeedback(feedbackData);
      setLikesCount(postData.total_likes);

      // 두 번째 요청: liked 데이터 가져오기
      const likedResponse = await axios.get(
        `http://localhost:3000/mypage/${postData.user_id}/likedPosts`
      );
      const likedData = likedResponse.data;
      setLikedPosts(likedData);

      // liked 상태 업데이트
      isLiked(likedData);

      setLoading(false);
    } catch (err) {
      setError(`데이터를 가져오는 데 실패했습니다: ${err.message}`);
      setLoading(false);
    }
  };

  const isLiked = (likedData) => {
    if (likedData.some((likedPost) => likedPost.post_id === post_id)) {
      setLiked(true);
    }
  };

  useEffect(() => {
    fetchPostAndFeedback();
  }, [post_id]);

  const title = post.post_title;
  let user_image = post.user_image;
  if (user_image == null) {
    user_image = `${process.env.PUBLIC_URL}/images/original_profile.png`;
  }
  console.log(user_image);
  const author = post.user_nickname;
  const language = post.language;
  const date = post.post_date;
  const content = post.post_content ? post.post_content.trim().split("\n") : [];
  const code = post.post_code ? post.post_code.trim() : "";
  const result = post.post_result;

  const handleFeedbackClick = (lineIndex, lineCode) => {
    setPopup({
      show: true,
      line: lineIndex,
      text: "",
      codeContent: lineCode,
      feedback: feedback[lineIndex] || [],
    });
  };

  const handleFeedbackSubmit = async () => {
    if (popup.text.trim() === "") return;

    const feedbackHandleData = {
      post_id: post_id,
      user_id: loggedInUserId,
      feedback_comment: popup.text,
      feedback_codenumber: popup.line,
      user_nickname: post.user_nickname,
    };

    try {
      const response = await fetch("http://localhost:3000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackHandleData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // 새로운 피드백을 직접 추가하여 피드백 목록 업데이트
      const newFeedback = feedback[popup.line]
        ? [
            ...feedback[popup.line],
            {
              user_id: loggedInUserId,
              feedback_comment: popup.text,
              user_nickname: post.user_nickname,
            },
          ]
        : [
            {
              user_id: loggedInUserId,
              feedback_comment: popup.text,
              user_nickname: post.user_nickname,
            },
          ];

      setFeedback({ ...feedback, [popup.line]: newFeedback });

      // popup 상태도 업데이트하여 새 피드백이 바로 보이도록 함
      setPopup((prevPopup) => ({
        ...prevPopup,
        feedback: newFeedback,
        text: "",
      }));
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    const newlineIndex = text.indexOf("\n");
    if (newlineIndex !== -1 && newlineIndex <= maxLength) {
      return text.slice(0, newlineIndex) + "...";
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  const handleLikeClick = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);

    const url = newLiked
      ? `http://localhost:3000/post/like`
      : `http://localhost:3000/post/unlike/${post_id}/${loggedInUserId}`;

    const options = newLiked
      ? {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: post_id,
            user_id: loggedInUserId,
          }),
        }
      : { method: "DELETE" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setMessage(newLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="post-view">
      {message && (
        <div className={`like-message ${showMessage ? "show" : ""}`}>
          {message}
        </div>
      )}
      <div className="post-header">
        <h1 className="post-title">
          <img src={languageIcons[language]} alt="" className="language-icon" />{" "}
          {title}
        </h1>
        <div className="post-meta">
          <span className="post-date">{date}</span>
          <span className="post-likes" onClick={handleLikeClick}>
            {liked ? (
              <MdFavorite className="icon active" />
            ) : (
              <MdFavoriteBorder className="icon" />
            )}{" "}
            {likesCount}
          </span>
        </div>
        <div className="post-author-container">
          <img src={user_image} alt="profile" className="profile-image" />
          <span className="post-author">{author}</span>
        </div>
      </div>
      <div className="post-content">
        {content.map((line, index) => (
          <div key={index} className="post-line">
            <span>{line}</span>
          </div>
        ))}
      </div>
      <pre className="post-code">
        {code.split("\n").map((line, index) => (
          <div key={index} className="post-code-line">
            <span className="non-drag">
              <span className="line-number">{index + 1} | </span>
            </span>
            <span>{line}</span>
            <button
              className={`feedback-button ${feedback[index] ? "active" : ""}`}
              onClick={() => handleFeedbackClick(index, line)}
            >
              피드백 {feedback[index] ? `(${feedback[index].length})` : ""}
            </button>
            {feedback[index] && feedback[index].length > 0 && (
              <div className="feedback-text">
                <div className="non-drag">
                  [최근 피드백]{" "}
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
        refreshFeedback={fetchPostAndFeedback} // 추가된 부분
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
