import React, { FC, useEffect } from 'react';
import YouTube from 'react-youtube';

interface IProps {
  close(): void;
  videoId: string;
}

const youtubeModal: FC<IProps> = ({ videoId, close }) => {
  //<ModalVideo channel='youtube' isOpen={isOpen} videoId={videoId} onClose={close} />

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  });
  const _onReady = (event: any) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return (
    <div className="youtube-modal-container">
      <a className="btn btn-link icon-btn">
        <i className="icon icon-close" onClick={() => { close(); }}></i>
      </a>
      <YouTube videoId={videoId} className="youtube-trailer-video" opts={{ playerVars: { autoplay: 1 } }} onReady={_onReady} />
    </div>
  );
};

export default youtubeModal;