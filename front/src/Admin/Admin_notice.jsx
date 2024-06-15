import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin_notice.css";
import { useNavigate } from "react-router-dom";

const AdminNotice = () => {
  const [noticeLists, setNoticeLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 10;

  //공지조회관련
  const getNotice = () => {
    axios.get(`http://localhost:3000/notice/view`).then((response) => {
      if (response.data.success === true) {
        let noticeList = response.data.notice;
        setNoticeLists(noticeList);
        console.log(noticeList);
      }
    });
  };

  useEffect(() => {
    getNotice();
  }, []);

  //공지상세보기 페이지로 넘어가기 관련
  const navigate = useNavigate();

  //페이지네이션 관련
  // 현재 페이지에 해당하는 공지 목록을 계산
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = noticeLists.slice(
    indexOfFirstNotice,
    indexOfLastNotice
  );

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(noticeLists.length / noticesPerPage); i++) {
    pageNumbers.push(i);
  }

  //공지작성관련
  const createNotice = () => {
    navigate("/notice/post");
  };

  return (
    <div className="admin_notice_container">
      <button className="create_notice" onClick={createNotice}>
        공지작성
      </button>
      <div className="notice_detail">
        <div className="notice_id">번호</div>
        <div className="notice_title">제목</div>
        <div className="notice_date">작성일자</div>
      </div>
      <ul className="ad_notice_list">
        {currentNotices.map((notice, i) => (
          <li
            className="listnotice"
            key={i}
            onClick={() => {
              navigate(`/notice/view/${notice.NOTICE_ID}`);
            }}
          >
            <span className="ad_notice_id">{notice.NOTICE_ID}</span>
            <span className="ad_notice_title">{notice.NOTICE_TITLE}</span>
            <span className="ad_notice_date">{notice.NOTICE_DATE}</span>
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

export default AdminNotice;
