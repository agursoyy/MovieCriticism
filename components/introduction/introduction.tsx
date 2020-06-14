import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../../stores';
import Search from '../search';
import Carousel from '../carousel';
import ContactLinks from '../contact-links';


type IProps = {
  store?: Store
};

const Introduction: FC<IProps> = (props) => {
  const { store } = props;
  const { movie: { now_playing, tv_popular } } = store!;
  return (
    <div className='t-introduction' style={{ backgroundImage: `url(${require('../../public/images/introduction-background.jpg')})` }}>
      <div className="overlay"></div>
      <div className="container content">
        <Search />
        <ContactLinks />
        <Carousel type='MOVIE' movies={now_playing ? now_playing.results : []} /> {/**carouse iterates over movies  */}
      </div>
    </div>
  );
};

export default inject('store')(observer(Introduction));