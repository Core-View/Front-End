import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TokenChecker from '../Common/TokenStore';

const AdminCheck = () => {
  const { accessToken, setToken, delToken } = TokenChecker();
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
        alert(response.data.message);
        navigate('/admin');
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          console.log('만료가 되었답니다!');
          axios
            .get('http://localhost:3000/token/refresh', {
              headers: {
                Authorization: accessToken,
              },
            })
            .then(
              axios.interceptors.response.use((response) => {
                console.log(response);
                setToken(response.data.Authorization);
                return navigate('/');
              })
            )
            .catch((err) => {
              if (err.response.status === 400) {
                return navigate('/admin');
              } else if (err.response.status === 401) {
                alert('권한이 없습니다.');
                delToken();
                return navigate('/users/sign-in');
              }
            });
        }
      });
  };

  clickedAdmin();
};

export default AdminCheck;
