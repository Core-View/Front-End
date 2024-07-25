import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineMailOutline } from 'react-icons/md';
import { MdOutlineVpnKey } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { VscGithubInverted } from 'react-icons/vsc';
import TokenChecker from '../../Common/TokenStore';
import './Sign_in.css';
import { Cookies } from 'react-cookie';

const Sign_in = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, delToken, checkAdmin, accessToken, admin } = TokenChecker();
  const onchangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const onchangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onsubmit = (e) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      console.log('아이디 비번 틀리면 나오는 콘솔');
      alert('아이디와 비밀번호를 모두 입력 해주세요');
      return;
    }
    console.log('로그인 요청 보내기전에 나오는 콘솔');
    axios
      .post('http://localhost:3000/login', {
        user_email: email,
        user_password: password,
      })
      .then((response) => {
        cookies.set('accessToken', response.data.Authorization);
        if (response.data.role === 1) {
          cookies.set('admin', true);
        } else {
          cookies.set('admin', false);
        }
        alert('로그인 성공, 홈으로 갑니다');
        return navigate('/');
      })
      .catch((error) => {
        console.log('로그인 버튼 클릭시 나타나는 오류', error.message);
        delToken();
        alert(error);
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
              alt=""
            ></img>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Sign_in;
