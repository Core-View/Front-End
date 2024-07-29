import React from 'react';
import Post from '../Post/main/post_main';
import PostMainNotification from './main/post_main_notification';
import PostView from './view/post_view';
import PostWrite from './write/post_write';
import PostUpdate from './update/post_update';

const postRouter = {
  path: 'post',
  children: [
    { path: 'main', element: <Post /> },
    { path: 'notification', element: <PostMainNotification /> },
    { path: 'post_view/:post_id', element: <PostView /> },
    { path: 'write', element: <PostWrite /> },
    { path: 'update/:post_id', element: <PostUpdate /> },
  ],
};

export default postRouter;
