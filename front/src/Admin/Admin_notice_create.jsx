import React, { useEffect, useRef, useState } from 'react';
import './admin_notice_create.css';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

const AdminNoticeCreate = () => {
  const cookies = new Cookies();
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [title, setTitle] = useState('');

  const navigate = useNavigate();

  const handleRegisterButton = () => {
    if (editorInstanceRef.current && cookies.get('adminpw') === 'passed') {
      axios
        .post(`http://localhost:3000/notice/post`, {
          title: title,
          content: `${editorInstanceRef.current.getMarkdown()}`,
        })
        .then((Response) => {
          if (Response.data.success === true) {
            alert('등록성공!!');
            navigate('/admin');
          } else if (Response.data.success === false) {
            alert('실패했습니다! 다시 시도해주세요');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  };

  useEffect(() => {
    if (editorRef.current && cookies.get('adminpw') === 'passed') {
      editorInstanceRef.current = new Editor({
        el: editorRef.current,
        height: '600px',
        initialValue: '공지사항을 작성하세요.',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        language: 'ko-KR',
        hideModeSwitch: true,
        hooks: {
          async addImageBlobHook(blob, callback) {
            try {
              const formData = new FormData();
              formData.append('image', blob);

              // axios로 서버에 FormData 전송
              await axios
                .post('http://localhost:3000/notice/image', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })
                .then((response) => {
                  if (response.data.hi === 'hello') {
                    const filename = `/images/post_notice/${blob.name}`;
                    // 이미지 URL을 에디터에 렌더링
                    const imageUrl = `${filename}`;
                    callback(imageUrl, 'image alt attribute');
                  } else {
                    console.error('서버에서 파일명을 받지 못했습니다.');
                  }
                });
            } catch (error) {
              console.error('업로드 실패 : ', error);
            }
          },
        },
      });
    } else {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, []);

  return (
    <div className="notice_create_container">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title_input"
      />
      <div id="editor" ref={editorRef}></div>
      <button
        className="editor_button"
        onClick={(e) => {
          e.preventDefault();
          handleRegisterButton();
        }}
      >
        등록
      </button>
    </div>
  );
};

export default AdminNoticeCreate;
