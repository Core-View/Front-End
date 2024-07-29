import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import Alarm from './Alarm';
import { Cookies } from 'react-cookie';
function Header() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const deleteCookies = () => {
    cookies.remove('accessToken');
    cookies.remove('admin');
    cookies.remove('role');
    navigate('/users/sign-in');
  };

  return (
    <header className="header">
      <div className="header-logo-container">
        <Link to="/">
          <img
            src="/images/logo_CV_black.png"
            alt="Logo"
            className="header-logo"
          />
        </Link>
      </div>

      <nav className="header-nav">
        <div className="header-nav-left">
          <ul>
            <li>
              {cookies.get('admin') === true ? (
                <Link to="/admin/check">관리자페이지</Link>
              ) : null}
            </li>
            <li>
              <Link to="/post/main">전체 게시글</Link>
            </li>
            <li>
              {!cookies.get('accessToken') ? (
                <Link to="/users/sign-in">글 쓰기</Link>
              ) : (
                <Link to="/post/write">글 쓰기</Link>
              )}
            </li>
            <li>
              <Link to="/contribution_ranking">랭킹</Link>
            </li>
          </ul>
        </div>
        <div className="header-nav-right">
          <ul>
            <li>
              {!cookies.get('accessToken') ? (
                <Link to="/users/sign-in">내 정보</Link>
              ) : (
                <Link to="/my/main">내 정보</Link>
              )}
            </li>
            <li>
              {!cookies.get('accessToken') ? (
                <Link to="/users/sign-in">로그인</Link>
              ) : (
                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteCookies();
                  }}
                >
                  로그아웃
                </Link>
              )}
            </li>
            <li>
              <Alarm />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
