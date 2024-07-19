import React from 'react';
import Post from '../Post/post_main';
import PostMainNotification from '../Post/post_main_notification';
import PostView from '../Post/post_view';
import PostWrite from '../Post/post_write';
import PostUpdate from '../Post/post_update';

const postRouter = {
  path: 'post',
  children: [
    { path: 'main', element: <Post /> },
    { path: 'notification', element: <PostMainNotification /> },
    { path: 'post_view/:post_id', element: <PostView /> },
    { path: 'write', element: <PostWrite /> },
    { path: 'update', element: <PostUpdate /> },
  ],
};

export default postRouter;
