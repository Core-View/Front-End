import React, { useEffect, useRef, useState } from "react";
import "./admin_notice_create.css";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdminNoticeUpdate = () => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    // 게시글 정보 가져오기
    axios
      .get(`http://localhost:3000/notice/view/${id}`)
      .then((response) => {
        console.log(response.data.notice);
        setTitle(response.data.notice[0].NOTICE_TITLE);
        setContent(response.data.notice[0].NOTICE_CONTENT);

        // Editor에 기존 내용 표시
        if (editorRef.current) {
          editorInstanceRef.current = new Editor({
            el: editorRef.current,
            height: "600px",
            initialValue: content,
            initialEditType: "wysiwyg",
            previewStyle: "vertical",
            language: "ko-KR",
            hideModeSwitch: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleModifyButton = () => {
    if (editorInstanceRef.current) {
      axios
        .patch(`http://localhost:3000/notice/post`, {
          notice_id: { id },
          notice_title: title,
          notice_content: `${editorInstanceRef.current.getMarkdown()}`,
        })
        .then((Response) => {
          if (Response.data.success === true) {
            alert("수정 성공!!");
            navigate("/admin");
          } else if (Response.data.success === false) {
            alert("수정 실패! 다시 시도해주세요");
          }
          console.log(Response);
        })
        .catch((error) => {
          console.log(error);
        });
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
