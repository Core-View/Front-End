import React, { useState, useRef } from "react";
import axios from "axios";
import "./post_write.css";

const PostWrite = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [hashtags, setHashtags] = useState("");
    const contentRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            hashtags: hashtags.split(",").map((tag) => tag.trim()),
        };

        try {
            const response = await axios.post("YOUR_SERVER_ENDPOINT/posts", postData);

            if (response.status === 200) {
                alert("게시글이 성공적으로 등록되었습니다!");
                setTitle("");
                setContent("");
                setHashtags("");
                contentRef.current.style.height = "auto";
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

    return (
        <div className="post-write-container">
        <h2>게시글 작성</h2>
        <form onSubmit={handleSubmit} className="post-write-form">
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
            <div className="form-group">
            <label htmlFor="hashtags">해시태그 (콤마로 구분)</label>
            <input
                type="text"
                id="hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
            />
            </div>
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
            <button type="submit">게시글 등록</button>
        </form>
        </div>
    );
};

export default PostWrite;
