import React, { useState } from 'react';
import './my_modify.css';
import { deleteUserAccount } from '../My_Services/delete_ID';
//회원 탈퇴 api

const Mymodify = () => {
  const [imageSrc, setImageSrc] = useState('/images/original_profile.png');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(''); // 닉네임 에러 메시지 상태 추가
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [intro, setIntro] = useState('');
  const [introError, setIntroError] = useState('');
  // 미리 정의된 사용 중인 닉네임 리스트
  const usedNicknames = ['user123', 'reactmaster', 'devgenius'];
  
  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result);
        resolve();
      };
    });
  };
  const handlePasswordChange = (e) => {
    const newPw = e.target.value;
    setPassword(newPw);
    validatePasswords(newPw, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPw = e.target.value;
    setConfirmPassword(newConfirmPw);
    validatePasswords(password, newConfirmPw);
  };

  const validatePasswords = (pw, confirmPw) => {
    if (pw && confirmPw && pw !== confirmPw) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('');
    }
  };

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    if (newNickname.length > 10) {
      setNicknameError('닉네임은 10자 이하로 입력해주세요.');
    } else {
      setNicknameError('');
    }
  };

  const handleIntroChange = (e) => {
    const value = e.target.value;
    setIntro(value);
    if (value.length > 30) {
      setIntroError('자기소개는 30자를 초과할 수 없습니다.');
    } else {
      setIntroError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 이벤트 차단

    // 닉네임 중복 검사
    if (usedNicknames.includes(nickname)) {
      alert('이 닉네임은 이미 사용 중입니다. 다른 닉네임을 입력해주세요.');
      return;
    }

    // 폼 제출 로직
    console.log('폼이 제출됩니다:', { nickname });
    // 여기서 서버로 폼 데이터를 전송할 API 호출이 이루어질 수 있습니다.
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      alert('회원탈퇴가 완료되었습니다.');
      // 로그아웃 처리 등 추가 작업을 여기에 작성할 수 있습니다.
    } catch (error) {
      alert('회원탈퇴 중 오류가 발생했습니다. 관리자에게 문의하세요');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className='modi_field'>
        <h1>내 정보</h1>
        <hr style={{ color: 'black', backgroundColor: 'black', height: '1px' }}/>
        <div className='photo'>
          <label className='profile_L'>프로필 사진</label>
          <div className='profile_D'>
            {imageSrc && <img src={imageSrc} alt="preview-img" className='prefile'/>}
            <hr></hr>
            <label for="file-upload" className="file-upload-btn">
              사진 변경
            </label>
            <input id="file-upload" type="file" name="my_profile" accept='image/*' onChange={(e) => {
                encodeFileToBase64(e.target.files[0]);
            }} style={{display:'none'}}/>
          </div>
        </div>
        <div className='nick_zone'>
          <label className='nick_L'>닉네임</label>
          <div className='nick_D'>
            <input type="text" name="nickname" value={nickname} onChange={handleNicknameChange}
            className='nick_I'></input>
            {nicknameError && <div className='nickname_error'>{nicknameError}</div>}
          </div>
        </div>
        <div className='password_zone'>
          <label className='password_L'>비밀번호</label>
          <div className='password_D'>
            <input type="password" name="pw" value={password} onChange={handlePasswordChange} className='password_I'></input>
          </div>
        </div>
        <div className='pcheck_zone'>
          <label className='pcheck_L'>비밀번호 확인</label>
          <div className='pcheck_D'>
            <input type="password" name="pw_check" value={confirmPassword} onChange={handleConfirmPasswordChange} className='pcheck_I'></input>
            {passwordError && <div className='password_error'>{passwordError}</div>}
          </div>
        </div>
        <div className='introduce_zone'>
          <label className='intro_L'>자기소개</label>
          <div className='intro_D'>
          <input type="text" name="my_introduce" maxLength='30' value={intro} onChange={handleIntroChange} className='intro_I'></input>
            {introError && <div className='intro_error'>{introError}</div>}  
          </div>
        </div>
        <div className='button_zone'>
          <div className='submit_D'>
            <input type="submit" value="수정하기"
            className='submit_B'></input>
          </div>
          <div className='delete_D'>
            <button type="button" onClick={handleDeleteAccount}>회원탈퇴</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Mymodify;
