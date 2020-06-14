import React, { useEffect, useState, FC } from 'react';
import $ from 'jquery';
import './header.scss';
import Store from '../../stores';
import { Link, getURL, getRouteName } from '../../routes';
import { useRouter } from 'next/router';
import { Router } from '../../routes';
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
  const activeLink = (routeName: string) => {  // name of the route
    const current = router.asPath.split('?');
    if (current[0] === getURL(routeName)) {
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
          <Link route="home">
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
                <Link route="now-playing-movies">
                  <a className={`nav-link ${activeLink('now-playing-movies')}`}>
                    now playing
                 </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link route="popular-movies">
                  <a className={`nav-link ${activeLink('popular-movies')}`}>
                    popular
                 </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link route="upcoming-movies">
                  <a className={`nav-link ${activeLink('upcoming-movies')}`}>
                    coming soon
                 </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link route="top-rated-movies">
                  <a className={`nav-link ${activeLink('top-rated-movies')}`}>
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
                      <Link route="favorite-movies">
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
                    <Link route="login">
                      <a className="nav-link">
                        login
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link route="signup">
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