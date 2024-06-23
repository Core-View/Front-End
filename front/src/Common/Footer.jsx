import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer_company">
          <p>Dong-A University</p>
        </div>
        <div className="footer_front">
          <h4>Front-End</h4>
          <p>김해진</p>
          <p>김형준</p>
          <p>박지훈</p>
          <p>서원준</p>
        </div>
        <div className="footer_back">
          <h4>Back-End</h4>
          <p>김민주</p>
          <p>김장윤</p>
          <p>이승진</p>
          <p>정중환</p>
        </div>
        <div className="donga_home">
          <label>Homepage</label>
          <a
            href="https://computer.donga.ac.kr/computer/Main.do"
            target="_blank"
          >
            <p>Dong-A University,</p>
            <p>Department of Computer Engineering</p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
