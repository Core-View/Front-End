import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./admin_notice_view.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { FaList } from "react-icons/fa";
import { Cookies } from "react-cookie";

const AdminNoticeView = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
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
  }, []);

  useEffect(() => {
    if (noticeDetail) {
      const viewer = new Viewer({
        el: document.querySelector("#viewer"),
        height: "600px",
        initialValue: noticeDetail[0].NOTICE_CONTENT,
      });
    }
  }, [noticeDetail]);

  const handleEdit = () => {
    if (cookies.get("adminpw") === "passed") {
      navigate(`/notice/modify/${id}`);
    } else {
      alert("관리자만 수정할 수 있습니다.");
    }
  };

  const handleDelete = () => {
    if (cookies.get("adminpw") === "passed") {
      axios
        .delete(`http://localhost:3000/notice/delete/${id}`)
        .then((response) => {
          if (response.data.success === true) {
            alert("삭제 성공!");
            navigate("/admin");
          }
        });
    } else {
      alert("관리자만 지울수 있습니다.");
    }
  };

  if (!noticeDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin_notice_view_container">
      <div className="admin_notice_view_header">
        <div className="admin_notice_view_title">
          {noticeDetail[0].NOTICE_TITLE}
          <button onClick={handleEdit} className="edit_button">
            <GoPencil />
          </button>
        </div>

        <div className="admin_notice_view_buttons">
          {cookies.get("adminpw") && cookies.get("adminpw") === "passed" ? (
            <Link to="/admin" className="delete_button">
              <FaList />
            </Link>
          ) : (
            <Link to="/notice" className="delete_button">
              <FaList />
            </Link>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="delete_button"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
      <div className="admin_notice_view_date">
        {noticeDetail[0].NOTICE_DATE}
      </div>
      <div className="admin_notice_view_content">
        <div id="viewer"></div>
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
