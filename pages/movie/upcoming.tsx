import { NextPage, NextPageContext } from 'next';
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../../stores';
import IPageConfig from '../../interfaces/PageConfig';
import MovieList from '../../components/movieList';
interface INextPageContext extends NextPageContext {
  store: Store
}

type Props = {
  store?: Store;
}

type INextPage<P> = NextPage<P> & {
  pageConfig?: IPageConfig //whatever type it actually is ===> any. olmalı
}


const UpcomingMovies: INextPage<Props> = (props) => {
  const { store } = props;
  const { movie } = store!;
  const { upcoming } = movie;

  if (upcoming) {
    return (
      <MovieList pageTitle="upcoming" movies={upcoming} />
    );
  }
  else
    return null;
};

UpcomingMovies.getInitialProps = async ({ store, query }: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.
  const { page } = query;
  var isnum = /^\d+$/.test(String(page));
  let pageParam = 1;
  if (isnum) {
    pageParam = Number(page);
  }
  await Promise.all([store.movie.fetchUpcoming(pageParam), store.movie.fetchGenres()]);
  return {};
};


export default inject('store')(observer(UpcomingMovies));