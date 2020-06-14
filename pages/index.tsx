import React from 'react';
import { NextPage, NextPageContext } from 'next';
import IPageConfig from '../interfaces/PageConfig';
import routes, { Link } from '../routes';
import { inject, observer } from 'mobx-react';
import Store from '../stores';
import Introduction from '../components/introduction';
import Content from '../components/content';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';

interface INextPageContext extends NextPageContext {
  store: Store
}

type Props = {
  store?: Store;
}
type INextPage<P> = NextPage<P> & {
  pageConfig: IPageConfig
}

const Home: INextPage<Props> = (props) => {
  const { store } = props;
  const current = store?.user.getCurrent();
  console.log(current);
  return (
    <div id="main">
      <Introduction />
      <Content />
      <h3 className="text-white">
        <Link route="popular-movies">
          <a>
            Popular Movies List
          </a>
        </Link>
      </h3>
    </div >
  );
};

Home.getInitialProps = async (ctx: INextPageContext): Promise<Props> => {
  const { store } = ctx;
  await Promise.all([store.movie.fetchNowPlaying(), store.movie.fetchPopular(), store.movie.fetchTopRated(),
  store.movie.fetchUpcoming(), store.movie.fetchTvPopular(), store.movie.fetchGenres()]);
  return {};
};

Home.pageConfig = {
  auth: false
};



export default inject('store')(observer(Home));