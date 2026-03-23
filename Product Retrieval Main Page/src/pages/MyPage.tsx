import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Language, translate } from '../lib/i18n';
import { useLanguage } from '../lib/LanguageContext';

// 用户个人中心页面 / My Page - User Profile Center
export default function MyPage() {
  const navigate = useNavigate();
  // 从全局 Context 读取语言，确保与主页同步 / Read language from global Context, in sync with homepage
  const { language, setLanguage } = useLanguage();
  const t = (key: any) => translate(language, key);

  // 聊天记录显示状态（UI 交互，无后台）/ Chat history visibility state (UI only, no backend)
  const [showChat, setShowChat] = useState(true);
  // 商品显示状态（UI 交互，无后台）/ Product visibility state (UI only, no backend)
  const [showProduct, setShowProduct] = useState(true);

  // 切换语言（Context 内部已处理 localStorage 持久化）/ Switch language (Context handles localStorage persistence)
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏，传入当前语言和切换函数 / Top Navigation Header with current language and switcher */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        userVerified={true}
        unreadMessages={1}
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 个人信息头部（社交风格）/ Profile Header (Social Style) */}
        <div className="bg-white rounded-xl border p-6 mb-6 flex items-center gap-6">
          {/* 用户头像 / User Avatar */}
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
              DU
            </AvatarFallback>
          </Avatar>
          {/* 用户信息：上方用户名加粗，下方邮箱颜色稍淡 / User info: bold name above, muted email below */}
          <div className="flex flex-col justify-center gap-1">
            <p className="text-xl font-bold">Demo User</p>
            <p className="text-sm text-gray-500">demo@university.edu</p>
          </div>
        </div>

        {/* 全宽切换选项卡 / Full-Width Tabs */}
        <Tabs defaultValue="chat-history" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="chat-history" className="flex-1">{t('chatHistory')}</TabsTrigger>
            <TabsTrigger value="my-products" className="flex-1">{t('myProducts')}</TabsTrigger>
          </TabsList>

          {/* 聊天记录选项卡 / Chat History Tab */}
          <TabsContent value="chat-history">
            {showChat ? (
              /* 示例对话条目 / Example Chat Entry */
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-gray-50">
                {/* 点击头像或名称区域跳转聊天 / Click avatar/name area to navigate to chat */}
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate('/chat/example-seller')}
                >
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                      ES
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-sm">Example Seller</p>
                      <span className="text-xs text-gray-400">2m {t('mAgo')}</span>
                    </div>
                    {/* 消息预览 / Message Preview */}
                    <p className="text-sm text-gray-500 truncate">Hi! Is this item still available?</p>
                  </div>
                </div>
                {/* 删除按钮（仅 UI 交互）/ Delete button (UI interaction only) */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => setShowChat(false)}
                >
                  {t('delete')}
                </Button>
              </div>
            ) : (
              /* 已删除空状态 / Empty state after deletion */
              <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-lg border">
                {t('chatHistory')} —
              </div>
            )}
          </TabsContent>

          {/* 我的商品选项卡 / My Products Tab */}
          <TabsContent value="my-products">
            {showProduct ? (
              /* 示例商品条目 / Example Product Entry */
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                {/* 商品图片 / Product Image */}
                <img
                  src="https://images.unsplash.com/photo-1602454252462-3fe9e21cc149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwcHJvJTIwbGFwdG9wfGVufDF8fHx8MTc2MTAzMTU4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="MacBook Pro"
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                {/* 商品信息 / Product Info */}
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">MacBook Pro 2021 M1 Pro 14"</p>
                  <p className="text-blue-600 font-semibold mb-1">$1,200</p>
                  {/* 商品状态标签 / Product Status Badge */}
                  <Badge variant="secondary">
                    <span className="text-green-600">● </span>{t('active')}
                  </Badge>
                </div>
                {/* 下架按钮（仅 UI 交互）/ Unlist button (UI interaction only) */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => setShowProduct(false)}
                >
                  {t('unlist')}
                </Button>
              </div>
            ) : (
              /* 已下架空状态 / Empty state after unlisting */
              <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-lg border">
                {t('myProducts')} —
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
