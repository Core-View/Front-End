import React, { useEffect, useRef, useState } from 'react';
import { PiBellBold } from 'react-icons/pi';
import { PiBellFill } from 'react-icons/pi';
import { GiBackwardTime } from 'react-icons/gi';

import './Alarm.css';
const Alarm = () => {
  // 헤더가 처음 렌더링 될때 전체 알람을 받아옴 그리고 안읽은 알람을 카운트해서 띄워준다
  // 알람표시를 누르면 리스트가 나오는데 거기에는 알람내용과 일단은 피드백만 들어옴
  // 문제식별가능한 값과 문제의 제목 시간이 표시된다
  // 게시글 좋아요는 알람으로 들어오지 않고 피드백과 그 피드밷에대한 좋아요만 들어온다.
  // 필요한 데이터 알람 카테고리 제목 내용 시간 게시물번호
  const [isStarted, setIsStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [alarm, seAlarm] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const es = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // useEffect(() => {
  //   es.current = new EventSource('http://localhost:8080/sse/streaming/start');

  //   console.log({ es });

  //   es.current.onopen = (e) => {
  //     setIsStarted(true);
  //     console.log('[sse] open', { e });
  //   };

  //   es.current.onmessage = (event) => {
  //     console.log('[sse] message', { event });

  //     if (event.data === 'finished') {
  //       es.current.close();
  //       return;
  //     }
  //     setAlarm((prevAlarms) => [...prevAlarms, JSON.parse(event.data).alarm]);
  //   };

  //   es.current.onerror = (err) => {
  //     console.log('[sse] error', { err });
  //   };

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // const unsubscribe = async () => {
  //   if (es.current) {
  //     es.current.close();
  //     await fetch('http://localhost:8080/sse/streaming/stop');
  //   }
  // };

  // const timeAgo = (timestamp) => {
  //   const now = new Date();
  //   const alarmTime = new Date(timestamp);
  //   const diff = Math.abs(now - alarmTime);

  //   const minutes = Math.floor(diff / (1000 * 60));
  //   const hours = Math.floor(diff / (1000 * 60 * 60));
  //   const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  //   if (days > 0) {
  //     return `${days}일 전`;
  //   } else if (hours > 0) {
  //     return `${hours}시간 전`;
  //   } else if (minutes > 0) {
  //     return `${minutes}분 전`;
  //   } else {
  //     return '방금 전';
  //   }
  // };
  return (
    <div>
      {/* <div id="div_message">{message}</div> */}

      <div className="al_div">
        {0 !== 0 ? (
          <span className="al_num">3</span>
        ) : (
          <span className="al_num_have">3</span>
        )}

        <PiBellFill className="al" onClick={toggleDropdown} />
        {isDropdownOpen ? (
          <div className="dropdown">
            {alarm.map((a, index) => (
              <div key={index} className="dropdown-item">
                <div className="al_category">{a.category}</div>
                <div className="al_content">
                  <div>{a.title}</div>
                  <div>{a.content}</div>
                </div>
                <div className="al_time">
                  <GiBackwardTime className="timer" />
                  {/* <span>{timeAgo(a.time)}</span> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dropdown">
            <div className="dropdown-item">
              <div className="al_category">feedback</div>
              <div className="al_content">
                <div>백준알고리즘 33번...</div>
                <div>피드백 내용은 이...</div>
              </div>
              <div className="al_time">
                <GiBackwardTime className="timer" />
                <span>3분전</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* {isStarted && (
        <button margin="20px auto 0 auto" onClick={unsubscribe}>
          stop
        </button>
      )} */}
    </div>
  );
};

export default Alarm;