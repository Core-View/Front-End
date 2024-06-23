import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// import { FaArrowRight } from 'react-icons/fa';

import { Button } from 'react-bootstrap';
import './Find_pwd.css';
import { useNavigate } from 'react-router';

const Find_pwd = () => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [email_show, setEmail_show] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [checkEmail_auth, setCheckEmail_auth] = useState('');
  const [mailComplete, setMailComplete] = useState(false);
  const [passwordValid, setPasswordValid] = useState(null);
  const [rePasswordValid, setRePasswordValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [checkEmailValid, setCheckEmailValid] = useState(null);
  const [formCompleted, setFormCompleted] = useState(false); // 새로운 상태 추가

  const regex = {
    name: /^.{1,}$/,
    nickname: /^.{1,10}$/,
    password:
      /^(?=.*[a-zA-Z가-힣])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z가-힣\d@$!%*?&]{8,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    checkEmail: /^\d{6}$/,
  };
  const navigate = useNavigate();
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
    const changePasswordButton = document.getElementById('ChangePassword');
    if (
      passwordValid &&
      rePasswordValid &&
      email === email_show &&
      mailComplete
    ) {
      changePasswordButton.removeAttribute('disabled');
    } else {
      changePasswordButton.setAttribute('disabled', 'disabled');
    }
  }, [passwordValid, rePasswordValid]);
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
      .post('http://localhost:3000/forgot-password', {
        user_email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          setEmail_show(email);
          alert('인증번호 전송 완료 되었습니다.');
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
      .post('http://localhost:3000/email-check', {
        authcode: checkEmail,
      })
      .then((response) => {
        if (response.status === 200) {
          if (email === email_show) {
            document.getElementById('FindEmail').setAttribute('disabled', true);
            document
              .getElementById('FindCheckEmail')
              .setAttribute('disabled', true);
            let emailAuthButtons =
              document.getElementsByClassName('email_authf');
            for (var i = 0; i < emailAuthButtons.length; i++) {
              emailAuthButtons[i].setAttribute('disabled', true);
            }
            document
              .querySelector('.input_componentFF')
              .classList.add('disabled');
          }
          setMailComplete(true);
          setFormCompleted(true);
          alert('인증 완료 되었습니다.');
        } else {
          alert('유효하지 않은 인증 번호입니다.');
        }
      })
      .catch((err) => {
        alert('유효하지 않은 인증 번호입니다.');
      });
  };
  const sendingChangePassword = () => {
    if (
      !emailValid ||
      !checkEmailValid ||
      !passwordValid ||
      !rePasswordValid ||
      !email_show ||
      !mailComplete
    ) {
      return;
    }
    axios
      .post('http://localhost:3000/reset-password', {
        user_email: email,
        user_password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          alert('비밀번호 변경 완료');
          navigate('/users/sign-in');
        } else {
          alert('유효하지 않은 이메일입니다.');
        }
      });
  };
  return (
    <div className={`find_main ${formCompleted ? 'form-completed' : ''}`}>
      <div className="flexi ">
        <div className="input_componentFF">
          <h4>이메일 인증후에 변경가능합니다이</h4>

          <div className="input_spaceF">
            <input
              type="email"
              id="FindEmail"
              placeholder="Email"
              value={email}
              onChange={onchangeEmail}
              className="input_areaF"
            />
            {email.length > 0 &&
              (emailValid ? (
                <></>
              ) : (
                <p className="nonPassRegexF">
                  영문자 또는 한글과 숫자 특수문자를 포함해야 합니다.
                </p>
              ))}
            <Button className="email_authf" onClick={sendingEmail}>
              이메일 인증
            </Button>
          </div>

          <div className="input_spaceF">
            <input
              type="text"
              id="FindCheckEmail"
              placeholder="인증번호"
              value={checkEmail}
              onChange={onchangeCheckEmail}
              className="input_areaF"
            />
            {checkEmail.length > 0 &&
              (checkEmailValid ? (
                <></>
              ) : (
                <p className="nonPassRegexF">
                  영문자 또는 한글과 숫자 특수문자를 포함해야 합니다.
                </p>
              ))}
            <Button className="email_authf" onClick={sendingCheckEmail_auth}>
              인증 확인
            </Button>
          </div>
          <div style={{ height: '11px' }}></div>
        </div>
        {/* <FaArrowRight /> */}

        <div className="input_componentFFF">
          <h4>새비밀 번호 설정가능합니다이</h4>
          <div className="input_spaceF">
            <input
              type="password"
              id="loginPassword"
              placeholder="Password"
              value={password}
              onChange={onchangePassword}
              className="input_areaF"
            />
            {password.length > 0 &&
              (passwordValid ? (
                <></>
              ) : (
                <p className="nonPassRegexF">
                  영문자 또는 한글과 숫자 특수문자를 포함해야 합니다.
                </p>
              ))}
          </div>
          <div className="input_spaceF">
            <input
              type="password"
              id="loginRePassword"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={onchangeRePassword}
              className="input_areaF"
            />
            {rePassword.length > 0 &&
              (rePasswordValid ? (
                <></>
              ) : (
                <p className="nonPassRegexF">
                  영문자 또는 한글과 숫자 특수문자를 포함해야 합니다.
                </p>
              ))}
          </div>
          <button id="ChangePassword" onClick={sendingChangePassword}>
            비밀번호 변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Find_pwd;
