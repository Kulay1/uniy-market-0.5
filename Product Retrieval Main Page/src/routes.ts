import { createBrowserRouter } from 'react-router';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import MyPage from './pages/MyPage';
import EmailVerificationPage from './pages/EmailVerificationPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/chat/:sellerId',
    Component: ChatPage,
  },
  {
    // 用户个人中心路由 / My Page route
    path: '/my-page',
    Component: MyPage,
  },
  {
    // 邮箱验证页路由 / Email verification page route
    path: '/verify-email',
    Component: EmailVerificationPage,
  },
]);
