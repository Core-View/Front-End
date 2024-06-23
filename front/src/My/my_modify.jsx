import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./my_modify.css";
import { IoIosWarning } from "react-icons/io";
import { Cookies } from "react-cookie";
import axios from 'axios';

const Mymodify = () => {
  const cookies = new Cookies();
  const userPasswordCookie = cookies.get("user_password");
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("/images/original_profile.png");
  const [imageFile, setImageFile] = useState(null);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [intro, setIntro] = useState("");
  const [introError, setIntroError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidityMessage, setPasswordValidityMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [preimage,setpreimage] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user_password, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userIdFromCookie = cookies.get("user_id");
    if (!userIdFromCookie) {
      navigate("/users/sign-in");
    } else {
      setUserId(userIdFromCookie);
    }
  }, [cookies, navigate]);

  const regex = {
    password:
      /^(?=.*[a-zA-Z가-힣])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z가-힣\d@$!%*?&]{8,}$/,
  };

  const isValid = useCallback((checkReg, string) => {
    return checkReg.test(string);
  }, []);

  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    reader.onload = () => {
      setImageSrc(reader.result);
      setImageFile(fileBlob); // 파일 객체 설정
    };
  };

  const handlePasswordChange = (e) => {
    const newPw = e.target.value;
    setPassword(newPw);
    validatePasswords(newPw, confirmPassword);
    validatePasswordFormat(newPw);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPw = e.target.value;
    setConfirmPassword(newConfirmPw);
    validatePasswords(password, newConfirmPw);
  };

  const validatePasswords = (pw, confirmPw) => {
    if (confirmPw && pw !== confirmPw) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  };

  const validatePasswordFormat = (password) => {
    if (!isValid(regex.password, password)) {
      setPasswordValid(false);
      setPasswordValidityMessage(
        "비밀번호는 한글 또는 영어, 숫자, 특수문자를 포함해야 합니다."
      );
    } else {
      setPasswordValid(true);
      setPasswordValidityMessage("");
    }
  };

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    if (newNickname.length > 10) {
      setNicknameError("닉네임은 10자 이하로 입력해주세요.");
    } else {
      setNicknameError("");
    }
  };

  const handleIntroChange = (e) => {
    const value = e.target.value;
    setIntro(value);
    if (value.length > 30) {
      setIntroError("자기소개는 30자를 초과할 수 없습니다.");
    } else {
      setIntroError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFile) {
      const formData = new FormData();
      formData.append("user_image", imageFile);

      try {
        const imageResponse = await fetch(
          `http://localhost:3000/mypage/${userId}/modifyImage`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Image upload failed");
        }

        const imageData = await imageResponse.json();
        if (imageData.access) {
          try {
            const imageDResponse = await axios.post(
              `http://localhost:3000/mypage/${userId}/deleteImage`,
              {
                preimage,
              }
            );
              console.log("이전",preimage);
    
            const imageDataD = await imageDResponse;
            console.log(imageDataD)
            if (imageDataD.data.access) {
            
            } else {
              alert("프로필이 삭제되지 않았습니다. 관리자에게 문의 부탁드립니다.");
            }
            
          } catch (error) {
            console.error("Error uploading image:", error);
            alert("이미지 삭제 중 오류가 발생했습니다. 관리자에게 문의하세요.");
            return;
          }
          alert(imageData.message);
          navigate('/my_main');
        } else {
          alert("프로필이 수정되지 않았습니다. 관리자에게 문의 부탁드립니다.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("이미지 업로드 중 오류가 발생했습니다. 관리자에게 문의하세요.");
        return;
      }
    }
    const finalPassword = password || userPasswordCookie;
    const finalConfirmPassword = confirmPassword || userPasswordCookie;
    const profileData = {
      user_nickname: nickname,
      user_password: finalPassword,
      user_password_confirm: finalConfirmPassword,
      user_intro: intro,
    };
    if ((!passwordValid && password) || password !== confirmPassword || intro.length > 30) {
        alert("입력조건이 유효하지 않습니다. 조건을 확인해 주세요.");
        return;
    }else{
      
      try {
        const response = await fetch(
          `http://localhost:3000/mypage/${userId}/modify`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
          }
        );
  
        if (!response.ok) {
          throw new Error("Profile update failed");
        }
  
        const data = await response.json();
        if (data.access) {
          console.log("멍",profileData);
          alert(data.message);
          navigate("/my_main");
        } else {
          alert("프로필이 수정되지 않았습니다. 관리자에게 문의부탁드립니다.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("프로필 업데이트 중 오류가 발생했습니다. 관리자에게 문의하세요.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/mypage/${userId}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Account deletion failed");
      }

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("회원탈퇴 중 오류가 발생했습니다. 관리자에게 문의하세요.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/mypage/${userId}`);
        const data = await response.json();
        setpreimage(data.profile_picture);
        if (!data.profile_picture || data.profile_picture === "null") {
          data.profile_picture = `${process.env.PUBLIC_URL}/images/original_profile.png`;
        }
        setImageSrc(
          data.profile_picture ||
            `${process.env.PUBLIC_URL}/images/original_profile.png`
        );
        setNickname(data.nickname);
        setIntro(data.introduction || '제 꿈은 개발자입니다.');
        console.log("이미지", data.profile_picture);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    setPasswordValid(isValid(regex.password, password));
  }, [password, isValid, regex]);

  const handlePassword = (e) => {
    setUserPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/password/verify/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_password }),
        }
      );
      

      const data = await response.json();
      if (data.success) {
        handleDeleteAccount();
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setErrorMessage("비밀번호 검증 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="modi_field">
          <h1>내 정보</h1>
          <hr style={{ backgroundColor: "#ccc", height: "2px" }} />
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
                    style={{ display: "none" }}
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
            setUserPassword("");
            setErrorMessage("");
          }}
          className="delete_B"
        >
          회원탈퇴
        </button>
      </div>
      {isModalOpen && (
        <div className="modi_modal">
          <form onSubmit={handlePasswordSubmit} className="modi_check_P modi_modal-content">
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
              <input
                  type="password"
                  value={user_password}
                  onChange={handlePassword}
                  placeholder="비밀번호 입력"
                  className="mymodi_input"
                  required
                />
                {errorMessage && <p className="modi_error">{errorMessage}</p>}
            </div>
              <button type="submit" className="my_modi_modal_btn">확인</button>
            </form>
        </div>
      )}
    </div>
  );
};

export default Mymodify;
