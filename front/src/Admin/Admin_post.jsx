import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Contribution from "../Common/Contribution";

import "./admin_post.css";
import axios from "axios";

const AdminPost = () => {
  const [postlist, setPostList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const getAdminPosts = () => {
    axios.get("http://localhost:3000/post/latest").then((response) => {
      setPostList(response.data);
    });
  };

  useEffect(() => {
    getAdminPosts();
  }, []);

  // 게시글 상세보기 페이지로 넘어가기 관련
  const navigate = useNavigate();

  const handleNavigate = (post) => {
    navigate(`/post_view/${post.post_id}`);
  };

  // 페이지네이션 관련
  // 현재 페이지에 해당하는 게시글 목록을 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = postlist.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(postlist.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const deletePoster = async (post_id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/delete/${post_id}`
        );
        if (response.data.message === "Post deleted successfully") {
          alert("삭제되었습니다.");
          getAdminPosts(); // 삭제 후 최신 게시글 목록을 다시 불러옵니다.
        } else {
          alert("게시글을 찾을 수 없습니다.");
        }
      } catch (error) {
        alert("삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="admin_post_container">
      <div className="post_detail">
        <div className="post_id">번호</div>
        <div className="post_title">제목</div>
        <div className="post_user">작성자</div>
        <div className="post_date">작성일자</div>
      </div>
      <ul className="ad_post_list">
        {currentPosts.map((a, i) => (
          <li
            className="listpost"
            key={i}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate(a);
            }}
          >
            <div className="line1">{a.post_id}</div>
            <div className="line2">{a.post_title}</div>
            <div className="line3">
              <Contribution contribute={a.user_contribute} />
              <span>{a.user_nickname}</span>
            </div>
            <div className="line4">{a.post_date}</div>
            <div
              className="delete_poster"
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링을 막습니다.
                e.preventDefault();
                deletePoster(a.post_id);
              }}
            >
              X
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`pagebtn ${currentPage === number ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPost;
