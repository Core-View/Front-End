import React, { useState, useEffect } from "react";
import "./home_main.css";
import { SlArrowRight } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Main = () => {
  const navigate = useNavigate();

  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [newestPosts, setNewestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [latestResponse, likesResponse] = await Promise.all([
          axios.get("http://localhost:3000/post/latest"),
          axios.get("http://localhost:3000/post/latest"),
        ]);

        setNewestPosts(latestResponse.data.slice(0, 5));
        setRecommendedPosts(likesResponse.data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError(`게시글을 가져오는 데 실패했습니다: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-container">
      <section className="home_mid">
        <div className="post recommend">
          <h2>추천 게시글</h2>
          <ul className="postcode">
            {recommendedPosts.map((post, index) => (
              <li key={index}>{post.post_title}</li>
            ))}
          </ul>
        </div>
        <div className="post newest">
          <h2>최신 게시글</h2>
          <ul className="postcode">
            {newestPosts.map((post, index) => (
              <li key={index}>{post.post_title}</li>
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
