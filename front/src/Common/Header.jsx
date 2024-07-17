import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import Alarm from './Alarm';
import { Cookies } from 'react-cookie';
import useAuthStore from '../Sign/Store';
import TokenChecker from './TokenStore';
function Header() {
  const { admin, accessToken } = TokenChecker();
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { isLoggedIn, userId, role, setLogout } = useAuthStore();
  const deleteCookies = () => {
    cookies.remove('user_id');
    cookies.remove('role');
    cookies.remove('user_password');
    setLogout();
    navigate('/');
  };

  return (
    <header className="header">
      {console.log(accessToken)}
      <div
        className="header-logo-container"
        onClick={() => {
          cookies.remove('adminpw');
        }}
      >
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
              {admin ? <Link to="/admin/check">관리자페이지</Link> : null}
            </li>
            <li
              onClick={() => {
                cookies.remove('adminpw');
              }}
            >
              <Link to="/post_main">전체 게시글</Link>
            </li>
            <li
              onClick={() => {
                cookies.remove('adminpw');
              }}
            >
              {userId === undefined ? (
                <Link to="/users/sign-in">글 쓰기</Link>
              ) : (
                <Link to="/post_write">글 쓰기</Link>
              )}
            </li>
            <li
              onClick={() => {
                cookies.remove('adminpw');
              }}
            >
              <Link to="/contribution_ranking">랭킹</Link>
            </li>
          </ul>
        </div>
        <div className="header-nav-right">
          <ul>
            <li
              onClick={() => {
                cookies.remove('adminpw');
              }}
            >
              {userId === undefined ? (
                <Link to="/users/sign-in">내 정보</Link>
              ) : (
                <Link to="/my_main">내 정보</Link>
              )}
            </li>
            <li
              onClick={() => {
                cookies.remove('adminpw');
              }}
            >
              {isLoggedIn === false ? (
                <Link to="/users/sign-in">로그인</Link>
              ) : (
                <Link to="/" onClick={deleteCookies}>
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
