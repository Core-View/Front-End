import React, { useEffect, useState } from "react";
import "./admin_main.css";
import { AiFillCaretRight } from "react-icons/ai";
import AdNotice from "./Admin_notice";
import AdPost from "./Admin_post";
import AdUsers from "./Admin_user";
import axios from "axios";

const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState("어떤관리");
  const [member, setMember] = useState([]);

  const getMember = () => {
    axios.get("http://localhost:3000/notice/viewuser").then((response) => {
      if (response.data.success === true) {
        console.log(response.data.user);
        setMember(response.data.user);
      }
    });
  };

  useEffect(() => {
    getMember();
  }, [<AdUsers />]);

  const renderMenuContent = () => {
    switch (selectedMenu) {
      case "회원관리":
        return <AdUsers />;
      case "공지사항":
        return <AdNotice />;
      case "게시판관리":
        return <AdPost />;
      default:
        return <div>메뉴를 선택해 주세요.</div>;
    }
  };

  const maxContribute = Math.max(...member.map((m) => m.USER_CONTRIBUTE));

  return (
    <div className="admin-container">
      <div className="member">
        <h3 className="admin_title">멤버&기여도현황</h3>
        <ul className="memberList">
          {member.map((a, i) => (
            <li key={i}>
              <span className="nickname">
                <AiFillCaretRight />
                <div>{a.USER_NICKNAME}</div>
              </span>
              <span style={{ width: "100px" }}>{a.USER_CONTRIBUTE}</span>
              <div
                className="gauge"
                style={{
                  width: `${(a.USER_CONTRIBUTE / maxContribute) * 50}%`,
                }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin_menu">
        <h3 className="admin_title">CoReview 관리자메뉴</h3>
        <ul className="admin_menu_list">
          <li onClick={() => setSelectedMenu("회원관리")}>회원관리</li>
          <li onClick={() => setSelectedMenu("공지사항")}>공지사항</li>
          <li onClick={() => setSelectedMenu("게시판관리")}>게시판관리</li>
        </ul>
        <div className="show_admin_menu">{renderMenuContent()}</div>
      </div>
    </div>
  );
};

export default Admin;
