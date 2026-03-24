import React from 'react';
import type { QuestionCategory } from '../types/question';
import { useQuestion } from '../context/QuestionContext';

const categories: Array<{ value: QuestionCategory | 'all'; label: string; icon: string }> = [
  { value: 'all', label: '全部', icon: '📚' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'html', label: 'HTML', icon: '📄' },
  { value: 'algorithm', label: '算法', icon: '🔢' },
  { value: 'performance', label: '性能', icon: '⚡' },
  { value: 'browser', label: '浏览器', icon: '🌐' },
  { value: 'engineering', label: '工程化', icon: '🔧' },
];

const CategoryFilter: React.FC = () => {
  const { setCategory, state } = useQuestion();
  const { currentCategory, userProgress } = state;

  // 获取每个分类的题目数量
  const getCategoryCount = (category: QuestionCategory | 'all'): number => {
    if (category === 'all') {
      return userProgress.totalQuestions;
    }
    
    // 这里可以根据实际数据计算每个分类的题目数量
    // 简化实现，返回估算值
    const categoryMap: Record<QuestionCategory, number> = {
      react: 3,
      javascript: 3,
      css: 2,
      html: 1,
      algorithm: 2,
      performance: 1,
      browser: 1,
      engineering: 1,
    };
    
    return categoryMap[category] || 0;
  };

  // 处理分类切换
  const handleCategoryChange = (category: QuestionCategory | 'all') => {
    setCategory(category);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">题目分类</h3>
        <p className="text-sm text-gray-600">选择您想练习的技术分类</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
              currentCategory === category.value
                ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className={`font-medium text-sm ${
              currentCategory === category.value ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {category.label}
            </div>
            <div className={`text-xs mt-1 ${
              currentCategory === category.value ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {getCategoryCount(category.value)} 题
            </div>
          </button>
        ))}
      </div>
      
      {/* 当前分类信息 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">当前分类：</span>
            <span className="text-sm font-medium text-gray-900 ml-1">
              {categories.find(c => c.value === currentCategory)?.label || '全部'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            共 {getCategoryCount(currentCategory)} 题
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
