import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./admin_notice_view.css";

const AdminNoticeView = () => {
  const { id } = useParams();
  const [noticeDetail, setNoticeDetail] = useState(null);

  const getNoticeDetail = () => {
    axios
      .get(`http://localhost:3000/notice/view/${id}`)
      .then((response) => {
        setNoticeDetail(response.data.notice);
      })
      .catch((error) => {
        console.error("다시 시도해주세요", error);
      });
  };

  useEffect(() => {
    getNoticeDetail();
  }, [id]);

  const handleEdit = () => {
    console.log("수정!");
  };

  const handleDelete = () => {
    console.log("삭제!");
  };
  console.log("아 뭔데 이거거거거거거거거", noticeDetail);
  if (!noticeDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin_notice_view_container">
      <div className="admin_notice_view_header">
        <div className="admin_notice_view_title">
          {noticeDetail[0].NOTICE_TITLE}
        </div>
        <div className="admin_notice_view_buttons">
          <button onClick={handleEdit} className="edit_button">
            수정
          </button>
          <button onClick={handleDelete} className="delete_button">
            삭제
          </button>
        </div>
      </div>
      <div className="admin_notice_view_date">
        {noticeDetail[0].NOTICE_DATE}
      </div>
      <div className="admin_notice_view_content">
        {noticeDetail[0].NOTICE_CONTENT}
      </div>
      <div className="admin_notice_view_img">
        {noticeDetail[0].NOTICE_IMAGE && (
          <img src={noticeDetail[0].NOTICE_IMAGE} alt="" />
        )}
      </div>
    </div>
  );
};

export default AdminNoticeView;
