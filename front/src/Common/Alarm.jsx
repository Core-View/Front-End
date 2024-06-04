import React, { useEffect, useRef, useState } from 'react';

const Alarm = () => {
  // 헤더가 처음 렌더링 될때 전체 알람을 받아옴 그리고 안읽은 알람을 카운트해서 띄워준다
  // 알람표시를 누르면 리스트가 나오는데 거기에는 알람내용과 일단은 피드백만 들어옴
  // 문제식별가능한 값과 문제의 제목 시간이 표시된다
  // 게시글 좋아요는 알람으로 들어오지 않고 피드백과 그 피드밷에대한 좋아요만 들어온다.
  const [isStarted, setIsStarted] = useState(false);
  const [message, setMessage] = useState('');

  const es = useRef(null);

  useEffect(() => {
    es.current = new EventSource('http://localhost:8080/sse/streaming/start');

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
      setMessage(event.data);
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
      await fetch('http://localhost:8080/sse/streaming/stop');
    }
  };
  return (
    <div>
      <div id="div_message">{message}</div>
      {isStarted && (
        <button margin="20px auto 0 auto" onClick={unsubscribe}>
          stop
        </button>
      )}
    </div>
  );
};

export default Alarm;
