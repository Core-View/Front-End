// src/services/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-backend-url.com/api', // 백엔드 URL을 입력하세요
});

// 회원탈퇴 API 호출
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('/signout'); // 백엔드에서 설정한 회원탈퇴 엔드포인트를 입력하세요
    return response.data;
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};

export default api;
