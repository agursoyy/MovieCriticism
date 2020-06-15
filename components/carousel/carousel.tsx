import React, { FC, useState, useEffect } from 'react';
import Store from '../../stores/movie';
import './carousel.scss';
import Movie from '../movie';
import $ from 'jquery';
import Slider from 'react-slick';




type IProps = {
  movies: Array<any>;
  type: 'MOVIE' | 'TV';
};

const Carousel: FC<IProps> = (props) => {
  const { movies, type } = props; // 20 movies got.
  const slicedMovies = movies.slice(0, 12);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className="carousel-t">

      <Slider {...settings}>
        {
          slicedMovies.map((m, index) => {
            return <div key={index} className="slick-item-wrapper">
              <Movie movie={m} type={type} />
            </div>;
          })
        }
      </Slider>
    </div>
  );
};

export default Carousel;