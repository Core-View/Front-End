import React from 'react';
import './sidebar.css';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  let ranker = [
    '박지훈',
    '김민주',
    '서원준',
    '형준',
    '김해진',
    '이승진',
    '김장윤',
    '정중환',
    '신짱구',
    '김치장인',
  ];

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest('.sidebar') === null) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="sidebar">
      <div className="rank">
        <div>🎊기여도 랭킹🎊</div>
        <ul className="rankcode">
          {ranker.map((a, i) => (
            <li key={i}>
              <div>{i + 1}</div> {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
