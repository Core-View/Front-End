import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// header 여서 안나왔는데 Header 로 고쳐서 나옵니다 이제
// Common
import Header from "./Common/Header";
// Home
import Main from "./Home/home_main";
// My
import Mypage from "./My/my_main";
import Mymodify from "./My/my_modify";
// Sign
import SignIn from "./Sign/Sign_in/signin_main";
import SignUp from "./Sign/Sign_up/signup_main";
// Post
import Post from "./Post/post_main";
import PostView from "./Post/post_view";
import CodeEditor from "./Post/post_code_editor";
import PostWrite from "./Post/post_write";
// Admin
import Admin from "./Admin/Admin_main";
import AdminNotice from "./Admin/Admin_notice";
import AdminNoticeView from "./Admin/Admin_notice_view";
import AdminNoticePost from "./Admin/Admin_notice_create";
import AdminNoticeUpdate from "./Admin/Admin_notice_update";
//test
import Alarm from "./Common/Alarm";

function App() {
  return (
    <div className="app-container">
      <Router>
        <Header />
        <div className="main-content">
          <div className="content">
            <Routes>
              {/* admin  */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/notice" element={<AdminNotice />} />
              <Route path="/notice/view/:id" element={<AdminNoticeView />} />
              <Route path="/notice/post" element={<AdminNoticePost />} />
              <Route path="/notice/modify" element={<AdminNoticeUpdate />} />
              {/* admin  */}
              <Route path="/" element={<Main />} />
              <Route path="my_main" element={<Mypage />} />
              <Route path="my_modify" element={<Mymodify />} />
              <Route path="post_main" element={<Post />} />
              <Route path="post_code" element={<CodeEditor />} />
              <Route path="post_view" element={<PostView />} />
              <Route path="post_write" element={<PostWrite />} />
              <Route path="users">
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="al" element={<Alarm />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
