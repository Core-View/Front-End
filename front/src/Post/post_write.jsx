import React, { useState, useRef } from "react";
import axios from "axios";
import "./post_write.css";

const PostWrite = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [code, setCode] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [language, setLanguage] = useState(""); // 언어 상태 추가
    const contentRef = useRef(null);
    const codeRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            language, // 언어 추가
            content,
            code,
            userId: 123, // 임시 userId
        };

        try {
            const response = await axios.post("http://localhost:3000/api/compile", postData);

            if (response.status === 200) {
                alert("게시글이 성공적으로 등록되었습니다!");
                setTitle("");
                setContent("");
                setCode("");
                setHashtags("");
                setLanguage("");
                contentRef.current.style.height = "auto";
                codeRef.current.style.height = "auto";
            }
        } catch (error) {
            console.error("게시글 등록 중 오류 발생:", error);
            alert("게시글 등록 중 오류가 발생했습니다.");
        }
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        contentRef.current.style.height = "auto";
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        codeRef.current.style.height = "auto";
        codeRef.current.style.height = `${codeRef.current.scrollHeight}px`;
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
    };

    return (
        <div className="post-write-container">
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit} className="post-write-form">
                <div className="write-box">
                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="hashtags">해시태그 (콤마로 구분)</label>
                        <input
                            type="text"
                            id="hashtags"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                        />
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="content">내용</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={handleContentChange}
                            ref={contentRef}
                            required
                        ></textarea>
                    </div>
                </div>
                <div className="write-box">
                    <div className="form-group">
                        <label>언어 선택</label>
                        <div className="language-buttons">
                            <button
                                type="button"
                                className={language === "" ? "active" : ""}
                                onClick={() => handleLanguageChange("")}
                            >
                                기타
                            </button>
                            <button
                                type="button"
                                className={language === "c" ? "active" : ""}
                                onClick={() => handleLanguageChange("c")}
                            >
                                <img
                                    src="/images/language_icons/c_icon.png"
                                    alt=""
                                    className="write-language-icon"
                                /> C
                            </button>
                            <button
                                type="button"
                                className={language === "cpp" ? "active" : ""}
                                onClick={() => handleLanguageChange("cpp")}
                            >
                                <img
                                    src="/images/language_icons/cpp_icon.png"
                                    alt=""
                                    className="write-language-icon"
                                /> C++
                            </button>
                            <button
                                type="button"
                                className={language === "java" ? "active" : ""}
                                onClick={() => handleLanguageChange("java")}
                            >
                                <img
                                    src="/images/language_icons/java_icon.png"
                                    alt=""
                                    className="write-language-icon"
                                /> Java
                            </button>
                            <button
                                type="button"
                                className={language === "python" ? "active" : ""}
                                onClick={() => handleLanguageChange("python")}
                            >
                                <img
                                    src="/images/language_icons/python_icon.png"
                                    alt=""
                                    className="write-language-icon"
                                /> Python
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="code">코드</label>
                        <textarea
                            id="code"
                            value={code}
                            onChange={handleCodeChange}
                            ref={codeRef}
                        ></textarea>
                    </div>
                </div>
                    <button className="write-button" type="submit">게시글 등록</button>
            </form>
        </div>
    );
};

export default PostWrite;
