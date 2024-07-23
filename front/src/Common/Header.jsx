import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import Alarm from './Alarm';
import { Cookies } from 'react-cookie';
import TokenChecker from './TokenStore';
function Header() {
  const { admin, accessToken, delToken } = TokenChecker();
  const cookies = new Cookies();
  const navigate = useNavigate();
  const deleteCookies = () => {
    delToken(null, false);
    console.log(
      '로그아웃 했을때 토큰,어드민 상태',
      localStorage.getItem('token-store')
    );
    console.log('로그아웃했으니까 다시 로그인 화면으로 갑니다');
    navigate('/users/sign-in');
  };

  return (
    <header className="header">
      {console.log('헤더에 있는 토큰과 어드민', accessToken, admin)}
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
              {admin ? <Link to="/admin/check">관리자페이지</Link> : null}
            </li>
            <li>
              <Link to="/post_main">전체 게시글</Link>
            </li>
            <li>
              {!accessToken ? (
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
              {!accessToken ? (
                <Link to="/users/sign-in">내 정보</Link>
              ) : (
                <Link to="/my_main">내 정보</Link>
              )}
            </li>
            <li>
              {!accessToken ? (
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
