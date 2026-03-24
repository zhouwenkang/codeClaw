import React from 'react';
import type { Question } from '../types/question';
import { useQuestion } from '../context/QuestionContext';
import { generateRandomQuestion } from '../utils/randomGenerator';
import { getTodayQuestion } from '../utils/dailyGenerator';

interface NavigationProps {
  currentQuestion: Question;
}

const Navigation: React.FC<NavigationProps> = ({ currentQuestion }) => {
  const { 
    getNextQuestion, 
    getPreviousQuestion, 
    setQuestion,
    setDailyQuestion,
    state 
  } = useQuestion();
  
  const { currentCategory } = state;

  // 处理上一题
  const handlePrevious = () => {
    const prevQuestion = getPreviousQuestion(currentQuestion.id);
    if (prevQuestion) {
      setQuestion(prevQuestion);
    }
  };

  // 处理下一题
  const handleNext = () => {
    const nextQuestion = getNextQuestion(currentQuestion.id);
    if (nextQuestion) {
      setQuestion(nextQuestion);
    }
  };

  // 处理随机题目
  const handleRandom = () => {
    const randomQuestion = generateRandomQuestion([currentQuestion.id]);
    setQuestion(randomQuestion);
  };

  // 处理每日题目
  const handleDaily = () => {
    const dailyQuestion = getTodayQuestion();
    setQuestion(dailyQuestion);
    setDailyQuestion(dailyQuestion.id);
  };

  // 检查按钮状态
  const hasPrevious = getPreviousQuestion(currentQuestion.id) !== null;
  const hasNext = getNextQuestion(currentQuestion.id) !== null;

  return (
    <div className="mt-8">
      {/* 主控制按钮 */}
      <div className="flex flex-wrap justify-center gap-4">
        {/* 上一题按钮 */}
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
            hasPrevious
              ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          上一题
        </button>

        {/* 每日一题按钮 */}
        <button
          onClick={handleDaily}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          每日一题
        </button>

        {/* 随机题目按钮 */}
        <button
          onClick={handleRandom}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium transition-all duration-300 hover:from-green-600 hover:to-teal-600 hover:shadow-lg flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          随机题目
        </button>

        {/* 下一题按钮 */}
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
            hasNext
              ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          下一题
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* 提示信息 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {currentCategory === 'all' ? (
            <span>显示所有分类的题目</span>
          ) : (
            <span>当前分类：{currentCategory.toUpperCase()}</span>
          )}
        </p>
        {!hasPrevious && (
          <p className="text-xs text-gray-400 mt-1">已经是第一题了</p>
        )}
        {!hasNext && (
          <p className="text-xs text-gray-400 mt-1">已经是最后一题了</p>
        )}
      </div>
    </div>
  );
};

export default Navigation;
