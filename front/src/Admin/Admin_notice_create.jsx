import React, { useEffect, useRef } from "react";
import "./admin_notice_create.css";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style

const AdminNoticeCreate = () => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  const handleRegisterButton = () => {
    if (editorInstanceRef.current) {
      // 입력창에 입력한 내용을 HTML 태그 형태로 취득
      console.log(editorInstanceRef.current.getHTML());
      // 입력창에 입력한 내용을 MarkDown 형태로 취득
      console.log(editorInstanceRef.current.getMarkdown());
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
        hooks: {
          addImageBlobHook(blob, callback) {
            // 이미지 업로드 로직 커스텀
            console.log(blob);
            console.log(callback);
          },
        },
      });
    }
  }, []);

  return (
    <div className="notice_create_container">
      <div id="editor" ref={editorRef}></div>
      <button onClick={handleRegisterButton}>등록</button>
    </div>
  );
};

export default AdminNoticeCreate;
