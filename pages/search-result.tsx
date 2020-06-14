import { NextPage, NextPageContext } from 'next';
import React from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../stores';
import Error from 'next/error';
import IPageConfig from '../interfaces/PageConfig';
import MovieList from '../components/movieList';
interface INextPageContext extends NextPageContext {
  store: Store
}

type Props = {
  store?: Store;
  type: 'movie' | 'tv'
}

type INextPage<P> = NextPage<P> & {
  pageConfig?: IPageConfig //whatever type it actually is ===> any. olmalı
}


const NowplayingMovies: INextPage<Props> = (props) => {
  const { store, type } = props;
  const { movie } = store!;
  const { search_result } = movie;

  return (
    search_result && search_result.results.length > 0 ?
      <div>
        <MovieList movies={search_result} pageTitle={type === 'movie' ? 'search movie' : 'search tv'} />
      </div>
      :
      <Error statusCode={404} title="NO RESULTS FOUND" />
  );
};

NowplayingMovies.getInitialProps = async ({ store, query }: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.
  const { page, type } = query;
  var isnum = /^\d+$/.test(String(page));
  let pageParam = 1;
  if (isnum) {
    pageParam = Number(page);
  }
  let typeParam: 'movie' | 'tv';
  typeParam = 'movie';
  if (type === 'movie')
    typeParam = 'movie';
  else if (type === 'tv')
    typeParam = 'tv';

  let queryWord = query.query ? query.query.toString() : '';

  await Promise.all([store.movie.fetchSearchResult(typeParam, queryWord, pageParam), store.movie.fetchGenres()]);
  return { type: typeParam };
};


export default inject('store')(observer(NowplayingMovies));