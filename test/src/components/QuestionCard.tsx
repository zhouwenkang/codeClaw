import React from 'react';
import type { Question, QuestionDifficulty, QuestionCategory } from '../types/question';
import { useQuestion } from '../context/QuestionContext';

interface QuestionCardProps {
  question: Question;
  showActions?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, showActions = true }) => {
  const { toggleFavorite, markAsAnswered, state } = useQuestion();
  const { userProgress } = state;
  
  const isFavorite = userProgress.favoriteQuestions.includes(question.id);
  const isAnswered = userProgress.answeredQuestions.includes(question.id);

  // 获取难度样式
  const getDifficultyStyles = (difficulty: QuestionDifficulty): string => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取分类标签样式
  const getCategoryStyles = (category: QuestionCategory): string => {
    const categoryStyles: Record<QuestionCategory, string> = {
      react: 'bg-blue-100 text-blue-800',
      javascript: 'bg-yellow-100 text-yellow-800',
      css: 'bg-pink-100 text-pink-800',
      html: 'bg-orange-100 text-orange-800',
      algorithm: 'bg-purple-100 text-purple-800',
      performance: 'bg-indigo-100 text-indigo-800',
      browser: 'bg-cyan-100 text-cyan-800',
      engineering: 'bg-teal-100 text-teal-800',
    };
    
    return categoryStyles[category] || 'bg-gray-100 text-gray-800';
  };

  // 处理收藏按钮点击
  const handleToggleFavorite = () => {
    toggleFavorite(question.id);
  };

  // 处理标记为已答
  const handleMarkAsAnswered = () => {
    if (!isAnswered) {
      markAsAnswered(question.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* 卡片头部 */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {question.title}
            </h2>
            
            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyStyles(question.difficulty)}`}>
                {question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难'}
              </span>
              
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryStyles(question.category)}`}>
                {question.category.toUpperCase()}
              </span>
              
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* 收藏按钮 */}
          {showActions && (
            <button
              onClick={handleToggleFavorite}
              className={`ml-4 p-2 rounded-lg transition-colors duration-200 ${
                isFavorite
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              }`}
              aria-label={isFavorite ? '取消收藏' : '收藏'}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 题目内容 */}
      <div className="px-6 py-6">
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-base leading-relaxed">{question.description}</p>
          
          {/* 题目类型提示 */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">题目类型：</span>
              {question.type === 'multiple-choice' ? '选择题' : 
               question.type === 'open-ended' ? '开放题' : '编程题'}
            </p>
          </div>
        </div>

        {/* 选项（如果是选择题） */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="mt-6 space-y-3">
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  onClick={handleMarkAsAnswered}
                />
                <span className="ml-3 text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 卡片底部 */}
      {showActions && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 答题状态 */}
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isAnswered ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className={`text-sm ${isAnswered ? 'text-green-700' : 'text-gray-500'}`}>
                  {isAnswered ? '已答' : '未答'}
                </span>
              </div>
              
              {/* 题目 ID */}
              <span className="text-xs text-gray-400">ID: {question.id}</span>
            </div>
            
            <div className="text-xs text-gray-400">
              浏览次数: {question.viewCount || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(QuestionCard);
