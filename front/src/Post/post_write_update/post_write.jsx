import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './post_write.css';
import { Cookies } from 'react-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

const PostWrite = () => {
  const cookies = new Cookies();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [codeError, setCodeError] = useState('');
  const contentRef = useRef(null);
  const codeRef = useRef(null);

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const TITLE_MAX_LENGTH = 30;
  const CONTENT_MAX_LENGTH = 3000;
  const CODE_MAX_LENGTH = 65535; // LONGTEXT

  // 로그인을 하지 않았을 경우, 로그인 페이지로 이동합니다.
  useEffect(() => {
    const userId = cookies.get('user_id');
    if (userId) {
      setIsLoggedIn(true);
    } else {
      navigate('/users/sign-in');
    }
    setIsLoading(false);
  }, [navigate]);

  // 내용 작성 중 뒤로가기를 눌렀을 때, 경고 메시지를 표시합니다.
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (title || content || code) {
        event.preventDefault();
        event.returnValue = ''; // Chrome에서는 설정이 필요합니다.
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [title, content, code]);

  // 게시글 전송(게시) 버튼을 눌렀을 경우 핸들입니다.
  const handleSubmit = async (e) => {
    const cookies = new Cookies();
    const loggedInUserId = cookies.get('user_id'); // 로그인된 사용자 ID 가져오기
    e.preventDefault();

    if (title.length > TITLE_MAX_LENGTH) {
      setTitleError(`제목은 ${TITLE_MAX_LENGTH}자 이하로 작성해야 합니다.`);
      return;
    }

    if (content.length > CONTENT_MAX_LENGTH) {
      setContentError(`내용은 ${CONTENT_MAX_LENGTH}자 이하로 작성해야 합니다.`);
      return;
    }

    if (code.length > CODE_MAX_LENGTH) {
      setCodeError(`코드는 ${CODE_MAX_LENGTH}자 이하로 작성해야 합니다.`);
      return;
    }

    if (!isLoggedIn) {
      return <Navigate to="/users/sign-in" replace />;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    const postData = {
      title: title,
      language: language,
      code: code,
      content: content,
      user_id: loggedInUserId,
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/api/compile',
        postData
      );

      if (response.status === 200) {
        alert('게시글이 성공적으로 등록되었습니다!');
        setTitle('');
        setContent('');
        setCode('');
        setLanguage('');
        contentRef.current.style.height = 'auto';
        codeRef.current.style.height = 'auto';
        navigate(`/post_view/${response.data.postId}`);
      }
    } catch (error) {
      console.error('게시글 등록 중 오류 발생:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  // 작성 내용이 변경된 경우
  const handleContentChange = (e) => {
    setContent(e.target.value);
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  };

  // 작성 코드가 변경된 경우
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    codeRef.current.style.height = 'auto';
    codeRef.current.style.height = `${codeRef.current.scrollHeight}px`;
  };

  // 언어가 변경된 경우
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  // 작성 제목이 변경된 경우
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length <= TITLE_MAX_LENGTH) {
      setTitleError('');
    }
  };

  return (
    <div className="post-write-container">
      <form onSubmit={handleSubmit} className="post-write-form">
        <div className="form-group">
          <div className="form-group-title">
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="제목을 입력하세요."
              required
            />
            {titleError && <p className="error-message">{titleError}</p>}
            <p className="char-counter">
              {title.length} / {TITLE_MAX_LENGTH}
            </p>
          </div>
        </div>
        <div className="form-group">
          <div className="form-group-content">
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              ref={contentRef}
              placeholder="내용을 입력하세요."
              required
            ></textarea>
            {contentError && <p className="error-message">{contentError}</p>}
            <p className="char-counter">
              {content.length} / {CONTENT_MAX_LENGTH}
            </p>
          </div>
        </div>
        <div className="language-buttons">
          <button
            type="button"
            className={language === 'other' ? 'active' : ''}
            onClick={() => handleLanguageChange('other')}
          >
            기타
          </button>
          <button
            type="button"
            className={language === 'c' ? 'active' : ''}
            onClick={() => handleLanguageChange('c')}
          >
            <img
              src="/images/language_icons/c_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            C
          </button>
          <button
            type="button"
            className={language === 'cpp' ? 'active' : ''}
            onClick={() => handleLanguageChange('cpp')}
          >
            <img
              src="/images/language_icons/cpp_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            C++
          </button>
          <button
            type="button"
            className={language === 'java' ? 'active' : ''}
            onClick={() => handleLanguageChange('java')}
          >
            <img
              src="/images/language_icons/java_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            Java
          </button>
          <button
            type="button"
            className={language === 'python' ? 'active' : ''}
            onClick={() => handleLanguageChange('python')}
          >
            <img
              src="/images/language_icons/python_icon.png"
              alt=""
              className="write-language-icon"
            />{' '}
            Python
          </button>
        </div>
        <div className="form-group">
          <div className="form-group-code">
            <textarea
              id="code"
              value={code}
              onChange={handleCodeChange}
              ref={codeRef}
              placeholder="코드를 입력하세요."
            ></textarea>
            {codeError && <p className="error-message">{codeError}</p>}
            <p className="char-counter">
              {code.length} / {CODE_MAX_LENGTH}
            </p>
          </div>
        </div>
        <button className="write-button" type="submit">
          게시글 등록
        </button>
      </form>
    </div>
  );
};

export default PostWrite;
