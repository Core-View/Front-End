import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './home_main.css';
import { Cookies } from 'react-cookie';
import useAuthStore from '../Sign/Store';

const HomeMain = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const cookies = new Cookies();

  const slides = [
    {
      src: process.env.PUBLIC_URL + '/images/home_image/home-card-1.png',
      link: '/contribution_ranking',
      message: '기여도 랭킹 확인하기',
    },
    {
      src: process.env.PUBLIC_URL + '/images/home_image/home-card-2.png',
      link: '/post_main',
      message: '전체 게시글 보러가기',
    },
  ];
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000); // 8초 간격으로 슬라이드
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  const goToLink = (link) => {
    navigate(link);
  };

  const imagesRef = useRef([]);
  imagesRef.current = [];

  const addToRefs = (el) => {
    if (el && !imagesRef.current.includes(el)) {
      imagesRef.current.push(el);
    }
  };

  useEffect(() => {
    if (cookies.get('user_id') !== undefined) {
      setLogin(cookies.get('user_id'), cookies.get('role'));
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    imagesRef.current.forEach((image) => {
      observer.observe(image);
    });

    return () => {
      if (imagesRef.current) {
        imagesRef.current.forEach((image) => {
          observer.unobserve(image);
        });
      }
    };
  }, []);

  return (
    <div className="home-container">
      <div className="slider">
        <div
          className="slides"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div className="slide" key={index}>
              <img src={slide.src} alt={`slide-${index + 1}`} />
              <button
                className="slide-button"
                onClick={() => goToLink(slide.link)}
              >
                {slide.message}
              </button>
            </div>
          ))}
        </div>
        <button className="prev-button" onClick={prevSlide}>
          ‹
        </button>
        <button className="next-button" onClick={nextSlide}>
          ›
        </button>
      </div>
      <div className="images-container">
        <img
          src={process.env.PUBLIC_URL + '/images/home_image/home-img-1.png'}
          alt="home-img-1"
          className="home-img"
          ref={addToRefs}
        />
        <img
          src={process.env.PUBLIC_URL + '/images/home_image/home-img-2.png'}
          alt="home-img-2"
          className="home-img"
          ref={addToRefs}
        />
      </div>
      <div className="end-card">
        <img
          src={process.env.PUBLIC_URL + '/images/home_image/home-end-card.png'}
          alt="home-end-card"
          ref={addToRefs}
        />
      </div>
    </div>
  );
};

export default HomeMain;
