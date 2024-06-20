import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PiBellFill } from 'react-icons/pi';
import { GiBackwardTime } from 'react-icons/gi';
import './Alarm.css';
import { Cookies } from 'react-cookie';
import axios from 'axios';

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
    navigate(`/post_view/${post.post_id}`);
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
      if (event.data === 'finished') {
        es.current.close();
        return;
      }
      setAlarm(JSON.parse(event.data).alarm);

      serur(JSON.parse(event.data).count[0].alarm_unreaded);
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
                style={{
                  border:
                    a.alarm_check === 0
                      ? '3px solid limeGreen'
                      : '1px solid black',
                  boxShadow:
                    a.alarm_check === 0 ? '0 0 3px 1px limeGreen' : 'none',
                  opacity: a.alarm_check === 0 ? '1' : '0.6',
                }}
                onClick={() => moving(a)}
              >
                <div className="al_category">feedback</div>
                <div className="al_time">
                  <GiBackwardTime className="timer" />
                  <span>{timeAgo(a.time)}</span>
                </div>
                <div className="al_content">
                  <div
                    style={{
                      color: a.alarm_check === 0 ? 'black' : 'gray',
                    }}
                  >
                    {a.title}에 피드백 옴
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dropdown"></div>
        )}
      </div>
    </div>
  );
};

export default Alarm;
