import React, { useState, useEffect } from 'react';
import './admin_main.css';
import { LuCrown } from 'react-icons/lu';
import AdNotice from './Admin_notice';
import AdPost from './Admin_post';
import AdUsers from './Admin_user';
import axios from 'axios';
//

const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState('어떤관리');
  const [member, setMember] = useState([]);
  const [clicked, setClicked] = useState([false, false, false]);

  const getMember = () => {
    axios.get('http://localhost:3000/notice/viewuser').then((response) => {
      if (response.data.success === true) {
        setMember(response.data.user);
      }
    });
  };

  const handleDelete = (userId) => {
    if (window.confirm('삭제하시겠습니까?')) {
      axios
        .delete(`http://localhost:3000/mypage/${userId}/delete`)
        .then((response) => {
          if (response.data.success) {
            getMember(); // 회원 삭제 후 목록을 새로 불러옴
          }
        });
    } else {
      alert('취소하였습니다.');
    }
  };

  const renderMenuContent = () => {
    switch (selectedMenu) {
      case '회원관리':
        return <AdUsers userdata={member} onDelete={handleDelete} />;
      case '공지사항':
        return <AdNotice />;
      case '게시판관리':
        return <AdPost />;
      default:
        return <div>메뉴를 선택해 주세요.</div>;
    }
  };

  const maxContribute = Math.max(...member.map((m) => m.USER_CONTRIBUTE));

  useEffect(() => {
    getMember();
  }, []);

  return (
    <div className="admin-container">
      <div className="member-section">
        <h3 className="admin_title">멤버 기여도 현황</h3>
        <div className="member_detail">
          <div className="member_info">멤버</div>
          <div className="member_tier">등급</div>
          <div className="member_point">기여도</div>
        </div>
        <ul className="memberList">
          {member.map((a, i) => (
            <li className="listMember" key={i}>
              <span className="nickname">{a.USER_NICKNAME}</span>
              <LuCrown
                className="tier"
                style={{
                  marginTop: '5px',
                  width: '40px',
                }}
              />
              <div className="contribute-container">
                <span className="contribute-value">{a.USER_CONTRIBUTE}</span>
                <div
                  className="gauge"
                  style={{
                    width: `${(a.USER_CONTRIBUTE / maxContribute) * 100}%`,
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-menu-section">
        <h3 className="admin_title">CoReview 관리자 메뉴</h3>
        <ul className="admin_menu_list">
          <li
            className={`menu1 menuer ${clicked[0] ? 'nowshow' : ''}`}
            onClick={() => {
              setSelectedMenu('회원관리');
              setClicked([true, false, false]);
            }}
          >
            회원관리
          </li>
          <li
            className={`menu2 menuer ${clicked[1] ? 'nowshow' : ''}`}
            onClick={() => {
              setSelectedMenu('공지사항');
              setClicked([false, true, false]);
            }}
          >
            공지사항
          </li>
          <li
            className={`menu3 menuer ${clicked[2] ? 'nowshow' : ''}`}
            onClick={() => {
              setSelectedMenu('게시판관리');
              setClicked([false, false, true]);
            }}
          >
            게시판관리
          </li>
        </ul>
        <div className="show_admin_menu">{renderMenuContent()}</div>
      </div>
    </div>
  );
};

export default Admin;
