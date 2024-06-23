import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import Alarm from './Alarm';
import { Cookies } from 'react-cookie';
import axios from 'axios';

function Header() {
  const cookies = new Cookies();
  const [userId, setUserId] = useState(cookies.get('user_id'));
  const [role, setRole] = useState(cookies.get('role'));
  const navigate = useNavigate();

  const deleteCookies = () => {
    cookies.remove('user_id');
    cookies.remove('role');
    cookies.remove('user_password');
    setUserId(undefined);
    setRole(undefined);
    window.location.reload();
  };

  const clickedAdmin = () => {
    let inputPassword = prompt('비밀번호를 입력하세요.', '');
    if (inputPassword) {
      axios
        .post(`http://localhost:3000/admin/login/${userId}`, {
          user_id: userId,
          role: role,
          password: inputPassword,
        })
        .then((response) => {
          if (response.data.success) {
            navigate('/admin');
          } else {
            alert('오류발생!');
            navigate('/');
          }
        });
    } else {
      alert('오류발생!');
    }
  };

  return (
    <header className="header">
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
              {role === 1 ? <Link to="/admin/check">관리자페이지</Link> : null}
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
              {userId === undefined ? (
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
