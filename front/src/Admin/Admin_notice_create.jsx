import React, { useEffect, useRef, useState } from "react";
import "./admin_notice_create.css";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminNoticeCreate = () => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [title, setTitle] = useState("");

  const navigate = useNavigate();

  const handleRegisterButton = () => {
    if (editorInstanceRef.current) {
      axios
        .post(`http://localhost:3000/notice/post`, {
          title: title,
          content: `${editorInstanceRef.current.getMarkdown()}`,
        })
        .then((Response) => {
          if (Response.data.success === true) {
            alert("등록성공!!");
            navigate("/admin");
          } else if (Response.data.success === false) {
            alert("실패했습니다! 다시 시도해주세요");
          }
          console.log(Response);
        })
        .catch((error) => {
          console.log(error);
        });
      // 입력창에 입력한 내용을 HTML 태그 형태로 취득
      console.log(editorInstanceRef.current.getHTML());
      // 입력창에 입력한 내용을 MarkDown 형태로 취득
      console.log(editorInstanceRef.current.getMarkdown());
      console.log(typeof editorInstanceRef.current.getMarkdown());
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorInstanceRef.current = new Editor({
        el: editorRef.current,
        height: "600px",
        initialValue: "공지사항을 작성하세요.",
        initialEditType: "wysiwyg",
        previewStyle: "vertical",
        language: "ko-KR",
        hideModeSwitch: true,
      });
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
