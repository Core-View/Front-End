import React from 'react';
import TokenChecker from './TokenStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Intercepter = () => {
  const { accessToken, setToken } = TokenChecker();
  const navigate = useNavigate();
  const instance = axios.create({
    baseURL: '',
    timeout: 1000,
  });

  //요청 전에 토큰을 헤더에 담아서 보내는 로직
  instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = accessToken;
    return config;
  });

  //요청 후에 응답을 가로채서 (response), 추가적인 기능을 하는 로직
  instance.interceptors.response.use(
    (response) => {
      if (response.status === 404) {
        console.log('404');
      }

      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        axios
          .get('token/refresh', {
            headers: {
              Authorization: accessToken,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              //토큰 재설정
              setToken(response.data.Authorization);
              return response;
            } else if (response.status === 401) {
              alert('로그인 만료! 재로그인 하세요');
              return navigate('/users/sign-in');
            } else if (response.status === 400) {
              return response;
            }
          });
      }
    }
  );

  return <div></div>;
};

export default Intercepter;
