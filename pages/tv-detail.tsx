import { NextPage, NextPageContext } from 'next';
import React from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../stores';
import Link from 'next/link';
import IPageConfig from '../interfaces/PageConfig';

interface INextPageContext extends NextPageContext {
  store: Store
}

type Props = {
  age: number;
  store?: Store;
  url: any;
}

type INextPage<P> = NextPage<P> & {
  pageConfig?: IPageConfig //whatever type it actually is ===> any. olmalı
}


const MovieDetail: INextPage<Props> = (props): JSX.Element => {

  const { store } = props;
  return (
    <div>
      <h2>About Page</h2>
      <Link href='/'><a>home page</a></Link>
    </div>
  );
};

MovieDetail.getInitialProps = async (ctx: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.
  const { query } = ctx;
  return {
    age: 12,
    url: { query }
  };
};

MovieDetail.pageConfig = { auth: false };

export default inject('store')(observer(MovieDetail));