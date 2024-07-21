import React from 'react';
import './Error.css';
import { useNavigate } from 'react-router-dom';
const Error = () => {
  const navigate = useNavigate();
  return (
    <div id="error_container">
      <div>해당페이지는 찾을수 없는 페이지입니다</div>
      <div onClick={() => navigate(-1)}>이전 페이지로 가기</div>
    </div>
  );
};

export default Error;
