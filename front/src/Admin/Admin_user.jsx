import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin_user.css";

const AdminUser = () => {
  const [users, setUsers] = useState([]);

  // 회원 데이터를 가져오는 함수 (예: API 호출)
  const getUserData = () => {
    axios.get("http://localhost:3000/notice/viewuser").then((response) => {
      if (response.data.success === true) {
        setUsers(response.data.user);
      }
    });
  };

  // 회원 삭제 함수
  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:3000/mypage/${userId}/delete`)
      .then((response) => {
        getUserData(); // 삭제 후 데이터 다시 가져오기
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="user_container">
      <table className="user_table">
        <thead>
          <tr>
            <th>회원번호</th>
            <th>회원이름</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>기여도(point)</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {users.map((a, i) => (
            <tr key={i}>
              <td>{a.USER_ID}</td>
              <td>{a.USER_NAME}</td>
              <td>{a.USER_NICKNAME}</td>
              <td>{a.USER_EMAIL}</td>
              <td>{a.USER_CONTRIBUTE}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    handleDelete(a.USER_ID);
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUser;
