import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import TokenChecker from '../Common/TokenStore';

const AdminNoticePostCheck = () => {
  const { admin } = TokenChecker();
  const navigate = useNavigate();
  const checkNoticePost = () => {
    if (admin) {
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
