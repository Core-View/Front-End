import { create } from 'zustand';

const TokenChecker = create((set) => ({
  accessToken: null,
  admin: false,
  setToken: (accessToken) => set({ accessToken }),
  checkAdmin: (admin) => set({ admin }),
  delToken: () => set({ accessToken: null, admin: false }),
}));

export default TokenChecker;

//로그인 버튼을 눌러 axios 통신을 한다.
// 백엔드 측에서 JWT Access Token을 받아온다.
// Zustand set 함수를 이용하여 state에 Access Token을 보관한다.
// interceptor 다시 짜기
// zustand 에 선언한거 왜 다 사라지는지 확인하기
