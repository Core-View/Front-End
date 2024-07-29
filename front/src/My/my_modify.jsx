import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './my_modify.css';
import { IoIosWarning } from 'react-icons/io';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import useAuthStore from '../Sign/Store'; // useAuthStore를 가져옵니다

const Mymodify = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { setLogout } = useAuthStore(); // setLogout을 사용합니다
  const [imageSrc, setImageSrc] = useState('/images/original_profile.png');
  const [imageFile, setImageFile] = useState(null);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [intro, setIntro] = useState('');
  const [introError, setIntroError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidityMessage, setPasswordValidityMessage] = useState('');
  const myrole = cookies.get('role');

  const [preimage, setpreimage] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user_password, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const fetchUserData = async () => { //user 정보 가져오는 api요청
      axios
        .get(`http://localhost:3000/mypage/`, {
          headers: {
            Authorization: cookies.get('accessToken'),
          },
        })
        .then((response) => {
          if (response.data.success === true) {
            const data = response.data.userInfo;
            if (!data.profile_picture || data.profile_picture === 'null') {
              data.profile_picture = `${process.env.PUBLIC_URL}/images/original_profile.png`;
            } else {
              data.profile_picture = `${process.env.PUBLIC_URL}/${data.profile_picture}`;
            }
            setpreimage(data.profile_picture);
            setImageSrc(data.profile_picture);
            setNickname(data.nickname);
            setIntro(data.introduction || '제 꿈은 개발자입니다.');
          }
        })
        .catch((err) => {
          console.log('마이 페이지 접근 요청 할때 catch된 에러', err.messsage);
          if (err.response.status === 401) {
            console.log(
              '401 에러 가 떴을때! 만료가 되었답니다! 그리고 refresh 토큰 받는 요청 get으로 보냄'
            );
            axios
              .get('http://localhost:3000/token/refresh', {
                headers: {
                  Authorization: cookies.get('accessToken'),
                },
              })
              .then((response) => {
                if (response.status === 200) {
                  console.log(
                    '리프래시 토큰으로 요청 보냈을때 받은 응답',
                    response
                  );
                  cookies.set('accessToken', response.data.Authorization);
                  console.log('토큰 설정해주기', cookies.get('accessToken'));
                  console.log('잘 됬으니까 다시 마이 페이지로 넘어가기');
                  return navigate('/my/modify');
                } else if (response.status === 400) {
                  console.log('그 밖의 오류났을때, 일단 400일때 그냥 통과하기');
                  return navigate(-1);
                }
              })
              .catch((err) => {
                if (err.response.status === 401) {
                  console.log(
                    '리프래시에서 401이 떴을때, 권한 다 지우고 로그인 화면으로 보내기'
                  );
                  alert('권한이 없습니다.');
                  cookies.remove('accessToken');
                  cookies.remove('admin');
                  console.log(
                    '권한 다 지웠습니다',
                    cookies.get('accessToken'),
                    cookies.get('admin')
                  );
                  return navigate('/users/sign-in');
                }
              });
          }
        });
    };
    fetchUserData();
  },[]);

  const regex = {
    password:
      /^(?=.*[a-zA-Z가-힣])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z가-힣\d@$!%*?&]{8,}$/,
  };

  const isValid = useCallback((checkReg, string) => {//비밀번호 유효성 검사
    return checkReg.test(string);
  }, []);

  const encodeFileToBase64 = (fileBlob) => {  //프로필 이미지 미리보기 저장
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    reader.onload = () => {
      setImageSrc(reader.result);
      setImageFile(fileBlob); // 파일 객체 설정
    };
  };

  const handlePasswordChange = (e) => { //비밀번호
    const newPw = e.target.value;
    setPassword(newPw);
    validatePasswords(newPw, confirmPassword);
    validatePasswordFormat(newPw);
  };

  const handleConfirmPasswordChange = (e) => {  //비밀번호 확인
    const newConfirmPw = e.target.value;
    setConfirmPassword(newConfirmPw);
    validatePasswords(password, newConfirmPw);
  };

  const validatePasswords = (pw, confirmPw) => {  //다르다면 오류 메세지 띄어줌
    if (confirmPw && pw !== confirmPw) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('');
    }
  };

  const validatePasswordFormat = (password) => {  //비밀번호 유효성 검사 적합하지 않으면 오류 메세지 띄어줌
    if (!isValid(regex.password, password)) {
      setPasswordValid(false);
      setPasswordValidityMessage(
        '비밀번호는 한글 또는 영어, 숫자, 특수문자를 포함해야 합니다.'
      );
    } else {
      setPasswordValid(true);
      setPasswordValidityMessage('');
    }
  };

  const handleNicknameChange = (e) => { //닉네임 글자수 제한
    const newNickname = e.target.value;
    setNickname(newNickname);
    if (newNickname.length > 10) {
      setNicknameError('닉네임은 10자 이하로 입력해주세요.');
    } else {
      setNicknameError('');
    }
  };

  const handleIntroChange = (e) => {  //자기소개 글자수 제한
    const value = e.target.value;
    setIntro(value);
    if (value.length > 30) {
      setIntroError('자기소개는 30자를 초과할 수 없습니다.');
    } else {
      setIntroError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFile) {  //이미지를 수정했다면 이미지 수정 api 요청
      const formData = new FormData();
      formData.append('user_image', imageFile);
      axios
      .post(
        `http://localhost:3000/mypage/modifyImage`,
        formData,
        {
          headers: {
            Authorization: cookies.get('accessToken'),
          },
        }
      )
      .then((response) => {
        if (response.data.success === true) {
          axios
            .post(
              `http://localhost:3000/mypage/deleteImage`,
              { preimage },
              {
                headers: {
                  Authorization: cookies.get('accessToken'),
                },
              }
            )
            .then((responsed) => {
              if (responsed.data.success === true) {
              } else {
                alert('프로필이 삭제되지 않았습니다. 관리자에게 문의 부탁드립니다.');
              }
            })
            .catch((error) => {
              console.error('Error uploading images:', error);
              alert('이미지 삭제 중 오류가 발생했습니다. 관리자에게 문의하세요.');
              return;
            });
            navigate('/my/main');
        } else {
          alert('프로필이 수정되지 않았습니다. 관리자에게 문의 부탁드립니다.');
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        alert('이미지 업로드 중 오류가 발생했습니다. 관리자에게 문의하세요.');
        return;
      });
    }
    const finalPassword = password;
    const finalConfirmPassword = confirmPassword;
    const profileData = {
      user_nickname: nickname,
      user_password: finalPassword,
      user_password_confirm: finalConfirmPassword,
      user_intro: intro,
    };
    if (
      (!passwordValid && password) ||
      password !== confirmPassword ||
      intro.length > 30
    ) {
      alert('입력조건이 유효하지 않습니다. 조건을 확인해 주세요.');
      return;
    } else {
      axios
        .put(
          `http://localhost:3000/mypage/modify`,
          profileData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: cookies.get('accessToken'),
            },
          }
        )
        .then((response) => {
          if (response.data.success === true) {
            alert('프로필이 수정되었습니다.');
            navigate('/my/main');
          } else {
            alert('프로필이 수정되지 않았습니다. 관리자에게 문의부탁드립니다.');
          }
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          alert('프로필 업데이트 중 오류가 발생했습니다. 관리자에게 문의하세요.');
          if (error.response) {
            console.log('Error response data:', error.response.data);
            console.log('Error response status:', error.response.status);
            console.log('Error response headers:', error.response.headers);
          } else if (error.request) {
            console.log('Error request data:', error.request);
          } else {
            console.log('Error message:', error.message);
          }
        });
    }
  };

  const handleDeleteAccount = async () => { //회원 탈퇴 api요청
    axios
      .delete(
        `http://localhost:3000/mypage/delete`,
        {
          headers: {
            Authorization: cookies.get('accessToken'),
          },
        }
      )
      .then((response) => {
        cookies.remove('accessToken');
        cookies.remove('admin');
        setLogout();
        alert('회원탈퇴가 완료되었습니다.');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
        alert('회원탈퇴 중 오류가 발생했습니다. 관리자에게 문의하세요.');
      });
  };
  useEffect(() => {
    setPasswordValid(isValid(regex.password, password));
  }, [password, isValid, regex]);

  const handlePassword = (e) => {
    setUserPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e) => { //비밀번호 확인 api요청
    e.preventDefault();
    axios
      .post(
        `http://localhost:3000/password/verify/`,
        { user_password },
        {
          headers: {
            Authorization: cookies.get('accessToken'),
          },
        }
      )
      .then((response) => {
        if (response.data.success === true) {
          handleDeleteAccount();
        } else {
          setErrorMessage('비밀번호가 일치하지 않습니다.');
        }
      })
      .catch((error) => {
        console.error('Error verifying password:', error);
        setErrorMessage('비밀번호 검증 중 오류가 발생했습니다.');
      });
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="modi_field">
          <h1>내 정보</h1>
          <hr style={{ backgroundColor: '#ccc', height: '2px' }} />
          <br />
          <div className="photo">
            <label className="profile_L">프로필 사진</label>
            <div className="profile_D">
              {imageSrc && (
                <img src={imageSrc} alt="preview-img" className="prefile" />
              )}
              <div className="modi_second_div">
                <label htmlFor="file-upload" className="file-upload-btn">
                  사진 변경
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="user_image"
                  accept="image/*"
                  onChange={(e) => {
                    encodeFileToBase64(e.target.files[0]);
                    setImageFile(e.target.files[0]); // 파일 객체 설정
                  }}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="introduce_zone">
            <label className="intro_L">자기소개</label>
            <div className="intro_D">
              <input
                type="text"
                name="my_introduce"
                maxLength="30"
                value={intro}
                onChange={handleIntroChange}
                className="intro_I"
              ></input>
              {introError && <div className="intro_error">{introError}</div>}
            </div>
          </div>
          <div className="nick_zone">
            <label className="nick_L">닉네임</label>
            <div className="nick_D">
              <input
                type="text"
                name="nickname"
                value={nickname}
                onChange={handleNicknameChange}
                className="nick_I"
              ></input>
              {nicknameError && (
                <div className="nickname_error">{nicknameError}</div>
              )}
            </div>
          </div>
          <div className="password_zone">
            <label className="password_L">비밀번호</label>
            <div className="password_D">
              <input
                type="password"
                name="pw"
                value={password}
                onChange={handlePasswordChange}
                className="password_I"
              ></input>
              {!passwordValid && (
                <div className="password_error">{passwordValidityMessage}</div>
              )}
            </div>
          </div>
          <div className="pcheck_zone">
            <label className="pcheck_L">비밀번호 확인</label>
            <div className="pcheck_D">
              <input
                type="password"
                name="pw_check"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="pcheck_I"
              ></input>
              {passwordError && (
                <div className="password_error">{passwordError}</div>
              )}
            </div>
          </div>
          <div className="button_zone">
            <div className="submit_D">
              <input
                type="submit"
                value="수정하기"
                className="submit_I"
              ></input>
            </div>
          </div>
        </div>
      </form>
      <div className="delete_D">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setUserPassword('');
            setErrorMessage('');
          }}
          className="delete_B"
        >
          회원탈퇴
        </button>
      </div>
      {isModalOpen && (
        <div className="modi_modal">
          <form
            onSubmit={handlePasswordSubmit}
            className="modi_check_P modi_modal-content"
          >
            <div className="modi_close_btn">
              <span
                className="modi_close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </span>
            </div>
            <div className="modi_warning_zone">
              <IoIosWarning />
            </div>
            <h2>회원 탈퇴를 하시겠습니까?</h2>
            <h4>회원 탈퇴 시 영구히 삭제되어 복구할 수 없습니다.</h4>
            <div className="modi_last_div">
              {myrole === 2 ? (
                <button type="button" onClick={handleDeleteAccount} className="my_modi_modal_btn">
                  네
                </button>
              ) : (
                <>
                  <input
                    type="password"
                    value={user_password}
                    onChange={handlePassword}
                    placeholder="비밀번호 입력"
                    className="mymodi_input"
                    required
                  />
                  {errorMessage && <p className="modi_error">{errorMessage}</p>}
                </>
              )}
            </div>
            {myrole !== 2 && (
              <button type="submit" className="my_modi_modal_btn">
                확인
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Mymodify;
