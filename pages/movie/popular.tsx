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


const PopularMovies: INextPage<Props> = (props) => {
  const { store } = props;
  const { movie, user } = store!;
  const { popular } = movie;

  if (popular) {
    return (
      <MovieList pageTitle="popular" movies={popular} />
    );
  }
  else
    return null;
};

PopularMovies.getInitialProps = async ({ store, query }: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.
  const { page } = query;
  var isnum = /^\d+$/.test(String(page));
  let pageParam = 1;
  if (isnum) {
    pageParam = Number(page);
  }
  const { movie, user } = store;
  await Promise.all([movie.fetchPopular(pageParam), movie.fetchGenres()]);
  return {};
};

PopularMovies.pageConfig = { auth: false };

export default inject('store')(observer(PopularMovies));