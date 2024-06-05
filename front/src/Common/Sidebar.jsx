import React from "react";
import "./sidebar.css";

const Sidebar = () => {
  // 하드코딩된 기여도 순위 데이터
  const contributors = [
    "김민주",
    "김장윤",
    "김해진",
    "김형준",
    "박지훈",
    "서원준",
    "이승진",
    "정중환",
  ];

  return (
    <div className="sidebar">
      <div className="rank">
        <div className="rank-title">기여도 순위</div>
        <ul className="rankcode">
          {contributors.map((name, index) => (
            <li key={index}>
              {index + 1}. {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
