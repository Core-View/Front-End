import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PiBellFill } from 'react-icons/pi';
import { GiBackwardTime } from 'react-icons/gi';
import './Alarm.css';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { BiCommentDetail } from 'react-icons/bi';

const Alarm = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [ur, serur] = useState([]);
  const [alarm, setAlarm] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const es = useRef(null);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isDropdownOpen) {
      axios.post('http://localhost:3000/sse/streaming/alarmcheck', {
        user_id: cookies.get('user_id'),
      });
      alarm.forEach((val, idx) => {
        if (alarm[idx].alarm_check !== 1) {
          alarm[idx].alarm_check = 1;
        } else {
          return;
        }
      });
      serur(0);
    }
  };
  const moving = (post) => {
    console.log(post);
    navigate(`/post_view/${post}`);
  };
  useEffect(() => {
    es.current = new EventSource(
      `http://localhost:3000/sse/streaming/start/${cookies.get('user_id')}`,
      {
        headers: {
          Connetction: 'keep-alive',
          Accept: 'text/event-stream',
        },
        heartbeatTimeout: 86400000,
      }
    );

    console.log({ es });

    es.current.onopen = (e) => {
      setIsStarted(true);
    };

    es.current.onmessage = (event) => {
      if (es.current !== null) {
        if (event.data === 'finished') {
          es.current.close();
          return;
        }
        setAlarm(JSON.parse(event.data).alarm);

        serur(JSON.parse(event.data).count[0].alarm_unreaded);
      }
    };

    es.current.onerror = (err) => {
      console.log('[sse] error', { err });
    };

    return () => {
      unsubscribe();
    };
  }, [isDropdownOpen]);

  const unsubscribe = async () => {
    if (es.current) {
      es.current.close();
      await fetch('http://localhost:3000/sse/streaming/stop');
    }
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const alarmTime = new Date(timestamp);
    const diff = Math.abs(now - alarmTime);

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else {
      return '방금 전';
    }
  };
  return (
    <div>
      <div className="al_div">
        {cookies.get('user_id') === undefined ? (
          <span className="al_num"> 0</span>
        ) : (
          <span className="al_num_have">{ur}</span>
        )}

        <PiBellFill className="al" onClick={toggleDropdown} />
        {isDropdownOpen ? (
          <div className="dropdown">
            {alarm.map((a, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => moving(a.post_id)}
                style={{ opacity: a.alarm_check === 0 ? '1' : '0.6' }}
              >
                <div className="al_time">
                  <BiCommentDetail
                    style={{
                      color: a.alarm_check === 0 ? 'rgb(76, 207, 71)' : 'none',
                    }}
                    className="feedback_logo"
                  />
                  <span className="howlong">{timeAgo(a.time)}</span>
                </div>
                <div className="al_content">
                  <div
                    style={{
                      color: a.alarm_check === 0 ? 'black' : 'gray',
                    }}
                  >
                    <span className="feedback_content_al">
                      {a.title.slice(0, 9)}
                    </span>
                    에 <span className="feedback_content_al">피드백</span>이
                    달렸습니다.
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Alarm;
