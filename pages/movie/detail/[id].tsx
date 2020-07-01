import { NextPage, NextPageContext } from 'next';
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../../../stores';
import IPageConfig from '../../../interfaces/PageConfig';
import Detail from '../../../components/detail';
import Error from 'next/error';
interface INextPageContext extends NextPageContext {
  store: Store
}

type Props = {
  store?: Store
};

type INextPage<P> = NextPage<P> & {
  pageConfig?: IPageConfig //whatever type it actually is ===> any. olmalı
}



const MovieDetail: INextPage<Props> = ({ store }): JSX.Element => {
  const { movie, user } = store!;
  const { detailed_result } = movie;

  return (
    detailed_result ?
      <div>
        <Detail type='MOVIE' movie={detailed_result} isFavorite={movie.isFavorite(detailed_result.id)} />
      </div>
      :
      <Error statusCode={404} title="NO MOVIE FOUND" />
  );
};

MovieDetail.getInitialProps = async (ctx: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.
  const { query: { id }, store } = ctx;
  const { movie: { fetchMovieDetail, detailed_result }, user: { user, fetchFavoriteIDs } } = store;
  if (id) {
    await fetchMovieDetail(Number(id));
  }
  if (user) {
    await fetchFavoriteIDs();
  }
  console.log(ctx.query);
  return {};
};

MovieDetail.pageConfig = { auth: false };

export default inject('store')(observer(MovieDetail));