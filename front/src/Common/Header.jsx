import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import Alarm from './Alarm';
import { Cookies } from 'react-cookie';
import TokenChecker from './TokenStore';
function Header() {
  const { admin, accessToken, delToken } = TokenChecker();
  console.log('aasdfsdfa', admin);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const deleteCookies = () => {
    delToken(null, false);
    navigate('/users/sign-in');
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
            <li onClick={() => {}}>
              <Link to="/post_main">전체 게시글</Link>
            </li>
            <li onClick={() => {}}>
              {console.log(accessToken)}
              {!accessToken ? (
                <Link to="/users/sign-in">글 쓰기</Link>
              ) : (
                <Link to="/post/write">글 쓰기</Link>
              )}
            </li>
            <li onClick={() => {}}>
              <Link to="/contribution_ranking">랭킹</Link>
            </li>
          </ul>
        </div>
        <div className="header-nav-right">
          <ul>
            <li onClick={() => {}}>
              {accessToken ? (
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
              {!accessToken ? (
                <Link to="/users/sign-in">로그인</Link>
              ) : (
                <Link to="/" onClick={deleteCookies}>
                  로그아웃
                </Link>
              )}

              {console.log(accessToken)}
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
