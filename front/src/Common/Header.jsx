import React from 'react';
// npm install react-router-dom
import { Link } from 'react-router-dom';
import './header.css';
import Alarm from './Alarm';

function Header() {
  return (
    <header className="header">
      <div className="header-logo-container">
        <Link to="/">
          <img
            src="/images/CoreView_logo_white.png"
            alt="Logo"
            className="header-logo"
          />
        </Link>
      </div>
      <nav className="header-nav">
        <ul>
          <li>
            <Link to="/post_main">전체 게시글</Link>
          </li>
          <li>
            <Link to="/post_write">글 쓰기</Link>
          </li>
          <li>
            <Link to="/my_main">내 정보</Link>
          </li>
          <li>
            <Link to="/users/sign-in">로그인</Link>
          </li>
          <li>
            <Alarm />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
