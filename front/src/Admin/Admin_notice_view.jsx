import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin_notice_view.css";

const AdminNoticeView = () => {
  const [notice, setNotice] = useState([]);

  const handleEdit = () => {
    console.log("수정!");
  };

  const handleDelete = () => {
    console.log("삭제!");
  };

  return (
    <div className="admin_notice_view_container">
      <div className="admin_notice_view_header">
        <div className="admin_notice_view_title">제모오오오오옥</div>
        <div className="admin_notice_view_buttons">
          <button onClick={handleEdit} className="edit_button">
            수정
          </button>
          <button onClick={handleDelete} className="delete_button">
            삭제
          </button>
        </div>
      </div>
      <div className="admin_notice_view_date">2024-12-12</div>
      <div className="admin_notice_view_content">
        오늘은 기쁜 날입니다. 중국이 우리나라 속국을 인정했습니다. 북한은
        물론이고 저기 일본이랑 러시아도 다 우리 나라 밑으로 들어오기로 했습니다.
        윤석열 대통령은 기뻐서 모든 국민에게 제육1인분씩 맛있게 볶아주기로
        했습니다.
      </div>
      <div className="admin_notice_view_img">
        <img src="/images/CoreView_logo_black.png" alt="" />
      </div>
    </div>
  );
};

export default AdminNoticeView;
