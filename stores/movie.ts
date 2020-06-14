import Store from '.';
import { Nullable } from '../types/types';
import { observable, action, computed } from 'mobx';
import { computedFn } from 'mobx-utils';
import { MovieResult, Genre } from '../interfaces/movieResult';
import { IimageResult } from '../interfaces/imagesResult';
import getConfig from 'next/config';

const { publicRuntimeConfig: {
  api_key
} } = getConfig();

export default class Movie {
  private url = {
    base: '/movie',
    now_playing: '/now_playing',
    popular: '/popular',
    upcoming: '/upcoming',
    topRated: '/top_rated',
    genre_base: '/genre/movie/list',
    tv_base: '/tv',
    search_base: '/search'
  };

  @observable
  genres!: Nullable<Array<Genre>>;
  @observable
  now_playing!: Nullable<MovieResult>;
  @observable
  popular!: Nullable<MovieResult>;
  @observable
  upcoming!: Nullable<MovieResult>;
  @observable
  topRated!: Nullable<MovieResult>;
  @observable
  tv_popular!: Nullable<MovieResult>;
  @observable
  tv_topRated!: Nullable<MovieResult>;
  @observable
  search_result!: Nullable<MovieResult>;

  @observable
  detailed_result: any;
  @observable
  related_images!: Nullable<IimageResult>;

  constructor(private store: Store) {
    this.store;
  }

  @action
  fetchGenres = async (): Promise<void> => {
    const form = {
      api_key: api_key
    };
    if (!this.genres) {
      const genre_result = await this.store.api.fetch({ url: this.url.genre_base, form, auth: false }, 200);
      const { status } = genre_result;
      if (!status)
        if (genre_result && genre_result.genres) {
          this.genres = [...genre_result.genres];
        }
    }
  }

  getGenreList = (genre_ids: Array<Number>): string[] => {
    const arr: Array<any> = genre_ids.map(id => {
      let genre;
      if (this.genres)
        this.genres.forEach(g => {
          if (g.id === id) {
            genre = g.name;
          }
        });
      return genre;
    });
    return arr.slice(0, 2); // two elements is enough
  }

  @action
  fetchNowPlaying = async (page?: number): Promise<void> => {
    const form = {
      page,
      api_key: api_key
    };
    if (!this.now_playing || this.now_playing.page != page) {
      const response = await this.store.api.fetch({ url: `${this.url.base}${this.url.now_playing}`, form, auth: false }, 200);
      const { status } = response;
      if (!status)
        this.now_playing = response;
      else
        this.now_playing = null;
    }

  }
  @action
  fetchPopular = async (page?: number): Promise<void> => {
    const form = {
      page,
      api_key: api_key
    };
    if (!this.popular || this.popular.page !== page) {
      const response = await this.store.api.fetch({ url: `${this.url.base}${this.url.popular}`, form, auth: false }, 200);
      const { status } = response;
      if (!status)
        this.popular = response;  // data itself
      else
        this.popular = null;
    }
  }
  @action
  fetchUpcoming = async (page?: number): Promise<void> => {
    const form = {
      api_key: api_key,
      page
    };
    if (!this.upcoming || this.upcoming.page !== page) {
      const response = await this.store.api.fetch({ url: `${this.url.base}${this.url.upcoming}`, form, auth: false }, 200);
      const { status } = response;
      if (!status)
        this.upcoming = response;
    }
  }
  @action
  fetchTopRated = async (page?: number): Promise<void> => {
    const form = {
      page,
      api_key: api_key
    };
    if (!this.topRated || this.topRated.page !== page) {
      const response = await this.store.api.fetch({ url: `${this.url.base}${this.url.topRated}`, form, auth: false }, 200);
      const { status } = response;
      if (!status)
        this.topRated = response;
    }
  }
  @action
  fetchTvPopular = async (page?: number): Promise<void> => {
    const form = {
      page,
      api_key: api_key
    };
    if (!this.tv_popular) {
      const response = await this.store.api.fetch({ url: `${this.url.tv_base}${this.url.popular}`, form, auth: false }, 200);
      const { status } = response;
      if (!status)
        this.tv_popular = response;
    }
  }
  @action
  fetchMovieDetail = async (id: number): Promise<void> => {
    const form = {
      api_key
    };
    if (!this.detailed_result || this.detailed_result.id !== id) {
      const response = await this.store.api.fetch({ url: `${this.url.base}/${id}`, form, auth: false }, 200);
      if (response.status && response.status === 404) {
        this.detailed_result = null;
      }
      else {
        this.detailed_result = response; // data itself
        if (this.detailed_result) {
          const videoIDs = await this.store.api.fetch({ url: `${this.url.base}/${id}/videos`, form, auth: false }, 200);  // fetch the videoids of the movie
          if (videoIDs && videoIDs.results && videoIDs.results.length > 0) { // append the video id to the detailed result
            this.detailed_result['youtube_video_id'] = videoIDs.results[0].key;
          }
        }
      }
    }
  }

  isFavorite = (movieID: number) => {
    const { user: { favoriteIDs } } = this.store;
    if (favoriteIDs.includes(movieID))
      return true;
    else
      return false;
  };

  fetchSearchResult = async (type: 'movie' | 'tv', query: string, page?: number): Promise<void> => {
    const form = {
      page,
      query,
      api_key: api_key
    };
    let url = this.url.search_base;
    if (type === 'movie')
      url = url + this.url.base;
    else
      url = url + this.url.tv_base;
    const response = await this.store.api.fetch({ url, form, auth: false }, 200);
    const { status } = response;
    if (!status)
      this.search_result = response;
  }

  fetchRelatedImages = async (id: number, type: 'MOVIE' | 'TV') => {
    if (!this.related_images || this.related_images.id !== id) {
      let url = '';
      if (type === 'MOVIE')
        url = url + this.url.base;
      else
        url = url + this.url.tv_base;
      const form = {
        api_key
      };
      const response = await this.store.api.fetch({ url: `${this.url.base}/${id}/images`, form, auth: false }, 200);
      if (!status)
        this.related_images = response;
      console.log(response);
    }
  }


}
