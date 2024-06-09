import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// header 여서 안나왔는데 Header 로 고쳐서 나옵니다 이제
// Common
import Header from "./Common/Header";
import Sidebar from "./Common/Sidebar";
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
// Admin
import Admin from "./Admin/Admin_main";
import AdminNotice from "./Admin/Admin_notice";
import AdminNoticeView from "./Admin/Admin_notice_view";
import AdminNoticePost from "./Admin/Admin_notice_create";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Sidebar />
        <Routes>
          {/* admin  */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/notice" element={<AdminNotice />} />
          <Route path="/notice/view/:notice_id" element={<AdminNoticeView />} />
          <Route path="/notice/post" element={<AdminNoticePost />} />
          {/* admin  */}
          <Route path="/" element={<Main />} />
          <Route path="my_main" element={<Mypage />} />
          <Route path="my_modify" element={<Mymodify />} />
          <Route path="post_main" element={<Post />} />
          <Route path="post_code" element={<CodeEditor />} />
          <Route path="post-view" element={<PostView />} />
          <Route path="users">
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
