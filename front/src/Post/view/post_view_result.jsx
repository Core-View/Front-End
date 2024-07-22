import React from 'react';

const PostResult = ({ result }) => {
  return (
    <div className="post-result">
      <h4>코드 실행 결과</h4>
      <br />
      <pre>{result}</pre>
    </div>
  );
};

export default PostResult;
