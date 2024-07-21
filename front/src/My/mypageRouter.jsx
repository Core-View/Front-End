import Mypage from '../My/my_main';
import Mymodify from '../My/my_modify';
import Myposting from '../My/my_posting';
import Mycomment from '../My/my_comment';
import Mylike from '../My/my_like';

const mypageRouter = {
  path: 'my',
  children: [
    { path: 'main', element: <Mypage /> },
    { path: 'modify', element: <Mymodify /> },
    { path: 'posting', element: <Myposting /> },
    { path: 'comment', element: <Mycomment /> },
    { path: 'like', element: <Mylike /> },
  ],
};

export default mypageRouter;
