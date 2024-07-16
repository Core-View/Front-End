import { create } from 'zustand';

const TokenChecker = create((set) => ({
  accessToken: null,
  refreshToken: null,
  setToken: (accessToken, refreshToken) =>
    set({ accessToken: 'sdfwdf', refreshToken: 'aasdfdw' }),
  delToken: (accessToken, refreshToken) =>
    set({ accessToken: null, refreshToken: null }),
}));

export default TokenChecker;

//로그인 버튼을 눌러 axios 통신을 한다.
// 백엔드 측에서 JWT Access Token을 받아온다.
// Zustand set 함수를 이용하여 state에 Access Token을 보관한다.
// Access Token을 localStorage에 보관하여 로그인 상태를 유지한다
