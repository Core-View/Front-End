import React, { useState } from 'react';
import './post_view.css'; // CSS 파일 import

const PostView = () => {
    // 서버에서 받아올 데이터는 일단 하드코딩된 변수로 저장
    const title = "헬로 월드가 안 나와요.";
    const likes = 42;
    const author = "홍길동";
    const content = `
안녕하세요.
Hello, World!
    `.trim().split('\n'); // 줄 단위로 쪼개기
    const code = `
#include <stdio.h>

int main() {
    printf("TEST인데, 이번 줄은 좀 기네요. ABCDEFG HIJKLMN OPQRSTU VWXYZ 1234567890 가나다라마바사아자차카타파하 안녕하세요. 헬로 월드가 안 나와서 질문 드립니다.\\n");
    printf("Hello, World!");

    return 0;
}
    `.trim(); // 줄 단위로 쪼개지 않음

    // 현재 로그인된 유저의 Id
    const loggedInUserId = "user123";

    const [feedback, setFeedback] = useState({});
    const [popup, setPopup] = useState({ show: false, line: null, text: '' });

    const handleFeedbackClick = (lineIndex) => {
        setPopup({ show: true, line: lineIndex, text: '' });
    };

    const handleFeedbackSubmit = async () => {
        if (popup.text.trim() === '') return;

        const newFeedback = feedback[popup.line] ? [...feedback[popup.line], { userId: loggedInUserId, text: popup.text }] : [{ userId: loggedInUserId, text: popup.text }];
        setFeedback({ ...feedback, [popup.line]: newFeedback });

        const feedbackData = {
            line: popup.line,
            userId: loggedInUserId,
            text: popup.text,
        };

        try {
            const response = await fetch('https://server-endpoint.com/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }

        setPopup({ ...popup, text: '' });
    };

    return (
        <div className="post-view">
            <h1 className="post-title">{title}</h1>
            <div className="post-meta">
                <span className="post-likes">좋아요 {likes}</span>
                <span className="post-author">{author}</span>
            </div>
            <div className="post-content">
                {content.map((line, index) => (
                    <div key={index} className="post-line">
                        <span>{line}</span>
                    </div>
                ))}
            </div>
            <pre className="post-code">
                {code.split('\n').map((line, index) => (
                    <div key={index} className="post-code-line">
                        <span className="non-drag">
                            <span className="line-number">{index} | </span>
                        </span>
                        <span>{line}</span>
                        <button className={`feedback-button ${feedback[index] ? 'active' : ''}`} onClick={() => handleFeedbackClick(index)}>
                            피드백 {feedback[index] ? `(${feedback[index].length})` : ''}
                        </button>
                        {feedback[index] && feedback[index].length > 0 && (
                            <div className="feedback-text">
                                <div className="non-drag">
                                    [최근 피드백] {feedback[index][feedback[index].length - 1].userId}: {feedback[index][feedback[index].length - 1].text}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </pre>
            {popup.show && (
                <div className="popup">
                    <div className="feedback-list">
                        {feedback[popup.line] && feedback[popup.line].map((fb, fbIndex) => (
                            <div key={fbIndex} className="feedback-text">{fb.userId}: {fb.text}</div>
                        ))}
                    </div>
                    <p></p>
                    <div className="popup-inner">
                        <textarea
                            rows="4"
                            placeholder="피드백을 남겨주세요."
                            value={popup.text}
                            onChange={(e) => setPopup({ ...popup, text: e.target.value })}
                            style={{ resize: 'none' }}
                        />
                        <div className="popup-buttons">
                            <button onClick={() => setPopup({ show: false, line: null, text: '' })}>취소</button>
                            <button onClick={handleFeedbackSubmit}>제출</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostView;
