import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
const AdminCheck = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  //관리자 페이지 접속 관련
  const clickedAdmin = () => {
    console.log(
      '관리자페이지 눌렀을때 바로 실행되는 콘솔, 그러니까 admin/login 으로 요청 보내기 전 콘솔',
      cookies.get('accessToken'),
      cookies.get('admin')
    );
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
        console.log(
          ' 관리자 로그인 요청 보내고 나서 response 받았을때!',
          response
        );
        alert(response.data.message);
        console.log('관리자 페이지 갑니다');
        navigate('/admin');
      })
      .catch((err) => {
        console.log('관리자 페이지 접근 요청 할때 catch된 에러', err.messsage);
        if (err.response.status === 401) {
          console.log(
            '401 에러 가 떴을때! 만료가 되었답니다! 그리고 refresh 토큰 받는 요청 get으로 보냄'
          );
          axios
            .get('http://localhost:3000/token/refresh', {
              headers: {
                Authorization: cookies.get('accessToken'),
              },
            })
            .then((response) => {
              if (response.status === 200) {
                console.log(
                  '리프래시 토큰으로 요청 보냈을때 받은 응답',
                  response
                );
                cookies.set('accessToken', response.data.Authorization);
                console.log('토큰 설정해주기', cookies.get('accessToken'));
                console.log('잘 됬으니까 다시 관리자 페이지로 넘어가기');
                return navigate('/admin');
              } else if (response.status === 400) {
                console.log('그 밖의 오류났을때, 일단 400일때 그냥 통과하기');
                return navigate(-1);
              }
            })
            .catch((err) => {
              if (err.response.status === 401) {
                console.log(
                  '리프래시에서 401이 떴을때, 권한 다 지우고 로그인 화면으로 보내기'
                );
                alert('권한이 없습니다.');
                cookies.remove('accessToken');
                cookies.remove('admin');
                console.log(
                  '권한 다 지웠습니다',
                  cookies.get('accessToken'),
                  cookies.get('admin')
                );
                return navigate('/users/sign-in');
              }
            });
        }
      });
  };

  clickedAdmin();
};

export default AdminCheck;
