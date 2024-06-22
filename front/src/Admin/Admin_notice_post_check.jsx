import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { Cookies } from 'react-cookie';

const AdminNoticePostCheck = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const checkNoticePost = () => {
    if (cookies.get('adminpw') === 'passed') {
      navigate('/notice/post');
    } else {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  };

  useEffect(() => {
    checkNoticePost();
  }, []);

  return <div></div>;
};

export default AdminNoticePostCheck;
