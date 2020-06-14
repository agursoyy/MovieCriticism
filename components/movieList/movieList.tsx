import React, { FC, useState, useEffect } from 'react';
import './movieList.scss';
import Store from '../../stores';
import { useRouter } from 'next/router';
import { Router, Link } from '../../routes';
const queryString = require('query-string');
import { MovieResult } from '../../interfaces/movieResult';
import Search from '../search';
import ListedMovie from '../listedMovie';
import Pagination from 'react-js-pagination';
import { parse } from 'query-string';
import * as Scroll from 'react-scroll';


interface IProps {
  pageTitle: string,
  movies: MovieResult,
}
type listType = 'LIST' | 'GRID';


const MovieList: FC<IProps> = ({ movies, pageTitle }) => {
  const [listType, setListType] = useState<listType>('LIST');

  const { total_results, total_pages, page } = movies;


  const changeListType = (listType: listType): void => {
    setListType(listType);
  };

  const router = useRouter();
  const handlePageChange = (pageNumber: Number): void => {
    const { asPath, query } = router;
    const current = router.asPath.split('?')[0];
    query.page = pageNumber.toString();
    const stringfiedParam = queryString.stringify(query, {});
    Router.pushRoute(`${current}?${stringfiedParam}`);
    var scroll = Scroll.animateScroll;
    scroll.scrollToTop();
  };

  return (
    <div className="movie-list">
      <div className="top" style={{ backgroundImage: `url(${require('../../public/images/introduction-background.jpg')})` }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="top__content">
            <Search />
            <h1 className="title">{pageTitle} - List</h1>
            <div className="link">
              <Link to="home"><a>Home</a></Link>
              <i className="icon icon-rightarrow"></i>
              <span>movie listing</span>
            </div>
          </div>
        </div>
      </div>
      <div className="movie-list__container">
        <div className="container">
          <div className="row">
            <div className="col-sm-9">
              <div className="movie-list__filter">
                <p className="total-results">
                  Found <span>{total_results} results</span> in total
                </p>
                <div className="movies-sort">
                  <label>Sort by: </label>
                  <select>
                    <option>Rating Descenging</option>
                    <option>Rating Ascending</option>
                    <option>Release date Descending</option>
                    <option>Release date Ascending</option>
                  </select>
                </div>
                <div className="list-grid">
                  <button className="btn list-btn" onClick={() => { changeListType('LIST'); }}>
                    <i className={`icon icon-list-icon ${listType === 'LIST' && ' list-grid--active '}`}></i>
                  </button>
                  <button className="btn list-btn" onClick={() => { changeListType('GRID'); }}>
                    <i className={`icon icon-grid-icon ${listType === 'GRID' && ' list-grid--active '}`}></i>
                  </button>
                </div>

              </div>
              <div className="movie-list__list-container">
                {
                  movies && (
                    listType === 'LIST' ?
                      movies.results.map((m, index) => <ListedMovie listType={listType} key={index} movie={m} type={'MOVIE'} />)
                      :
                      (
                        <div className="row">
                          {
                            movies.results.map((m, index) => {
                              return (
                                <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                                  <ListedMovie listType={listType} key={index} movie={m} type={'MOVIE'} />
                                </div>
                              );
                            })
                          }
                        </div>
                      )
                  )
                }

                <div className="movie-list__list-container__pagination">
                  <p className="current-page ">
                    Page {page} of {total_pages}
                  </p>
                  <Pagination
                    activePage={page} // it wants just a number not a function(no need to bind)
                    itemsCountPerPage={20}
                    totalItemsCount={total_results}
                    pageRangeDisplayed={3}
                    hideDisabled={true}
                    activeLinkClass={'active'}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default MovieList;