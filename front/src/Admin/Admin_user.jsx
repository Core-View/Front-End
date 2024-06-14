import React from "react";
import "./admin_user.css";

const AdminUser = ({ userdata, onDelete }) => {
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
          {userdata.map((user, index) => (
            <tr key={index}>
              <td>{user.USER_ID}</td>
              <td>{user.USER_NAME}</td>
              <td>{user.USER_NICKNAME}</td>
              <td>{user.USER_EMAIL}</td>
              <td>{user.USER_CONTRIBUTE}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(user.USER_ID)}
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
