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
    // axios.get(`http://localhost:3000/notice/view`).then((response) => {
    //   if (response.data.success === true) {
    //     let noticeList = response.data.notice;
    //     setNoticeLists(noticeList);
    //   }
    // });
    let noticeList = [
      { notice_id: 1, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 2, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 3, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 4, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 5, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 6, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 7, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 8, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      { notice_id: 9, notice_title: "아오하기싫어", notice_date: "2024-12-12" },
      {
        notice_id: 10,
        notice_title: "아오하기싫어",
        notice_date: "2024-12-12",
      },
      {
        notice_id: 11,
        notice_title: "아오하기싫어",
        notice_date: "2024-12-12",
      },
      {
        notice_id: 12,
        notice_title: "아오하기싫어",
        notice_date: "2024-12-12",
      },
      {
        notice_id: 13,
        notice_title: "아오하기싫어",
        notice_date: "2024-12-12",
      },
    ];

    setNoticeLists(noticeList);
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
    console.log("공지쓰자");
    navigate("/notice/post");
  };

  return (
    <div className="admin_notice_container">
      <button className="create_notice" onClick={createNotice}>
        공지작성
      </button>
      <ul className="ad_notice_list">
        {currentNotices.map((notice, i) => (
          <li
            key={i}
            onClick={() => {
              navigate(`/notice/view/${notice.notice_id}`);
            }}
          >
            <span className="ad_notice_id">{notice.notice_id}</span>
            <span className="ad_notice_title">{notice.notice_title}</span>
            <span className="ad_notice_date">{notice.notice_date}</span>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminNotice;
