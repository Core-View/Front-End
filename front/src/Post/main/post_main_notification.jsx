import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import './post_main_notification.css';
import './post_main_pagination.css';

const PostMainNotification = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [noticesPerPage, setNoticesPerPage] = useState(10); // 페이지당 공지사항 수

  // 서버에서 공지 데이터를 가져옵니다.
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/notice/view');
        setNotices(response.data.notice.reverse());
        setLoading(false);
      } catch (err) {
        setError('공지를 가져오는 데 실패했습니다.');
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // 공지 클릭 시 핸들입니다.
  const handleNoticeClick = (id) => {
    console.log(id);
    navigate(`/notice/view/${id}`);
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const differenceInDays = (now - date) / (1000 * 60 * 60 * 24);

    if (differenceInDays < 1) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // const handlePostClick = (notice) => {
  //   navigate(`/post_view/${notice.NOTICE_ID}`);
  // };

  const offset = currentPage * noticesPerPage;
  const currentPageData = notices.slice(offset, offset + noticesPerPage);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="notification-container">
      <h2>전체 공지사항</h2>
      <ul className="notice-list">
        {/* <h4 className="post-main-meta">
          <div className="post-main-title">제목</div>
          <div className="post-main-date">작성날짜</div>
        </h4> */}
        {currentPageData.length > 0 ? (
          currentPageData.map((notice, index) => (
            <li key={index} onClick={() => handleNoticeClick(notice.NOTICE_ID)}>
              <div className="post-main-meta">
                <div className="post-main-title">
                  <img
                    src="/icons/notice_icon.png"
                    alt=""
                    className="post-main-language-icon"
                  />{' '}
                  {notice.NOTICE_TITLE}
                </div>
                <div className="post-main-date">
                  {formatDate(notice.NOTICE_DATE)}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>게시글이 없습니다.</li>
        )}
      </ul>
      <section className="post-bot">
        <ReactPaginate
          previousLabel={'이전'}
          nextLabel={'다음'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(notices.length / noticesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </section>
    </div>
  );
};

export default PostMainNotification;
