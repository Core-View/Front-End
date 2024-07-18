import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TokenChecker from '../Common/TokenStore';

const AdminCheck = () => {
  const { accessToken } = TokenChecker();
  const navigate = useNavigate();
  //관리자 페이지 접속 관련
  const clickedAdmin = () => {
    axios
      .post(
        `http://localhost:3000/admin/login`,
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          alert('관리자페이지 접속 성공');
          navigate('/admin');
        }
      })
      .catch(() => {
        alert('접근권한 재확인 필요');
        navigate('/');
      });
  };

  useEffect(() => {
    clickedAdmin();
  }, []);

  return <div></div>;
};

export default AdminCheck;
