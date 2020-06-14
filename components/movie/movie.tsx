import React, { FC } from 'react';
import './movie.scss';
import getConfig from 'next/config';
import Store from '../../stores';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';

const { publicRuntimeConfig: {
  image_url
} } = getConfig();


type IProps = {
  movie: any;
  store?: Store;
  type: 'MOVIE' | 'TV';
  border?: boolean;
};

const Movie: FC<IProps> = (props) => {
  const {
    movie: {
      id,
      poster_path,
      title,   // original title in theater movies, name in tv series
      name,
      vote_average,
      genre_ids,
      genres
    },
    border,
  } = props;

  const { store, type } = props;
  const { movie: { getGenreList } } = store!;
  const badge_classes = ['success', 'warning'];

  function replace(str: string) {
    return str.toLowerCase().replace(/\s/g, '-');
  }

  const genreIDs = () => {
    const { movie } = props;
    let arr: Array<Number> = [];
    if (genre_ids) {
      arr = genre_ids;
    }
    else if (genres) {
      arr = genres.map((g: { id: any; }) => g.id);
    }
    return arr;
  };

  return (
    <div className={`movie-item ${border && 'movie-item-border'}`}>
      {
        poster_path ?
          <img src={`${image_url}/w300/${poster_path}`} className="movie-item-img" />
          :
          <img src={'/images/not-found_img.png'} className="movie-item-img" />
      }
      <div className="d-flex flex-column justify-content-end align-items-start movie-item-info">
        <div className="genres">
          {
            getGenreList(genreIDs()).map((genre: string, index: number) => <span className={`badge badge-${badge_classes[index]} mr-1`} key={index}>{genre}</span>)
          }
        </div>
        <h6>
          <Link href={type === 'MOVIE' ? '/movie/detail/[id]' : '/tv/detail/[id]'} as={type === 'MOVIE' ? `/movie/detail/${id}` : `/movie/detail/${id}`}>
            <a className="m-title">
              {title && title}
              {name && name}
            </a>
          </Link>
        </h6>

        <p className="vote-rate-icon">
          <i className="icon icon-star mr-2"></i>
          <span>{vote_average}</span> /10
        </p>

      </div>
    </div >
  );
};

export default inject('store')(observer(Movie));