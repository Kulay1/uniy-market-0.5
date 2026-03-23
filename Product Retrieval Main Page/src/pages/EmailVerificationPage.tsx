import { useState } from 'react';import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Mail } from 'lucide-react';
import { Language, translate } from '../lib/i18n';
import { useLanguage } from '../lib/LanguageContext';

// 邮箱验证页面 / Email Verification Page
export default function EmailVerificationPage() {
  const navigate = useNavigate();
  // 从全局 Context 读取语言，自动继承注册页选择的语言 / Read from global Context, auto-inherits language selected on register page
  const { language } = useLanguage();
  const t = (key: any) => translate(language, key);

  // 验证码输入值 / Verification code input value
  const [code, setCode] = useState('');
  // 加载状态 / Loading state
  const [isLoading, setIsLoading] = useState(false);
  // 错误提示 / Error message
  const [error, setError] = useState('');

  // 处理验证码提交 / Handle verification code submission
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证码必须为 6 位数字 / Code must be 6 digits
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    // 模拟验证通过，跳转主页 / Simulate verification success, navigate to home
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Logo / 品牌标志 */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">🎓</span>
          </div>
          <span className="text-xl font-semibold">Uniy Market</span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            {/* 邮件图标 / Mail Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            {/* 标题和描述自动跟随语言 / Title and description auto-follow language */}
            <CardTitle>{t('verifyYourEmail')}</CardTitle>
            <CardDescription>{t('verifyEmailDesc')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify}>
              <div className="space-y-4">
                {/* 验证码输入框 / Verification Code Input */}
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t('enterCode')}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-lg tracking-widest"
                />
                {/* 错误提示 / Error Message */}
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
                {/* 校园验证说明 / Campus verification note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-700 text-xs">{t('codeExpiry')}</p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {/* 验证按钮 / Verify Button */}
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              onClick={handleVerify}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? t('verifying') : t('verify')}
            </Button>
            {/* 返回登录 / Back to Login */}
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => navigate('/login')}
            >
              {t('backToLogin')}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
