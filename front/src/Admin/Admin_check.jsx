import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
const AdminCheck = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  //관리자 페이지 접속 관련
  const clickedAdmin = () => {
    axios
      .post(
        `http://localhost:3000/admin/login`,
        {},
        {
          headers: {
            Authorization: cookies.get('accessToken'),
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
        navigate('/admin');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          axios
            .get('http://localhost:3000/token/refresh', {
              headers: {
                Authorization: cookies.get('accessToken'),
              },
            })
            .then((response) => {
              if (response.status === 200) {
                cookies.set('accessToken', response.data.Authorization);
                return navigate('/admin');
              } else if (response.status === 400) {
                return navigate(-1);
              }
            })
            .catch((err) => {
              if (err.response.status === 401) {
                alert('권한이 없습니다.');
                cookies.remove('accessToken');
                cookies.remove('admin');
                return navigate('/users/sign-in');
              }
            });
        }
      });
  };

  clickedAdmin();
};

export default AdminCheck;
