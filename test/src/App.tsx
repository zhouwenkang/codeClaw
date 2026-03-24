import React, { useEffect, useState } from 'react';
import { QuestionProvider, useQuestion } from './context/QuestionContext';
import type { Question } from './types/question';
import { getTodayQuestion } from './utils/dailyGenerator';
import { Storage } from './utils/storage';
import { useQuestionHistory } from './hooks/useQuestionHistory';

// 导入组件
import QuestionCard from './components/QuestionCard';
import AnswerSection from './components/AnswerSection';
import Navigation from './components/Navigation';
import CategoryFilter from './components/CategoryFilter';
import DailyQuestion from './components/DailyQuestion';

// 主应用组件
const AppContent: React.FC = () => {
  const {
    state,
    setQuestion,
    toggleAnswer,
    setLoading,
    setError,
    markAsAnswered,
  } = useQuestion();
  
  const { userProgress, currentQuestion, isAnswerVisible, isLoading, error } = state;
  useQuestionHistory(); // 初始化历史记录
  const [initialized, setInitialized] = useState(false);

  // 初始化应用
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        
        // 获取今日题目作为初始题目
        const todayQuestion = getTodayQuestion();
        setQuestion(todayQuestion);
        
        // 保存每日题目ID
        Storage.saveDailyQuestionId(todayQuestion.id);
        
        setInitialized(true);
      } catch (err) {
        setError('应用初始化失败，请刷新页面重试');
        console.error('App initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [setQuestion, setLoading, setError]);

  // 处理题目切换
  const handleQuestionChange = (question: Question) => {
    setQuestion(question);
  };

  // 处理答案显示/隐藏
  const handleToggleAnswer = () => {
    toggleAnswer();
    
    // 如果显示答案，标记为已答
    if (!isAnswerVisible && currentQuestion) {
      markAsAnswered(currentQuestion.id);
    }
  };

  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">正在加载题目...</h2>
          <p className="text-gray-600">请稍候，正在为您准备面试题目</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
                  <h1 className="text-xl font-bold text-gray-900">前端面试题</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>题目 {userProgress.answeredQuestions.length}/{userProgress.totalQuestions}</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>收藏 {userProgress.favoriteQuestions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Question Section */}
        <section className="mb-8">
          <DailyQuestion onQuestionClick={handleQuestionChange} />
        </section>

        {/* Category Filter Section */}
        <section className="mb-8">
          <CategoryFilter />
        </section>

        {/* Question Display Section */}
        {currentQuestion ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Question Card */}
            <div className="lg:col-span-2">
              <QuestionCard 
                question={currentQuestion} 
                showActions={true}
              />
              
              {/* Answer Section */}
              <AnswerSection
                answer={currentQuestion.answer}
                isVisible={isAnswerVisible}
                onToggle={handleToggleAnswer}
              />
              
              {/* Navigation */}
              <Navigation currentQuestion={currentQuestion} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Progress Stats */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">学习进度</h3>
                  
                  {/* 进度条 */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>总进度</span>
                      <span>{Math.round((userProgress.answeredQuestions.length / userProgress.totalQuestions) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(userProgress.answeredQuestions.length / userProgress.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* 统计数据 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">已答题</span>
                      <span className="font-medium">{userProgress.answeredQuestions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">收藏题</span>
                      <span className="font-medium">{userProgress.favoriteQuestions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">连续天数</span>
                      <span className="font-medium">{userProgress.streakDays} 天</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">💡 学习建议</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      每天坚持答题，保持学习连贯性
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      理解答案解析，而不仅是记住答案
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      收藏难题，定期复习巩固
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      动手实践代码示例，加深理解
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无题目</h3>
            <p className="text-gray-600">请选择分类或等待题目加载</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>前端面试题练习平台 © 2024</p>
            <p className="mt-1">帮助开发者系统性地准备前端技术面试</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// 包装在 Provider 中的主应用
function App() {
  return (
    <QuestionProvider>
      <AppContent />
    </QuestionProvider>
  );
}

export default App
