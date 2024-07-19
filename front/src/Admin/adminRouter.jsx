import Admin from '../Admin/Admin_main';
import AdminCheck from '../Admin/Admin_check';
import AdminNotice from '../Admin/Admin_notice';
import AdminNoticeView from '../Admin/Admin_notice_view';
import AdminNoticePost from '../Admin/Admin_notice_create';
import AdminNoticeUpdate from '../Admin/Admin_notice_update';

const adminRouter = {
  path: 'admin',
  children: [
    { path: '', element: <Admin /> },
    { path: 'check', element: <AdminCheck /> },
    {
      path: 'notice',
      children: [
        { path: '', element: <AdminNotice /> },
        { path: 'view/:id', element: <AdminNoticeView /> },
        { path: 'post', element: <AdminNoticePost /> },
        { path: 'modify/:id', element: <AdminNoticeUpdate /> },
      ],
    },
  ],
};

export default adminRouter;
