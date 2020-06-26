import { Provider } from 'mobx-react';
import App, { AppInitialProps, Container } from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import nookies from 'nookies';
import React, { Fragment, useEffect } from 'react';
import NProgress from 'nprogress';
import Store from '../stores';


import '../styles/index.scss';
import IPageConfig from '../interfaces/PageConfig';
import Header from '../components/header';
import { NextPageContext } from 'next';
const { publicRuntimeConfig } = getConfig();


interface IProps extends AppInitialProps {  // Component comes from AppInitialProps
  storeData: string | null;
  pageConfig: IPageConfig;
  pageProps: any;  // props of the Container
}

interface INextPageContext {
  Component: any;
  ctx: NextPageContext
}
export default class MyApp extends App<IProps> {
  static async getInitialProps({ Component, ctx }: INextPageContext): Promise<IProps> {

    let pageProps = {};

    let pageConfig = publicRuntimeConfig.pageConfig;    // get page config from next.config
    if (Component.pageConfig) {
      pageConfig = {           // merge page configs with child component.
        ...pageConfig,
        ...Component.pageConfig
      };
    }


    const { req } = ctx;
    const store = req ? new Store() : window.store;
    // const store = (typeof window !== 'undefined' && window.store) ? window.store : new Store();

    let storeData = null;
    if (req) {
      const { accessToken } = nookies.get(ctx);
      let user;
      if (accessToken) {
        store.api.accessToken = accessToken;
        user = await store.user.getCurrent();   // user which is successfully set means the user has logged in.
      }
      if (!user) {  // user not found so kick him off.
        /*store.api.accessToken = undefined;
        store.api.refreshToken = undefined;
        nookies.destroy(ctx, 'accessToken', false);
        nookies.destroy(ctx, 'refreshToken', false);*/
        store.auth.logout();
        const { auth } = pageConfig;
        if (auth) {
          const { res } = ctx;
          if (res && typeof res.writeHead === 'function') {
            res.writeHead(302, {
              location: '/login',
            });
            res.end();
            return { storeData, pageConfig, pageProps };
          }
        }
      }
      else {  // already logged in.
        const { res, pathname } = ctx;
        if (res && typeof res.writeHead === 'function') {
          if (pathname === '/login') {
            res.writeHead(302, {
              location: '/',
            });
            res.end();
          }
        }
      }
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ...ctx, store });   // get props of the child component.
    }

    storeData = req ? store.export() : null;
    return { storeData, pageConfig, pageProps };
  }


  public store: Store;
  constructor(props: any) {
    super(props);
    this.store = typeof window !== 'undefined' && window.store ? window.store : new Store();

    const { storeData } = props;

    if (storeData) {    // server side daki değişikliği inject etmek için
      this.store.import(storeData);
    }
    if (typeof window !== 'undefined' && !window.store) {
      window.store = this.store;
    }

  }


  render() {
    const { Component, pageProps, pageConfig, storeData } = this.props;
    const { layout, header, footer } = pageConfig;



    return (
      <Container>
        <Provider store={this.store}>
          <>
            <Head>
              <title>Movie Criticism</title>
              <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
              <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
              <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
              <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
              <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script>
              <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.4/jquery.touchSwipe.min.js'></script>
            </Head>
            <div className="">
              {
                layout ?
                  <>
                    {header && <Header />}
                    <Component {...pageProps} />
                    {footer && <h1 className=" text-center">FOOTER</h1>}
                  </>
                  :
                  <Component {...pageProps} />
              }
            </div>
          </>
        </Provider>
      </Container>

    );
  }

}

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => { NProgress.start(); });
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
}
);
Router.events.on('routeChangeError', () => NProgress.done());
