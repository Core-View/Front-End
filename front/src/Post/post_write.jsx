import React, { useState, useRef } from 'react';
import axios from 'axios';
import './post_write.css';
import { Cookies } from 'react-cookie';

const PostWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [codeError, setCodeError] = useState('');
  const contentRef = useRef(null);
  const codeRef = useRef(null);

  const TITLE_MAX_LENGTH = 30;
  const CONTENT_MAX_LENGTH = 1000;
  const CODE_MAX_LENGTH = 65535; // LONGTEXT

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
      }
    } catch (error) {
      console.error('게시글 등록 중 오류 발생:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    codeRef.current.style.height = 'auto';
    codeRef.current.style.height = `${codeRef.current.scrollHeight}px`;
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length <= TITLE_MAX_LENGTH) {
      setTitleError('');
    }
  };

  const handleContentInputChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.length <= CONTENT_MAX_LENGTH) {
      setContentError('');
    }
  };

  const handleCodeInputChange = (e) => {
    setCode(e.target.value);
    if (e.target.value.length <= CODE_MAX_LENGTH) {
      setCodeError('');
    }
  };

  return (
    <div className="post-write-container">
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit} className="post-write-form">
        <div className="write-box">
          <div className="form-group">
            <label htmlFor="title">제목 (최대 {TITLE_MAX_LENGTH}자)</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
            {titleError && <p className="error-message">{titleError}</p>}
            <p className="char-counter">
              {title.length} / {TITLE_MAX_LENGTH}
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="content">내용 (최대 {CONTENT_MAX_LENGTH}자)</label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              ref={contentRef}
              required
            ></textarea>
            {contentError && <p className="error-message">{contentError}</p>}
            <p className="char-counter">
              {content.length} / {CONTENT_MAX_LENGTH}
            </p>
          </div>
        </div>
        <div className="write-box">
          <div className="form-group">
            <label>언어 선택</label>
            <div className="language-buttons">
              <button
                type="button"
                className={language === '' ? 'active' : ''}
                onClick={() => handleLanguageChange('')}
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
          </div>
          <div className="form-group">
            <label htmlFor="code">코드 (최대 {CODE_MAX_LENGTH}자)</label>
            <textarea
              id="code"
              value={code}
              onChange={handleCodeChange}
              ref={codeRef}
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
