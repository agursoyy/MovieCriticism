import { NextPage, NextPageContext } from 'next';
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../stores';
import IPageConfig from '../interfaces/PageConfig';
import MovieList from '../components/movieList';
interface INextPageContext extends NextPageContext {
  store: Store
}

type Props = {
  store?: Store;
}

type INextPage<P> = NextPage<P> & {
  pageConfig?: IPageConfig //whatever type it actually is ===> any. olmalı
}


const FavoriteMovies: INextPage<Props> = (props) => {
  const { store } = props;
  const { movie, user } = store!;
  const { favorites } = user;

  if (favorites) {
    return (
      <MovieList pageTitle="favorite movies" movies={favorites} />
    );
  }
  else
    return null;
};

FavoriteMovies.getInitialProps = async ({ store, query }: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.
  const { page } = query;
  var isnum = /^\d+$/.test(String(page));
  let pageParam = 1;
  if (isnum) {
    pageParam = Number(page);
  }
  const { movie, user } = store;
  await Promise.all([movie.fetchGenres(), user.fetchFavoriteMovies(pageParam)]);
  return {};
};

FavoriteMovies.pageConfig = { auth: true };

export default inject('store')(observer(FavoriteMovies));