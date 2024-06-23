import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Common
import Header from './Common/Header';
import Footer from './Common/Footer';
// Home
import Main from './Home/home_main';
// My
import Mypage from './My/my_main';
import Mymodify from './My/my_modify';
import Myposting from './My/my_posting';
import Mycomment from './My/my_comment';
import Mylike from './My/my_like';
// Sign
import SignIn from './Sign/Sign_in/signin_main';
import SignUp from './Sign/Sign_up/signup_main';
// Ranking
import Ranking from './Ranking/contribution_ranking';
// Post
import Post from './Post/post_main';
import PostMainNotification from './Post/post_main_notification';
import PostView from './Post/post_view';
import PostWrite from './Post/post_write';
// Admin
import Admin from './Admin/Admin_main';
import AdminCheck from './Admin/Admin_check';
import AdminNotice from './Admin/Admin_notice';
import AdminNoticeView from './Admin/Admin_notice_view';
import AdminNoticePost from './Admin/Admin_notice_create';
import AdminNoticeUpdate from './Admin/Admin_notice_update';

//test
import Alarm from './Common/Alarm';
import FindPwd from './Sign/Sign_in/Find_pwd';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Header />
        <div className="main-content">
          <div className="content">
            <Routes>
              <Route path="/" element={<Main />} />
              {/* admin  */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/check" element={<AdminCheck />} />
              <Route path="/notice" element={<AdminNotice />} />
              <Route path="/notice/view/:id" element={<AdminNoticeView />} />
              <Route path="/notice/post" element={<AdminNoticePost />} />
              <Route
                path="/notice/modify/:id"
                element={<AdminNoticeUpdate />}
              />
              {/* my  */}
              <Route path="my_main" element={<Mypage />} />
              <Route path="my_modify" element={<Mymodify />} />
              <Route path="my_posting" element={<Myposting />} />
              <Route path="my_comment" element={<Mycomment />} />
              {/* ranking  */}
              <Route path="/contribution_ranking" element={<Ranking />} />
              <Route path="my_like" element={<Mylike />} />
              {/* post  */}
              <Route path="/post_main" element={<Post />} />
              <Route
                path="/post_notification"
                element={<PostMainNotification />}
              />
              <Route path="/post_view/:post_id" element={<PostView />} />
              <Route path="post_write" element={<PostWrite />} />
              {/* user  */}
              <Route path="users">
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="al" element={<Alarm />} />
                <Route path="find-pwd" element={<FindPwd />} />
              </Route>
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
