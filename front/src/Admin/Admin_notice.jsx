import React, { useEffect } from "react";
import axios from "axios";
import "./admin_notice.css";
import { useState } from "react";

const AdminNotice = () => {
  const [noticeLists, setNoticeLists] = useState("");
  const getNotice = () => {
    axios.get(`/notice/view`).then((response) => {
      console.log(response);
      if (response.data.success === true) {
        let noticeList = response.data.notice;
        console.log(noticeList);
        setNoticeLists(noticeList);
      }
    });
  };

  useEffect(() => {
    getNotice();
  }, []);

  return (
    <div className="admin_notice_container">
      <ul className="ad_notice_list">
        {noticeLists.map((a, i) => (
          <li key={i}>{a.notice_title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotice;
