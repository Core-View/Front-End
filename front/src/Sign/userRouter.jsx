import React from 'react';
import SignIn from '../Sign/Sign_in/signin_main';
import SignUp from '../Sign/Sign_up/signup_main';
import FindPwd from '../Sign/Sign_in/Find_pwd';
const userRouter = {
  path: 'users',
  children: [
    { path: 'sign-in', element: <SignIn /> },
    { path: 'sign-up', element: <SignUp /> },
    { path: 'find-pwd', element: <FindPwd /> },
  ],
};
export default userRouter;
