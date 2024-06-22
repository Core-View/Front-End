import React from 'react';
import { BiCommentDetail } from 'react-icons/bi';

const PostCode = ({ code, feedback, handleFeedbackClick, truncateText }) => {
  const codeArray = code ? code.trim().split('\n') : [];

  return (
    <pre className="post-code">
      {codeArray.map((line, index) => (
        <div key={index} className="post-code-line">
          <span className="non-drag">
            <span className="line-number">{index + 1} | </span>
          </span>
          <span>{line}</span>
          <span
            className={`feedback-button ${feedback[index] ? 'active' : ''}`}
            onClick={() => handleFeedbackClick(index, line)}
          >
            <BiCommentDetail />
            <span>{feedback[index] ? `(${feedback[index].length})` : ''}</span>
          </span>
          {feedback[index] && feedback[index].length > 0 && (
            <div className="feedback-text">
              <div className="non-drag">
                [최근 피드백]{' '}
                {truncateText(
                  feedback[index][feedback[index].length - 1].feedback_comment,
                  50
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </pre>
  );
};

export default PostCode;
