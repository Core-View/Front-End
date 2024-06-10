import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Button } from 'react-bootstrap';
import './Find_pwd.css';

const Find_pwd = () => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [email_show, setEmail_show] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [checkEmail_auth, setCheckEmail_auth] = useState('');

  const [passwordValid, setPasswordValid] = useState(null);
  const [rePasswordValid, setRePasswordValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [checkEmailValid, setCheckEmailValid] = useState(null);
  const regex = {
    name: /^.{1,}$/,
    nickname: /^.{1,10}$/,
    password:
      /^(?=.*[a-zA-Z가-힣])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z가-힣\d@$!%*?&]{8,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    checkEmail: /^\d{6}$/,
  };

  const isValid = useCallback((checkReg, string) => {
    return checkReg.test(string);
  }, []);

  useEffect(() => {
    setPasswordValid(isValid(regex['password'], password));
  }, [password]);

  useEffect(() => {
    setRePasswordValid(password === rePassword);
  }, [password, rePassword]);
  useEffect(() => {
    setEmailValid(isValid(regex['email'], email));
  }, [email]);

  useEffect(() => {
    setCheckEmailValid(isValid(regex['checkEmail'], checkEmail));
  }, [checkEmail]);
  const onchangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const onchangeRePassword = useCallback((e) => {
    setRePassword(e.target.value);
  }, []);
  const onchangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const onchangeCheckEmail = useCallback((e) => {
    setCheckEmail(e.target.value);
  }, []);
  const sendingEmail = () => {
    if (email.length === 0) {
      alert('이메일을 입력해주세요');
      return;
    }
    axios
      .post('http://localhost:3000/sign/auth', {
        email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          setEmail_show(email);
        } else {
          alert('유효하지 않은 이메일입니다.');
        }
      });
  };

  const sendingCheckEmail_auth = () => {
    if (checkEmail.length === 0) {
      alert('인증번호를 입력해주세요');
      return;
    }
    axios
      .post('http://localhost:3000/sign/authcheck', {
        authcode: checkEmail,
      })
      .then((response) => {
        if (response.status === 200) {
          setCheckEmail_auth(checkEmail);
        } else {
          alert('유효하지 않은 인증 번호입니다.');
        }
      });
  };
  return (
    <div>
      <div className="flexi">
        <div className="input_componentFF">
          <div className="input_spaceF">
            <label htmlFor="loginEmail">이메일</label>
            <input
              type="email"
              id="loginEmail"
              placeholder="Email"
              value={email}
              onChange={onchangeEmail}
              className="input_area"
            />
            {emailValid !== null &&
              (emailValid ? (
                <p className="passRegex">사용가능 합니다</p>
              ) : (
                <p className="nonPassRegex">이메일 형식에 맞춰 주세요</p>
              ))}
            <Button className="email_auth" onClick={sendingEmail}>
              이메일 인증
            </Button>
          </div>

          <div className="input_spaceF">
            <label htmlFor="loginCheckEmail">인증번호</label>
            <input
              type="text"
              id="loginCheckEmail"
              placeholder="인증번호"
              value={checkEmail}
              onChange={onchangeCheckEmail}
              className="input_area"
            />
            {checkEmailValid !== null &&
              (checkEmailValid ? (
                <p className="passRegex">사용가능 합니다</p>
              ) : (
                <p className="nonPassRegex">6글자의 숫자 입력해주세요</p>
              ))}
            <Button className="email_auth" onClick={sendingCheckEmail_auth}>
              인증 확인
            </Button>
          </div>
        </div>
        <div className="input_componentFF">
          <div className="input_spaceF">
            <label htmlFor="loginPassword">비밀번호</label>
            <input
              type="password"
              id="loginPassword"
              placeholder="Password"
              value={password}
              onChange={onchangePassword}
              className="input_area"
            />
            {passwordValid !== null &&
              (passwordValid ? (
                <p className="passRegex">사용가능 합니다</p>
              ) : (
                <p className="nonPassRegex">
                  영문자 또는 한글 과 숫자 특수문자를 꼭 포함해야 합니다
                </p>
              ))}
          </div>

          <div className="input_spaceF">
            <label htmlFor="loginRePassword">비밀번호 확인</label>
            <input
              type="password"
              id="loginRePassword"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={onchangeRePassword}
              className="input_area"
            />
            {rePasswordValid !== null &&
              (rePasswordValid ? (
                <p className="passRegex">사용가능 합니다</p>
              ) : (
                <p className="nonPassRegex">일치하지 않습니다</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Find_pwd;
