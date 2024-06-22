import React from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import './post_view_header.css';

const PostHeader = ({
  title,
  language,
  languageIcons,
  date,
  liked,
  likesCount,
  handleLikeClick,
  user_image,
  author,
}) => {
  return (
    <div className="post-header">
      <h1 className="post-title">
        <img src={languageIcons[language]} alt="" className="language-icon" />{' '}
        {title}
      </h1>
      <div className="post-meta">
        <div className="meta-left">
          <div className="post-author-container">
            <img src={user_image} alt="profile" className="profile-image" />
            <span className="post-author">{author}</span>
            <span className="post-date">{date}</span>
          </div>
        </div>
        <div className="post-likes" onClick={handleLikeClick}>
          {liked ? (
            <MdFavorite className="icon active" />
          ) : (
            <MdFavoriteBorder className="icon" />
          )}
          {likesCount}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
