import React from 'react';

const Contact = () => {
  return (
    <div className='t-social-link d-flex flex-row justify-content-end align-items-center mt-5 mb-5'>
      <span className="follow-us">follow us: </span>
      <a href="#">
        <i className="icon icon-facebook"></i>
      </a>
      <a href="#">
        <i className="icon icon-twitter"></i>
      </a>
      <a href="#">
        <i className="icon icon-google"></i>
      </a>
      <a href="#">
        <i className="icon icon-youtube"></i>
      </a>
    </div>
  );
};

export default Contact;