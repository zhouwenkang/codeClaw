import React, { useEffect, useState } from 'react';
import type { Question } from '../types/question';
import { getTodayQuestion } from '../utils/dailyGenerator';
import { Storage } from '../utils/storage';
import { useQuestion } from '../context/QuestionContext';

interface DailyQuestionProps {
  onQuestionClick?: (question: Question) => void;
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ onQuestionClick }) => {
  const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const { state, setQuestion } = useQuestion();
  const { userProgress } = state;

  useEffect(() => {
    // 获取今日题目
    const todayQuestion = getTodayQuestion();
    setDailyQuestion(todayQuestion);
    
    // 检查是否已答
    const answered = userProgress.answeredQuestions.includes(todayQuestion.id);
    setIsAnswered(answered);
    
    // 保存每日题目ID到localStorage
    Storage.saveDailyQuestionId(todayQuestion.id);
    setIsLoading(false);
  }, [userProgress.answeredQuestions]);

  // 获取当前日期
  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    return today.toLocaleDateString('zh-CN', options);
  };

  // 处理题目卡片点击
  const handleQuestionClick = () => {
    if (dailyQuestion) {
      if (onQuestionClick) {
        onQuestionClick(dailyQuestion);
      } else {
        setQuestion(dailyQuestion);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-purple-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-purple-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!dailyQuestion) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>今日题目加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">今日一题</h2>
            <p className="text-sm text-gray-600">{getCurrentDate()}</p>
          </div>
        </div>
        
        {isAnswered && (
          <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            已完成
          </div>
        )}
      </div>

      {/* 题目内容预览 */}
      <div className="bg-white rounded-lg p-4 border border-purple-200 cursor-pointer hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={handleQuestionClick}>
            <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
              {dailyQuestion.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {dailyQuestion.description}
            </p>
            
            <div className="flex items-center mt-3 space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                dailyQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                dailyQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {dailyQuestion.difficulty === 'easy' ? '简单' :
                 dailyQuestion.difficulty === 'medium' ? '中等' : '困难'}
              </span>
              
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {dailyQuestion.category.toUpperCase()}
              </span>
              
              <span className="text-xs text-gray-500">
                浏览: {dailyQuestion.viewCount || 0}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleQuestionClick}
            className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
          >
            <span>开始答题</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {userProgress.totalQuestions}
          </div>
          <div className="text-xs text-gray-600">总题数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {userProgress.answeredQuestions.length}
          </div>
          <div className="text-xs text-gray-600">已答题</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">
            {userProgress.favoriteQuestions.length}
          </div>
          <div className="text-xs text-gray-600">收藏题</div>
        </div>
      </div>

      {/* 连续答题天数 */}
      {userProgress.streakDays > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <span className="text-sm font-medium text-orange-800">
              连续答题 <span className="font-bold">{userProgress.streakDays}</span> 天
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuestion;
