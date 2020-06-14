import React, { FC } from 'react';
import './listedMovie.scss';
import getConfig from 'next/config';
import { Link } from '../../routes';
import Movie from '../movie';

const { publicRuntimeConfig: {
  image_url
} } = getConfig();

type IProps = {
  movie: any;
  type: 'MOVIE' | 'TV';  // is it a theater or tv series
  listType: 'LIST' | 'GRID';
};

const ListedMovie: FC<IProps> = ({ movie, type, listType }) => {
  function replace(str: string): string {
    return str;
  }

  const { id, title, name, overview, release_date, poster_path, vote_average } = movie;
  if (listType === 'LIST')
    return (
      <div className="movie-list-item">
        <div className="row">

          <div className="col-sm-3">
            {
              poster_path ?
                <img src={`${image_url}/w200/${poster_path}`} className="movie-list-item__poster-img" />
                :
                <img src={'/images/not-found_img.png'} className="movie-list-item__poster-img" />
            }
          </div>

          <div className="col-sm-7">
            <div className=" movie-list-item__info">
              <h2 className="movie-list-item__info__movie-title">
                <Link route={type === 'MOVIE' ? 'movie-detail' : 'tv-detail'} params={{ title: title ? replace(title) : replace(name), id: id ? id : 1 }}>
                  <a>
                    {title}<span className="release_date">({release_date})</span>
                  </a>
                </Link>
              </h2>
              <p className="movie-list-item__info__vote-rate">
                <i className="icon icon-star mr-2"></i>
                <span>{vote_average}</span>
                <span className="bold">/10</span>
              </p>
              <p className=" movie-list-item__info__overview">
                {overview}
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  else
    return (
      <div className="movie-list-item">
        <div className="movie-list-item__poster-img">
          <Movie movie={movie} type={type} border={true} />

        </div>
      </div>
    );

};

export default ListedMovie;