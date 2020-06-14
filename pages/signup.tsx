import { NextPage, NextPageContext } from 'next';
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Store from '../stores';

import IPageConfig from '../interfaces/PageConfig';
import { Signup } from '../components/authentication';

interface INextPageContext extends NextPageContext {
  store?: Store
}

type Props = {
  store?: Store
};

type INextPage<P> = NextPage<P> & {
  pageConfig?: IPageConfig //whatever type it actually is ===> any. olmalı
}


const SignupPage: INextPage<Props> = (props): JSX.Element => {
  const { store } = props;
  return (
    <>
      <Signup />
    </>
  );
};

SignupPage.getInitialProps = async (ctx: INextPageContext): Promise<Props> => {  // getInitialProps works on only pages folder, not other components.

  return {};
};

SignupPage.pageConfig = {};

export default inject('store')(observer(SignupPage));