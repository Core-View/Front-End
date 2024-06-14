import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";

import "./Sign_in.css";

const Sign_in = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onchangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const onchangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const onsubmit = (e) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      alert("아이디와 비밀번호를 모두 입력 해주세요");
      return;
    }
    axios
      .post("http://localhost:3000/login", {
        user_email: email,
        user_password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          cookies.set("user_id", response.data);
          alert("성공");
          cookies.set("user_id", response.data);
          alert("성공");
        } else {
          alert("비번틀림");
        }
      })
      .then(() => {
        navigate("/"); // 상대 경로로 이동
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const googleLog = () => {
    // axios.get('http://localhost:3000/auth/google').then((response) => {
    //   if (response.status === 200) {
    //     alert('성공');
    //     navigate('/'); // 상대 경로로 이동
    //   }
    // });
    navigate("/auth/google");
  };
  return (
    <div className="container_si">
      <div className="loginForm_si">
        <div className="logo_si">
          <img src="/images/CoreView_logo_white.png" alt="logo" />
        </div>

        <form onSubmit={onsubmit} className="form_si">
          <div className="nickname_si">
            <div className="nick_label_si">
              <label>E-mail</label>
            </div>
            <input
              type="email"
              id="loginNickname"
              placeholder="Email"
              value={email}
              onChange={onchangeEmail}
              className="nick_input_si"
            />
          </div>
          <div className="password_si">
            <div className="pass_label_si">
              <label>Password</label>
            </div>
            <input
              type="password"
              id="loginPassword"
              placeholder="Password"
              value={password}
              onChange={onchangePassword}
              className="pass_input_si"
            />
          </div>
          <div className="submit_si">
            <button type="submit">로그인</button>
          </div>
          <div className="google" onClick={googleLog}></div>
        </form>
        <div>
          <div>
            Don’t have an account? <Link to="/">Sign up</Link>
          </div>

          <div className="">
            Are you an employer? <Link to="/">Sign up on Talent </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign_in;
