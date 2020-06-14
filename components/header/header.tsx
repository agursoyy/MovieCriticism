import React, { useEffect, useState, FC } from 'react';
import $ from 'jquery';
import './header.scss';
import Store from '../../stores';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import Logo from '../logo';


interface IProps {
  store?: Store
}


const scrollValue = 280;
const defaultNavbarCss = () => {
  $('#t-header').removeClass('sticky-top');
  $('#t-navbar').removeClass('sticky-nav');
  $('#t-header').addClass('absolute-header');
};

const stickyNavbarCss = () => {
  $('#t-header').removeClass('absolute-header');
  $('#t-header').addClass('sticky-top');
  $('#t-navbar').addClass('sticky-nav');
};

const navbar_config = () => {
  $('.navbar-collapse .navbar-nav .nav-item .nav-link:not(.dropdown-toggle)').on('click', function () {
    if (typeof window !== undefined && window.innerWidth < 992) {
      $('.navbar-toggler').click();
    }
  });

  $('.navbar-toggler').on('click', function () {
    var isOpen = !$('#navbarText').is(':visible');
    if (isOpen)
      $('#t-navbar').addClass('sticky-nav');
  });
};

const Header: FC<IProps> = ({ store }) => {

  useEffect(() => {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      if (scroll) {
        if (scroll < scrollValue) {
          defaultNavbarCss();
        } else {
          stickyNavbarCss();
        }
      }
    });
    navbar_config();
  });


  const router = useRouter();
  const activeLink = (route: string) => {  // name of the route
    if (router.pathname === route) {
      return 'active';
    }
    return '';
  };
  const logout = () => {
    const { auth: { logout } } = store!;
    logout();
    location.reload();
  };
  const { user: { user } } = store!;
  return (
    <header id="t-header" className="absolute-header">
      <nav id="t-navbar" className="navbar navbar-expand-lg navbar-trans">
        <div className="container">
          <Link href="/">
            <a className="navbar-brand" href="#">
              <Logo />
            </a>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <i className="icon icon-hamburger"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto navbar page-links">

              <li className="nav-item">
                <Link href="/movie/now-playing">
                  <a className={`nav-link ${activeLink('/movie/now-playing')}`}>
                    now playing
                 </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/movie/popular">
                  <a className={`nav-link ${activeLink('/movie/popular')}`}>
                    popular
                 </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/movie/upcoming">
                  <a className={`nav-link ${activeLink('/movie/upcoming')}`}>
                    coming soon
                 </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/movie/top-rated">
                  <a className={`nav-link ${activeLink('/movie/top-rated')}`}>
                    top rated
                 </a>
                </Link>
              </li>
            </ul>
            {
              user ?
                <ul className="navbar-nav navbar">
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown">Hoşgeldiniz</a>
                    <div className="dropdown-menu">
                      <Link href="/favorites-list">
                        <a className="dropdown-item">
                          Favori Listem
                       </a>
                      </Link>
                      <a className="dropdown-item  btn btn-link btn-logout" onClick={logout}>
                        Logout
                       </a>
                    </div>
                  </li>
                </ul>
                :
                <ul className="navbar-nav navbar authentication">
                  <li className="nav-item">
                    <Link href="login">
                      <a className="nav-link">
                        login
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="signup">
                      <a className="nav-link btn btn-link btn-signup" >
                        sign up
                      </a>
                    </Link>
                  </li>
                </ul>
            }
          </div>
        </div>
      </nav >
    </header >
  );
};


Router.events.on('routeChangeComplete', () => {
  defaultNavbarCss();
  if ($('.navbar-toggler').attr('aria-expanded') === 'true') {
    $('.navbar-toggler').click();
  }
});

export default inject('store')(observer(Header));