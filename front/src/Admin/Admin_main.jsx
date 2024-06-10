import React, { useState } from "react";
import "./admin_main.css";
import { GrScorecard } from "react-icons/gr";
import { AiFillCaretRight } from "react-icons/ai";
import AdNotice from "./Admin_notice";
import AdPost from "./Admin_post";

const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState("어떤관리");

  const member = [
    { name: "김민수", point: 10000 },
    { name: "이유진", point: 20000 },
    { name: "박지훈", point: 30000 },
    { name: "정수연", point: 40000 },
    { name: "최영준", point: 20230 },
    { name: "홍길동", point: 20044 },
    { name: "이서연", point: 20002 },
    { name: "강민준", point: 2000 },
    { name: "윤지호", point: 2000 },
    { name: "신예은", point: 20002 },
    { name: "오준서", point: 21000 },
    { name: "배수지", point: 2000 },
    { name: "장우영", point: 2000 },
    { name: "임나영", point: 20300 },
    { name: "서준혁", point: 2000 },
    { name: "권지민", point: 20050 },
    { name: "한예슬", point: 2000 },
    { name: "조승우", point: 2000 },
    { name: "문지후", point: 20200 },
    { name: "유진아", point: 20055 },
    { name: "유진아", point: 20055 },
    { name: "유진아", point: 20055 },
    { name: "유진아", point: 20055 },
    { name: "유진아", point: 20055 },
  ];

  const maxPoint = member.reduce(
    (max, { point }) => (point > max ? point : max),
    0
  );

  const renderMenuContent = () => {
    switch (selectedMenu) {
      case "어떤관리":
        return <div>어떤관리 내용</div>;
      case "공지사항":
        return <AdNotice />;
      case "게시판관리":
        return <AdPost />;
      default:
        return <div>메뉴를 선택해 주세요.</div>;
    }
  };

  return (
    <div className="admin-container">
      <div className="member">
        <h3 className="admin_title">회원&기여도관리</h3>
        <ul className="memberList">
          {member.map((a, i) => (
            <li key={i}>
              <span>
                <AiFillCaretRight />
                {a.name}&nbsp;&nbsp;
                <GrScorecard />
              </span>
              <span style={{ width: "100px" }}>{a.point}</span>
              <div
                className="gauge"
                style={{
                  width: `${(a.point / maxPoint) * 50}%`,
                }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin_menu">
        <h3 className="admin_title">CoReview 관리자메뉴</h3>
        <ul className="admin_menu_list">
          <li onClick={() => setSelectedMenu("어떤관리")}>어떤관리</li>
          <li onClick={() => setSelectedMenu("공지사항")}>공지사항</li>
          <li onClick={() => setSelectedMenu("게시판관리")}>게시판관리</li>
        </ul>
        <div className="show_admin_menu">{renderMenuContent()}</div>
      </div>
    </div>
  );
};

export default Admin;
