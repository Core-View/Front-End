import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

import './Sign_up.css';
import vaildCHeck from './vaildCHeck';
import AgreeContent from './agree';
const Sign_in = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [email_show, setEmail_show] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [checkEmail_auth, setCheckEmail_auth] = useState('');

  const [nameValid, setNameValid] = useState(null);
  const [nicknameValid, setNicknameValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [rePasswordValid, setRePasswordValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [checkEmailValid, setCheckEmailValid] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [agreed, setAgreed] = useState(false);
  const handleAgree = () => {
    setAgreed(true);
    setShow(false);
  };
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
    setNameValid(isValid(regex['name'], name));
  }, [name]);

  useEffect(() => {
    setNicknameValid(isValid(regex['nickname'], nickname));
  }, [nickname]);

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

  const onchangeName = useCallback((e) => {
    setName(e.target.value);
  }, []);
  const onchangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);
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

  const onsubmit = (e) => {
    e.preventDefault();
    if (
      !nicknameValid ||
      !passwordValid ||
      !nameValid ||
      !rePasswordValid ||
      !emailValid ||
      !checkEmailValid
    ) {
      alert('입력 사항을 모두 올바르게 입력 해주세요');
      return;
    }
    if (email !== email_show) {
      console.log(email);
      console.log(email_show);
      alert('인증한 이메일과 다릅니다');
      return;
    }
    if (checkEmail !== checkEmail_auth) {
      alert('인증한 인증 번호와 다릅니다');
      return;
    }
    axios
      .post('http://localhost:3000/sign/signup', {
        user_name: name,
        user_nickname: nickname,
        user_password: password,
        user_email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          alert('성공');
          navigate('/users/sign-in');
        } else {
          alert('비번틀림');
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const sendingEmail = () => {
    if (email.length === 0) {
      alert('이메일을 입력해주세요');
      return;
    }
    axios
      .post('http://localhost:3000/sign/auth', {
        user_email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          setEmail_show(email);
          console.log(email_show);
          alert('이메일 전송했습니다');
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
        user_email: email,
        user_authcode: checkEmail,
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
    <div className="container">
      <div className="loginForm">
        <div className="logo">
          <img src="/images/CoreView_logo_black.png" alt="logo" />
        </div>
        <form onSubmit={onsubmit} className="form">
          <div className="input_component">
            <div className="input_space">
              <label className="label" htmlFor="loginName">
                이름
              </label>
              {name.length > 0 ? vaildCHeck(nameValid) : <></>}
              <input
                type="text"
                id="loginName"
                placeholder="Name"
                value={name}
                onChange={onchangeName}
                className="input_area"
                style={
                  name.length > 0
                    ? {
                        borderBottom: nameValid
                          ? '2px solid rgb(67, 197, 67)'
                          : '2px solid red',
                      }
                    : {}
                }
              />
            </div>
            {name.length > 0 &&
              (nameValid ? (
                <></>
              ) : (
                <p className="nonPassRegex">
                  이름은 1글자이상의 글자로 이루어져야 합니다
                </p>
              ))}
          </div>
          <div className="input_component">
            <div className="input_space">
              <label className="label" htmlFor="loginNickName">
                닉네임
              </label>
              {nickname.length > 0 ? vaildCHeck(nicknameValid) : <></>}
              <input
                type="text"
                id="loginNickname"
                placeholder="Nickname"
                value={nickname}
                onChange={onchangeNickname}
                className="input_area"
                style={
                  nickname.length > 0
                    ? {
                        borderBottom: nicknameValid
                          ? '2px solid rgb(67, 197, 67)'
                          : '2px solid red',
                      }
                    : {}
                }
              />
            </div>
            {nickname.length > 0 &&
              (nicknameValid ? (
                <></>
              ) : (
                <p className="nonPassRegex">
                  닉네임은 10글자 이하로 이루어져야 합니다
                </p>
              ))}
          </div>
          <div className="input_component">
            <div className="input_space">
              <label className="label" htmlFor="loginPassword">
                비밀번호
              </label>
              {password.length > 0 ? vaildCHeck(passwordValid) : <></>}
              <input
                type="password"
                id="loginPassword"
                placeholder="Password"
                value={password}
                onChange={onchangePassword}
                className="input_area"
                style={
                  password.length > 0
                    ? {
                        borderBottom: passwordValid
                          ? '2px solid rgb(67, 197, 67)'
                          : '2px solid red',
                      }
                    : {}
                }
              />
            </div>
            {password.length > 0 &&
              (passwordValid ? (
                <></>
              ) : (
                <p className="nonPassRegex">
                  영문자 또는 한글과 숫자 특수문자를 포함해야 합니다.
                </p>
              ))}
          </div>
          <div className="input_component">
            <div className="input_space">
              <label className="label" htmlFor="loginRePassword">
                비밀번호 확인
              </label>
              {rePassword.length > 0 ? vaildCHeck(rePasswordValid) : <></>}
              <input
                type="password"
                id="loginRePassword"
                placeholder="Re-enter Password"
                value={rePassword}
                onChange={onchangeRePassword}
                className="input_area"
                style={
                  rePassword.length > 0
                    ? {
                        borderBottom: rePasswordValid
                          ? '2px solid rgb(67, 197, 67)'
                          : '2px solid red',
                      }
                    : {}
                }
              />
            </div>
            {rePassword.length > 0 &&
              (rePasswordValid ? (
                <></>
              ) : (
                <p className="nonPassRegex">일치하지 않습니다</p>
              ))}
          </div>

          <div className="input_component">
            <div className="input_space">
              <label className="label" htmlFor="loginEmail">
                이메일
              </label>
              {email.length > 0 ? vaildCHeck(emailValid) : <></>}
              <div>
                <input
                  type="email"
                  id="loginEmail"
                  placeholder="Email"
                  value={email}
                  onChange={onchangeEmail}
                  className="input_area_email"
                  style={
                    email.length > 0
                      ? {
                          borderBottom: emailValid
                            ? '2px solid rgb(67, 197, 67)'
                            : '2px solid red',
                        }
                      : {}
                  }
                />
                <Button className="email_auth" onClick={sendingEmail}>
                  이메일 인증
                </Button>
              </div>
            </div>

            {email.length > 0 &&
              (emailValid ? (
                <></>
              ) : (
                <p className="nonPassRegex">이메일 형식에 맞춰 주세요</p>
              ))}
          </div>
          <div className="input_component">
            <div className="input_space">
              <label className="label" htmlFor="loginCheckEmail">
                인증번호
              </label>
              {checkEmail.length > 0 ? vaildCHeck(checkEmailValid) : <></>}
              <div>
                <input
                  type="text"
                  id="loginCheckEmail"
                  placeholder="인증번호"
                  value={checkEmail}
                  onChange={onchangeCheckEmail}
                  className="input_area_email"
                  style={
                    checkEmail.length > 0
                      ? {
                          borderBottom: checkEmailValid
                            ? '2px solid rgb(67, 197, 67)'
                            : '2px solid red',
                        }
                      : {}
                  }
                />
                <Button className="email_auth" onClick={sendingCheckEmail_auth}>
                  인증 확인
                </Button>
              </div>
            </div>
            {checkEmail.length > 0 &&
              (checkEmailValid ? (
                <p className="passRegex">사용가능 합니다</p>
              ) : (
                <p className="nonPassRegex">6글자의 숫자 입력해주세요</p>
              ))}
          </div>
          <div className="input_component_small">
            <div className="input_space">
              <div className="pernal_message">개인정보 확인을 해주세요</div>
              <Button
                className="pernal_button"
                variant="primary"
                onClick={handleShow}
              >
                개인정보 확인 하기
              </Button>
              {show && (
                <>
                  <div className="modal-backdrop" onClick={handleClose}></div>
                  <div className="custom-modal">
                    <div className="modal-header">
                      <h5 className="modal-title">개인정보 확인 약관</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={handleClose}
                      >
                        X
                      </button>
                    </div>

                    <AgreeContent lassName="modal-body" />

                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={handleClose}
                      >
                        닫기
                      </button>
                      <button className="btn btn-primary" onClick={handleAgree}>
                        동의합니다
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {agreed && (
              <p className="passRegex">개인정보 처리 방침에 동의하셨습니다.</p>
            )}
          </div>
          <div className="input_component_small">
            <div className="submit">
              <button type="submit">회원가입</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sign_in;
