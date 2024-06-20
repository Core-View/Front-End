import React, { useState } from "react";
// npm install react-router-dom
import { Link, redirect } from "react-router-dom";
import "./header.css";
import Alarm from "./Alarm";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header() {
  const cookies = new Cookies();
  const [userId, setUserId] = useState(cookies.get("user_id"));
  const [role, setRole] = useState(cookies.get("role"));
  const deleteCookies = () => {
    cookies.remove("user_id");
    cookies.remove("role");
    setUserId(undefined);
    setRole(undefined);
    window.location.reload();
  };

  const navigate = useNavigate();
  console.log("미안요");
  const clickedAdmin = () => {
    let inputPassword = prompt("비밀번호를 입력하세요.", "");
    if (inputPassword) {
      axios
        .post(`http://localhost:3000/admin/login/${userId}`, {
          user_id: userId,
          role: role,
          password: inputPassword,
        })
        .then((response) => {
          if (response.data.success === true) {
            navigate("/admin");
          } else {
            alert("오류발생!");
            navigate("/");
          }
        });
    } else {
      alert("오류발생!");
    }
  };
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
          {role === 1 ? (
            <div
              className="gotoAdmin"
              onClick={() => {
                clickedAdmin();
              }}
            >
              관리자페이지
            </div>
          ) : (
            ""
          )}
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
      </nav>
    </header>
  );
}

export default Header;
