import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineMailOutline } from 'react-icons/md';
import { MdOutlineVpnKey } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { VscGithubInverted } from 'react-icons/vsc';
import useAuthStore from '../Store';
import TokenChecker from '../../Common/TokenStore';
import './Sign_in.css';

const Sign_in = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setLogin = useAuthStore((state) => state.setLogin);
  const setToken = TokenChecker((state) => state.setToken);
  const checkAdmin = TokenChecker((state) => state.checkAdmin);
  const onchangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const onchangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onsubmit = (e) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      alert('아이디와 비밀번호를 모두 입력 해주세요');
      return;
    }
    axios
      .post('http://localhost:3000/login', {
        user_email: email,
        user_password: password,
      })
      .then((response) => {
        console.log('토큰 체크 전 생로그인 ', response);
        setToken(response.data.Authorization);
        axios
          .post(
            'http://localhost:3000/admin/check',
            {},
            {
              headers: {
                Authorization: response.data.Authorization,
              },
            }
          )
          .then((response) => {
            console.log('토큰 체크 후 ', response);
            setLogin(response.data.success);
            checkAdmin(response.data.success);
            console.log('사인인에서 실행행');
            alert('성공성성');
            console.log('사인인에서 실행행');
            navigate('/'); // 상대 경로로 이동
          });
      })

      .catch((error) => {
        alert(error.message);
      });
  };

  const googleLog = () => {
    window.location.href = 'http://localhost:3000/sign/google';
  };
  return (
    <div className="container_si">
      <div className="loginForm_si">
        <div className="logo_si">
          <img src="/images/CoreView_logo_black.png" alt="logo" />
        </div>

        <form onSubmit={onsubmit} className="form_si">
          <div className="nickname_si">
            <div className="nick_label_si">
              <MdOutlineMailOutline className="logologo" />
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
              <MdOutlineVpnKey className="logologo" />
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
            <div className="goNabi">
              <div>
                <Link className="goNabiC" to="/users/find-pwd">
                  비번 재설정
                </Link>
              </div>
              <div>
                <Link className="goNabiC" to="/users/sign-up">
                  회원가입
                </Link>
              </div>
            </div>
          </div>

          {/* <Link className="google" to="http://localhost:3000/sign/google" /> */}
          <div className="socialLogin">
            <div className="line" />
            <span>간편로그인</span>
            <div className="line" />
          </div>
          <div className="loginicons">
            <FcGoogle onClick={googleLog} style={{ cursor: 'pointer' }} />
            <VscGithubInverted
              onClick={googleLog}
              style={{ cursor: 'pointer' }}
            />
            <img
              src="/images/navericon.png"
              className="naverIcon"
              onClick={googleLog}
            ></img>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sign_in;
