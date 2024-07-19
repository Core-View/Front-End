import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

// Home
import homeRouter from '../Home/homeRouter';
// My
import mypageRouter from '../My/mypageRouter';
// Sign
import userRouter from '../Sign/userRouter';
// Ranking
import rangkingRouter from '../Ranking/rangkingRouter';
// Post
import postRouter from '../Post/postRouter';
// Admin
import adminRouter from '../Admin/adminRouter';
// Error
import Error from '../Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      homeRouter,
      adminRouter,
      mypageRouter,
      rangkingRouter,
      postRouter,
      userRouter,
    ],
  },
]);

export default router;
