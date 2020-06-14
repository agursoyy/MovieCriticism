import nookies from 'nookies';

import Store from '.';
import { observable, action } from 'mobx';
import { Nullable } from '../types/types';
import { MovieResult as IMovieResult } from '../interfaces/movieResult';
import { number } from 'prop-types';



export default class User {
  private remote = false;
  private url = {
    base: '/users',
    favoriteIds_url: '/favoriteIDs',
    favorites_url: '/favorites',  // ?page = 1 .
    addFavorite_url: '/addfavorite',
    removeFavorite_url: '/favorites/remove'
  };
  @observable
  public user = false;


  @observable
  favoriteIDs!: Array<Number>;

  @observable
  favorites!: Nullable<IMovieResult>;


  constructor(private store: Store) {
    this.favoriteIDs = [];
  }

  public getCurrent = async (): Promise<boolean> => {
    if (!this.user) {
      const response = await this.store.api.fetch({ url: `${this.url.base}${this.url.favoriteIds_url}`, remote: this.remote }, 200);
      if (!response.status) {
        this.user = true;
      }
    }
    return this.user;
  };

  @action
  fetchFavoriteIDs = async () => {
    const response = await this.store.api.fetch({ url: `${this.url.base}${this.url.favoriteIds_url}`, remote: this.remote }, 200);
    if (!response.status) {
      this.favoriteIDs = [...response.results];
    }
  }

  @action
  fetchFavoriteMovies = async (page?: number) => {
    let pageParam = page ? page : 1;
    const form = {
      page: pageParam
    };
    const response = await this.store.api.fetch({ url: `${this.url.base}${this.url.favorites_url}`, remote: this.remote, form }, 200);
    if (!response.status) {
      this.favorites = response;
      this.favorites!.page = pageParam;
      this.favorites!.total_results = this.favorites!.total_pages * 20;
      this.favorites!.results = this.favorites!.results.filter(m => typeof m !== 'number');
    }
    else {
      this.favorites = null;
    }
  }


  @action
  addMovieToFavorites = async (movie: {}) => {
    const form = {
      movie
    };
    const response = await this.store.api.fetch({
      method: 'post', url: `${this.url.base}${this.url.addFavorite_url}`,
      remote: this.remote, form
    }, 201);
    const { status } = response;
    if (!status) {
      await this.fetchFavoriteIDs();
    }
  }

  @action
  removeMovieFromFavorites = async (id: number) => {
    const form = {
      movieId: id
    };
    const response = await this.store.api.fetch({
      method: 'delete', url: `${this.url.base}${this.url.removeFavorite_url}`,
      remote: this.remote, form
    }, 200);
    const { status } = response;
    if (!status) {
      await this.fetchFavoriteIDs();
    }
  }

}
