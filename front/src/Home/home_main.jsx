import React from "react";
import "./home_main.css";
import { SlArrowRight } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const navigate = useNavigate();

  // 하드코딩된 게시글 데이터
  const recommendedPosts = [
    "추천 게시글 1",
    "추천 게시글 2",
    "추천 게시글 3",
    "추천 게시글 4",
    "추천 게시글 5",
  ];

  const newestPosts = [
    "최신 게시글 1",
    "최신 게시글 2",
    "최신 게시글 3",
    "최신 게시글 4",
    "최신 게시글 5",
  ];

  return (
    <div className="home-container">
      <section className="home_mid">
        <div className="post recommend">
          <h2>추천 게시글</h2>
          <ul className="postcode">
            {recommendedPosts.map((post, index) => (
              <li key={index}>{post}</li>
            ))}
          </ul>
        </div>
        <div className="post newest">
          <h2>최신 게시글</h2>
          <ul className="postcode">
            {newestPosts.map((post, index) => (
              <li key={index}>{post}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="home_right" onClick={() => navigate("/post_main")}>
        <SlArrowRight style={{ fontSize: "60px" }} />
        <div>전체 보기</div>
      </section>
    </div>
  );
};

export default Main;
