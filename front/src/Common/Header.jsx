import React from 'react';
// npm install react-router-dom
import { Link } from 'react-router-dom';
import './header.css';
import Alarm from './Alarm';

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img
          src="/images/CoreView_logo_white.png"
          alt="Logo"
          className="header-logo"
        />
      </Link>
      <nav className="header-nav">
        <ul>
          <li>
            <Link to="/">home_main</Link>
          </li>
          <li>
            <Link to="my_main">my_main</Link>
          </li>
          <li>
            <Link to="/post_main">전체 게시글</Link>
          </li>
          <li>
            <Link to="users/sign-in">signin_main</Link>
          </li>
          <li>
            <Link to="post_view">포스트 보기</Link>
          </li>
          <li>
            <Link to="post_write">글쓰기</Link>
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
