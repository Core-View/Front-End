import React, { useEffect, useRef, useState } from 'react';
import './admin_notice_create.css';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AdminNoticeUpdate = () => {
  //에디터 생성 및 해당 게시글 정보 가져오기 관련
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { id } = useParams();

  const navigate = useNavigate();

  const getOriginData = () => {
    // 게시글 정보 가져오기
    axios
      .get(`http://localhost:3000/notice/view`)
      .then((response) => {
        setTitle(response.data.notice[0].NOTICE_TITLE);
        setContent(response.data.notice[0].NOTICE_CONTENT);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getOriginData();
  }, [id]);

  useEffect(() => {
    // Editor에 기존 내용 표시
    if (editorRef.current) {
      editorInstanceRef.current = new Editor({
        el: editorRef.current,
        height: '600px',
        initialValue: content,
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
    }
  }, [content]);

  const handleModifyButton = () => {
    if (editorInstanceRef.current) {
      axios
        .patch(`http://localhost:3000/notice/post`, {
          notice_id: id,
          notice_title: title,
          notice_content: `${editorInstanceRef.current.getMarkdown()}`,
        })
        .then((Response) => {
          if (Response.data.success === true) {
            alert('수정 성공!!');
            navigate('/admin');
          } else if (Response.data.success === false) {
            alert('수정 실패! 다시 시도해주세요');
          }
        })
        .catch((error) => {});
    }
  };

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
          handleModifyButton();
        }}
      >
        수정하기
      </button>
    </div>
  );
};

export default AdminNoticeUpdate;
