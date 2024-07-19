import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { Cookies } from 'react-cookie';

const AdminCheck = () => {
  const cookies = new Cookies();
  const [userId, setUserId] = useState(cookies.get('user_id'));
  const [role, setRole] = useState(cookies.get('role'));
  const navigate = useNavigate();
  //관리자 페이지 접속 관련
  const clickedAdmin = () => {
    let inputPassword = prompt('비밀번호를 입력하세요.', '');
    if (inputPassword) {
      axios
        .post(`http://localhost:3000/admin/login/${userId}`, {
          user_id: userId,
          role: role,
          admin_password: inputPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            alert('관리자페이지 접속 성공');
            cookies.set('adminpw', 'passed');
            navigate('/admin');
          }
        })
        .catch(() => {
          cookies.remove('adminpw');
          alert('(비밀번호를 확인하세요).');
          navigate('/');
        });
    } else {
      cookies.remove('adminpw');
      navigate('/');
    }
  };

  useEffect(() => {
    clickedAdmin();
  }, []);

  return <div></div>;
};

export default AdminCheck;
