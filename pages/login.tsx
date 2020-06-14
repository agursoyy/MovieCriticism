import { NextPage, NextPageContext } from 'next';
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../stores';

import IPageConfig from '../interfaces/PageConfig';
import { Login } from '../components/authentication';

interface INextPageContext extends NextPageContext {
  store?: Store
}

type Props = {
  store?: Store
};

type INextPage<P> = NextPage<P> & {
  pageConfig?: IPageConfig //whatever type it actually is ===> any. olmalı
}


const LoginPage: INextPage<Props> = (props): JSX.Element => {
  const { store } = props;

  return (
    <>
      <Login />
    </>
  );
};

LoginPage.getInitialProps = async (ctx: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.
  const { store, res, pathname } = ctx;
  return {};
};

LoginPage.pageConfig = { auth: true };

export default inject('store')(observer(LoginPage));