import React, { useEffect, useRef, useState } from 'react';
import { PiBellFill } from 'react-icons/pi';
import { GiBackwardTime } from 'react-icons/gi';
import './Alarm.css';
import { Cookies } from 'react-cookie';
import userIdInfo from '../Sign/UserStore';

const Alarm = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [alarm, setAlarm] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const es = useRef(null);
  const cookies = new Cookies();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    es.current = new EventSource('http://localhost:3000/sse/streaming/start');

    console.log({ es });

    es.current.onopen = (e) => {
      setIsStarted(true);
      console.log('[sse] open', { e });
    };

    es.current.onmessage = (event) => {
      console.log('[sse] message', { event });
      if (event.data === 'finished') {
        es.current.close();
        return;
      }
      console.log('------------------------------' + event.data);
      setAlarm(JSON.parse(event.data));
    };

    es.current.onerror = (err) => {
      console.log('[sse] error', { err });
    };

    return () => {
      unsubscribe();
    };
  }, []);

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
  const { user_id } = userIdInfo();
  console.log(user_id);
  return (
    <div>
      <div className="al_div">
        {cookies.get('user_id') === undefined ? (
          <span className="al_num">0</span>
        ) : (
          <span className="al_num_have">{alarm.length}</span>
        )}

        <PiBellFill className="al" onClick={toggleDropdown} />
        {console.log(alarm)}
        {isDropdownOpen ? (
          <div className="dropdown">
            {alarm.map((a, index) => (
              <div key={index} className="dropdown-item">
                {console.log(a)}
                <div className="al_category">feedback</div>
                <div className="al_content">
                  <div>{a.title}</div>
                  <div>달렸습니다</div>
                </div>
                <div className="al_time">
                  <GiBackwardTime className="timer" />
                  <span>{timeAgo(a.time)}</span>
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
