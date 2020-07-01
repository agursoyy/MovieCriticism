import React, { FC, useState, useEffect } from 'react';
import getConfig from 'next/config';
import './detail.scss';
import Store from '../../stores';
import Search from '../search';
import ReactModal from 'react-modal';
import YoutubeModal from '../youtube-modal';
import { inject, observer } from 'mobx-react';


const { publicRuntimeConfig: {
  image_url
} } = getConfig();


type IProps = {
  type: 'MOVIE' | 'TV'
  movie: any,
  isFavorite: boolean,
  store?: Store
}



type IShow = {
  overview?: boolean;
  media?: boolean;
};

const Detail: FC<IProps> = (props) => {

  const { movie: { id, backdrop_path, poster_path, title, youtube_video_id, release_date, vote_average, overview }, isFavorite } = props;
  const { store } = props;
  const { user: { user, favoriteIDs, addMovieToFavorites, removeMovieFromFavorites }, movie: { related_images, fetchRelatedImages } } = store!;

  useEffect(() => {
    $(function () {
      ($('[data-toggle="tooltip"]') as any).tooltip();
    });
  });
  const initialShowState: IShow = {
    overview: true,
  };

  const [show, setShow] = useState(initialShowState); // for the tabs of the movie
  const [openYoutubeModal, setOpenYoutubeModal] = useState(false); // for the youtube video modal.
  const [favorite_loading, setFavoriteLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);


  const toggle = (target_name: 'overview' | 'media') => { // toggle between movie tabs
    const newShowState: IShow = {};
    newShowState[target_name] = true;
    if (target_name === 'media') {
      fetchRelatedImages(id, props.type).then(res => {
        setImagesLoading(false);
      });
    }
    setShow(newShowState);
  };

  const openModal = () => {  // open youtube trailer modal
    $('#t-header').removeClass('sticky-top');
    $('#t-navbar').removeClass('sticky-nav');
    $('#t-header').addClass('absolute-header');
    setOpenYoutubeModal(true);
  };

  const closeModal = () => { // close youtube trailer modal
    setOpenYoutubeModal(false);
  };


  const addToFavorites = async () => {
    setIsFavoriteState(true);
    let isAdded = await addMovieToFavorites(props.movie);
    if (!isAdded)
      setIsFavoriteState(false);
  };
  const deleteFromFavorites = async () => {
    setIsFavoriteState(false);
    let isRemoved = await removeMovieFromFavorites(id);
    if (!isRemoved)
      setIsFavoriteState(true);
  };
  const favoriteButton = (): JSX.Element => {
    let button: JSX.Element;
    if (!user) {
      button = <a className="btn btn-link" data-toggle="tooltip" data-placement="bottom" title="Login to add this movie to your favorite list">
        <i className="icon icon-heart"></i> <span className="btn-expl">Add to Favorites</span>
      </a>;
    }
    else {
      button = <a className={`btn btn-link ${isFavoriteState ? 'favorited' : ''}`}
        onClick={!isFavoriteState ? addToFavorites : deleteFromFavorites}>
        {
          <i className="icon icon-heart"></i>
        }
        <span className="btn-expl">
          {!isFavoriteState ? 'Add to favorites' : 'Remove from favorites'}
        </span>
      </a >;
    }
    return button;
  };

  const shareButton = (): JSX.Element => {
    if (!user) {
      return (
        <a className="btn btn-link" data-toggle="tooltip" data-placement="bottom" title="Login to share this movie">
          <i className="icon icon-share"></i>
          <span className="btn-expl">Share</span>
        </a>
      );
    }
    else {
      return (
        <a className="btn btn-link">
          <i className="icon icon-share"></i>
          <span className="btn-expl">Share</span>
        </a>
      );
    }
  };

  return (
    <>
      <ReactModal
        isOpen={openYoutubeModal}
        contentLabel="Minimal Modal Example"
        className="modal-container"
        ariaHideApp={false}
        onRequestClose={() => { setOpenYoutubeModal(false); }}
      >
        <YoutubeModal videoId={youtube_video_id} close={closeModal} />
      </ReactModal>
      <div className="detail-container">
        <div className="backdrop" style={{ background: backdrop_path && `url(${image_url}/original/${backdrop_path})` }}>
          <div className="container search-box">
            <Search />
          </div>
        </div>

        <div className="movie-container">
          <div className="container">
            <div className="row movie-container-row">
              <div className="col-md-4">
                <div className="movie-img">
                  {
                    poster_path ?
                      <img className="poster-img" src={`${image_url}/w300/${poster_path}`} ></img>
                      :
                      <img src={'/images/not-found_img.png'} />
                  }
                  <div className="movie-btn">
                    <button className="btn btn-danger btn-block" onClick={openModal}>
                      <i className="icon icon-play mr-4"></i> Watch Trailer
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="movie-single">
                  <h1 className="title">{title} <span>{release_date}</span></h1>
                  <ul className="buttons d-flex flex-wrap align-items-center">
                    <li>
                      <div className="rate p-3">
                        <i className="icon icon-star"></i>
                        <span className="bold">{vote_average}</span> /10
                    </div>
                    </li>
                    <li>
                      {favoriteButton()}
                    </li>
                    <li>
                      {shareButton()}
                    </li>
                  </ul>

                  <div className="movie-tabs">
                    <ul className="tab-links d-flex flex-wrap">
                      <li className={`${show.overview ? 'active' : ''}`} onClick={() => { toggle('overview'); }}>overview</li>
                      <li className={`${show.media ? 'active' : ''}`} onClick={async () => { toggle('media'); }}>media</li>
                    </ul>
                    <div className="tab-content">
                      {
                        show.overview &&
                        <div className="overview">
                          <div className="row">
                            <div className="col-sm-9">
                              <p>
                                {overview}
                              </p>
                            </div>
                          </div>
                        </div>
                      }
                      {
                        show.media &&
                        <div className="detailed-result__media">
                          <div className="row">
                            <div className="col-sm-12">
                              {
                                imagesLoading ?
                                  <p className="text-light">
                                    Loading...
                                </p>
                                  :
                                  related_images && related_images.backdrops.length > 0 ?
                                    <div className="row">
                                      {
                                        related_images.backdrops.map((p, index) => {
                                          return (
                                            <div className="media-column col-6 col-lg-4" key={index}>
                                              <div className="img__container">
                                                <img src={`${image_url}/w300/${p.file_path}`} ></img>
                                              </div>
                                            </div>
                                          );
                                        })
                                      }
                                    </div>
                                    :
                                    <p className="no-media-found">
                                      No media found.
                                    </p>

                              }

                            </div>
                          </div>
                        </div>
                      }

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>


  );
};

export default inject('store')(observer(Detail));
