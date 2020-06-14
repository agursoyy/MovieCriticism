import React, { FC, useState } from 'react';
import './movieTab.scss';
import Link from 'next/link';
import Carousel from '../carousel';

type IProps = {
  title: string;
  type: 'MOVIE' | 'TV';
  carouselID: string;
  popular: Array<any>;
  topRated: Array<any>;
  upcoming?: Array<any>;
  nowPlaying?: Array<any>;
};

type IShow = {
  popular?: boolean;
  upcoming?: boolean;
  topRated?: boolean;
  nowPlaying?: boolean;
};

const MovieTab: FC<IProps> = (props) => {
  const { title, type, carouselID, popular, upcoming, topRated, nowPlaying } = props;

  const initialShowState: IShow = {
    popular: true,
  };

  const [show, setShow] = useState(initialShowState);

  const toggle = (carousel_name: 'popular' | 'upcoming' | 'topRated' | 'nowPlaying') => {
    const newShowState: IShow = {};
    newShowState[carousel_name] = true;
    setShow(newShowState);
  };

  return (
    <div className="movie-tab">
      <div className="th-title d-flex justify-content-between align-items-center">
        <h2>{title}</h2>
        <Link href={show.popular ? '/movie/popular' : (show.nowPlaying ? '/movie/now-playing' : (show.topRated ? '/movie/top-rated' :
          (show.upcoming ? 'movie/upcoming' : '')))}>
          <a>
            <span>
              View All
            </span>
            <i className="icon icon-next"></i>
          </a>
        </Link>

      </div>
      <div className="tab">
        <ul className="tab-links d-flex flex-row">
          <li onClick={() => { toggle('popular'); }} className={show.popular ? 'active' : ''}>
            #popular
          </li>
          {
            nowPlaying &&
            <li onClick={() => { toggle('nowPlaying'); }} className={show.nowPlaying ? 'active' : ''}>
              #now playing
            </li>
          }
          {
            upcoming &&
            <li onClick={() => { toggle('upcoming'); }} className={show.upcoming ? 'active' : ''}>
              #coming soon
            </li>
          }
          <li onClick={() => { toggle('topRated'); }} className={show.topRated ? 'active' : ''}>
            #top rated
          </li>
        </ul>
        <div className="tab-content">
          {
            show.popular && <Carousel type={type} movies={popular} />
          }
          {
            nowPlaying && show.nowPlaying && <Carousel type={type} movies={nowPlaying} />
          }
          {
            upcoming && show.upcoming && <Carousel type={type} movies={upcoming} />
          }
          {
            show.topRated && <Carousel type={type} movies={topRated} />
          }
        </div>
      </div>
    </div>

  );
};

export default MovieTab;
