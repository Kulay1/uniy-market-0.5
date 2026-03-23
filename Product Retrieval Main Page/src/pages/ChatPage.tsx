import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Send, Image as ImageIcon, Paperclip, MoreVertical, CheckCircle, Phone, Video } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { mockProducts } from '../lib/mockData';
import { Language, translate } from '../lib/i18n';
import { useLanguage } from '../lib/LanguageContext';

interface Message {
  id: string;
  // 消息内容保持原样，不随语言切换翻译 / Message content stays as-is, never auto-translated on language switch
  text: string;
  sender: 'user' | 'seller';
  timestamp: Date;
  read?: boolean;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [message, setMessage] = useState('');
  // 从全局 Context 读取语言，确保与主页同步 / Read language from global Context, in sync with homepage
  const { language, setLanguage } = useLanguage();
  const t = (key: any) => translate(language, key);

  // 当前选中的消息 ID（用于显示翻译浮层）/ Currently selected message ID (for translation popover)
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

  // 聊天消息列表（内容固定，不随语言切换变化）/ Chat messages (content fixed, not affected by language switch)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m interested in this item. Is it still available?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: '2',
      text: 'Yes! It\'s still available. Would you like to see more photos?',
      sender: 'seller',
      timestamp: new Date(Date.now() - 3000000),
      read: true,
    },
    {
      id: '3',
      text: 'That would be great! Also, is the price negotiable?',
      sender: 'user',
      timestamp: new Date(Date.now() - 2400000),
      read: true,
    },
    {
      id: '4',
      text: 'Sure, I can send you more photos. And yes, we can discuss the price. What\'s your offer?',
      sender: 'seller',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 根据 sellerId 动态获取卖家信息（用商品 id 匹配）/ Dynamically get seller info based on sellerId (match by product id)
  const sellerProduct = mockProducts.find(p => p.id === sellerId);

  // 统一聊天架构：支持 example-seller 演示入口 / Unified chat: support example-seller demo entry
  const seller = sellerProduct?.seller ?? {
    name: sellerId === 'example-seller' ? 'Example Seller' : 'Seller',
    avatar: '',
    verified: sellerId === 'example-seller',
    role: 'student' as const,
    rating: 5,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 切换语言（Context 内部已处理 localStorage 持久化，仅影响 UI 框架，不翻译消息内容）
  // Switch language (Context handles localStorage persistence, UI only, messages unchanged)
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // 模拟卖家 2 秒后回复 / Simulate seller response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! I\'ll get back to you shortly.',
        sender: 'seller',
        timestamp: new Date(),
        read: false,
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);

    if (hours < 1) {
      return `${minutes}m ${t('mAgo')}`;
    } else if (hours < 24) {
      return `${hours}h ${t('mAgo')}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // 语言显示名称 / Language display name
  const langLabel = language === 'en' ? 'English' : language === 'zh' ? '中文' : 'ไทย';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部栏 / Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={seller.avatar} />
                  <AvatarFallback>{seller.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{seller.name}</span>
                    {seller.verified && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {t(seller.role as any)}
                    </Badge>
                    {/* 在线状态 / Online status */}
                    <span className="text-xs text-green-600">● {t('online')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              {/* 语言切换下拉菜单（仅影响 UI 框架）/ Language switcher (UI framework only) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">{langLabel}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLanguageChange('zh')}>中文</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('th')}>ไทย</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>{t('viewProfile')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('viewListings')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('blockUser')}</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">{t('report')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* 商品上下文（如有）/ Product Context (if available) */}
      {sellerProduct && (
        <div className="bg-blue-50 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src={sellerProduct.image}
                alt={sellerProduct.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{sellerProduct.title}</p>
                <p className="text-blue-600 font-semibold">${sellerProduct.price}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/')}>
                {t('viewItem')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 消息区域 / Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={msg.sender === 'seller' ? seller.avatar : ''} />
                    <AvatarFallback>
                      {msg.sender === 'seller' ? seller.name[0] : 'You'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {/* 消息气泡（点击显示翻译浮层）/ Message bubble (click to show translation popover) */}
                    <div
                      className={`rounded-lg px-4 py-2 cursor-pointer select-none ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white border'
                      }`}
                      onClick={() => setSelectedMsgId(selectedMsgId === msg.id ? null : msg.id)}
                    >
                      {/* 消息内容保持原样，不随语言切换翻译 / Message content stays as-is, not translated on language switch */}
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    {/* 翻译浮层（纯 UI，暂不挂载 API）/ Translation popover (UI only, no API) */}
                    {selectedMsgId === msg.id && (
                      <div className={`mt-1 ${msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
                        <div className="bg-white border rounded-full shadow-md px-3 py-1 flex items-center gap-1 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                          <span>🌐</span>
                          <span>{t('translate')}</span>
                        </div>
                      </div>
                    )}
                    <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                      {msg.sender === 'user' && msg.read && ' • Read'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 安全提示 / Safety Notice */}
      <div className="bg-yellow-50 border-t border-yellow-200">
        <div className="container mx-auto px-4 py-2">
          <p className="text-xs text-yellow-800 text-center">
            ⚠️ <strong>{t('safetyReminder')}:</strong> {t('safetyReminderChat')}
          </p>
        </div>
      </div>

      {/* 输入区域 / Input Area */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <ImageIcon className="w-5 h-5" />
              </Button>
            </div>
            {/* 输入框占位符随语言切换 / Input placeholder follows language */}
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('typeMessage')}
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600"
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">{t('send')}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
