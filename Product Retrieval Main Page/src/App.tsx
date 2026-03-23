import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './lib/LanguageContext';

// 用全局语言 Provider 包裹整个路由，确保所有页面共享同一语言状态
// Wrap the entire router with global language Provider so all pages share the same language state
export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
