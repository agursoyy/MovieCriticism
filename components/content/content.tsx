import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../../stores';
import './content.scss';
import MovieTab from '../movieTab';

type IProps = {
  store?: Store
};

const Content: FC<IProps> = (props) => {
  const { store } = props;
  const { movie: {
    now_playing,
    upcoming,
    popular,
    topRated,
    tv_popular
  } } = store!;
  return (
    <div className="container movie-tabs-content">
      <div className="row">
        <div className="col-sm-8">
          <MovieTab type="MOVIE" title='in theater' carouselID='in-theater-tab-carousel' upcoming={upcoming ? upcoming.results : []}
            popular={popular ? popular.results : []}
            topRated={topRated ? topRated.results : []} nowPlaying={now_playing ? now_playing.results : []} />
          <MovieTab type="TV" title='on tv' carouselID='in-tv-tab-carousel' popular={tv_popular ? tv_popular.results : []}
            topRated={tv_popular ? tv_popular.results : []} />
        </div>
      </div>
    </div>
  );
};

export default inject('store')(observer(Content));
