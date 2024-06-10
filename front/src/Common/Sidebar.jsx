import React from "react";
import "./sidebar.css";

const Sidebar = () => {
<<<<<<< HEAD
  let ranker = [
    "박지훈",
    "김민주",
    "서원준",
    "형준",
    "김해진",
    "이승진",
    "김장윤",
    "정중환",
    "신짱구",
    "김치장인",
  ];

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest(".sidebar") === null) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);
=======
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
>>>>>>> d26aa18063adfffa628c3085f5ba0c854a0fd62c

  return (
    <div className="sidebar">
      <div className="rank">
<<<<<<< HEAD
        <div>🎊기여도 랭킹🎊</div>
        <ul className="rankcode">
          {ranker.map((a, i) => (
            <li key={i}>
              <div>{i + 1}</div> {a}
=======
        <div className="rank-title">기여도 순위</div>
        <ul className="rankcode">
          {contributors.map((name, index) => (
            <li key={index}>
              {index + 1}. {name}
>>>>>>> d26aa18063adfffa628c3085f5ba0c854a0fd62c
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
