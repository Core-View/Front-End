import React from 'react';

const PostContent = ({ content }) => {
  const contentArray = content ? content.trim().split('\n') : [];

  return (
    <div className="post-content">
      {contentArray.map((line, index) => (
        <div key={index} className="post-line">
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
};

export default PostContent;
