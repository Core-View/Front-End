import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './post_view_notification.css';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

const PostNoticeView = () => {
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
        console.error('다시 시도해주세요', error);
      });
  };

  useEffect(() => {
    // console.log('getNoticeDetail');
    getNoticeDetail();
  }, [id, noticeDetail]);

  useEffect(() => {
    // console.log('if');
    if (noticeDetail) {
      const viewer = new Viewer({
        el: document.querySelector('#viewer'),
        height: '600px',
        initialValue: noticeDetail.NOTICE_CONTENT,
      });
    }
  }, [noticeDetail]);

  // const handleEdit = () => {
  //   navigate(`/notice/modify/${id}`);
  // };

  // const handleDelete = () => {
  //   axios
  //     .delete(`http://localhost:3000/notice/delete/${id}`)
  //     .then((response) => {
  //       if (response.data.success === true) {
  //         alert('삭제 성공!');
  //         navigate('/admin');
  //       }
  //     });
  // };

  if (!noticeDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin_notice_view_container">
      <div className="admin_notice_view_header">
        <div className="admin_notice_view_title">
          {noticeDetail.NOTICE_TITLE}
        </div>
        {/* <div className="admin_notice_view_buttons">
          <button onClick={handleEdit} className="edit_button">
            수정
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="delete_button"
          >
            삭제
          </button>
        </div> */}
      </div>
      <div className="admin_notice_view_date">{noticeDetail.NOTICE_DATE}</div>
      <div className="admin_notice_view_content">
        <div id="viewer"></div>
      </div>
      <div className="admin_notice_view_img">
        {noticeDetail.NOTICE_IMAGE && (
          <img src={noticeDetail.NOTICE_IMAGE} alt="" />
        )}
      </div>
    </div>
  );
};

export default PostNoticeView;
