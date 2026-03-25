import { useEffect, useCallback } from 'react';
import type { UserProgress, UserAnswerRecord } from '../types/question';
import { Storage, debounce } from '../utils/storage';
import { useQuestion } from '../context/QuestionContext';

/**
 * 自定义 Hook：管理答题历史和学习进度
 */
export const useQuestionHistory = () => {
  const { state, loadUserProgress } = useQuestion();
  const { userProgress } = state;

  /**
   * 初始化用户进度（从 localStorage 加载）
   */
  useEffect(() => {
    const savedProgress = Storage.loadUserProgress();
    if (savedProgress) {
      loadUserProgress(savedProgress);
    }
    
    // 检查并更新连续答题天数
    checkAndUpdateStreak();
  }, [loadUserProgress]);

  /**
   * 保存用户进度到 localStorage（防抖优化）
   */
  useEffect(() => {
    const debouncedSave = debounce((progress: UserProgress) => {
      Storage.saveUserProgress(progress);
    }, 1000);
    
    debouncedSave(userProgress);
  }, [userProgress]);

  /**
   * 检查并更新连续答题天数
   */
  const checkAndUpdateStreak = useCallback(() => {
    const lastVisitDate = Storage.getLastVisitDate();
    const today = new Date();
    
    if (lastVisitDate) {
      const diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // 如果距离上次访问超过2天，重置连续天数
      if (diffDays > 2) {
        updateStreakDays(0);
      } else if (diffDays === 2) {
        // 如果是连续访问（昨天访问过），增加连续天数
        const isConsecutive = Storage.isConsecutiveVisit();
        if (isConsecutive) {
          updateStreakDays(userProgress.streakDays + 1);
        }
      }
    }
    
    // 更新最后访问日期
    Storage.saveLastVisitDate();
  }, [userProgress.streakDays]);

  /**
   * 更新连续答题天数
   */
  const updateStreakDays = useCallback((days: number) => {
    const updatedProgress: UserProgress = {
      ...userProgress,
      streakDays: days,
    };
    loadUserProgress(updatedProgress);
  }, [userProgress, loadUserProgress]);

  /**
   * 记录答题
   * @param questionId 题目ID
   * @param isCorrect 是否正确
   * @param userAnswer 用户答案
   * @param timeSpent 用时（秒）
   */
  const recordAnswer = useCallback((
    questionId: string,
    isCorrect?: boolean,
    userAnswer?: string,
    timeSpent?: number
  ) => {
    const record: UserAnswerRecord = {
      questionId,
      answeredAt: new Date().toISOString(),
      isCorrect,
      userAnswer,
      timeSpent,
    };
    
    const updatedProgress: UserProgress = {
      ...userProgress,
      answeredQuestions: [...new Set([...userProgress.answeredQuestions, questionId])],
      answerRecords: [...userProgress.answerRecords, record],
    };
    
    if (isCorrect) {
      updatedProgress.correctAnswers = [...new Set([...userProgress.correctAnswers, questionId])];
    }
    
    loadUserProgress(updatedProgress);
  }, [userProgress, loadUserProgress]);

  /**
   * 获取答题统计
   */
  const getAnswerStats = useCallback(() => {
    const totalAnswered = userProgress.answeredQuestions.length;
    const totalCorrect = userProgress.correctAnswers.length;
    const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
    
    // 分类统计
    const categoryStats: Record<string, { answered: number; correct: number }> = {};
    userProgress.answerRecords.forEach(record => {
      // 这里可以根据题目ID解析分类，简化实现
      const category = record.questionId.split('-')[0];
      if (!categoryStats[category]) {
        categoryStats[category] = { answered: 0, correct: 0 };
      }
      categoryStats[category].answered++;
      if (record.isCorrect) {
        categoryStats[category].correct++;
      }
    });
    
    return {
      totalAnswered,
      totalCorrect,
      accuracy: Math.round(accuracy * 10) / 10,
      categoryStats,
      streakDays: userProgress.streakDays,
      totalFavorites: userProgress.favoriteQuestions.length,
    };
  }, [userProgress]);

  /**
   * 获取最近答题记录
   * @param limit 记录数量限制
   */
  const getRecentRecords = useCallback((limit: number = 10): UserAnswerRecord[] => {
    return [...userProgress.answerRecords]
      .sort((a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime())
      .slice(0, limit);
  }, [userProgress.answerRecords]);

  /**
   * 获取收藏的题目ID列表
   */
  const getFavoriteQuestions = useCallback(() => {
    return userProgress.favoriteQuestions;
  }, [userProgress.favoriteQuestions]);

  /**
   * 检查题目是否已答
   */
  const isQuestionAnswered = useCallback((questionId: string): boolean => {
    return userProgress.answeredQuestions.includes(questionId);
  }, [userProgress.answeredQuestions]);

  /**
   * 检查题目是否收藏
   */
  const isQuestionFavorited = useCallback((questionId: string): boolean => {
    return userProgress.favoriteQuestions.includes(questionId);
  }, [userProgress.favoriteQuestions]);

  /**
   * 重置所有进度
   */
  const resetProgress = useCallback(() => {
    const resetProgress: UserProgress = {
      totalQuestions: userProgress.totalQuestions,
      answeredQuestions: [],
      favoriteQuestions: [],
      correctAnswers: [],
      answerRecords: [],
      streakDays: 0,
    };
    
    loadUserProgress(resetProgress);
    Storage.clearAll();
  }, [userProgress.totalQuestions, loadUserProgress]);

  /**
   * 导出进度数据
   */
  const exportProgress = useCallback(() => {
    const data = {
      userProgress,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-app-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [userProgress]);

  /**
   * 导入进度数据
   */
  const importProgress = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.userProgress) {
          loadUserProgress(data.userProgress);
        }
      } catch (error) {
        console.error('Failed to import progress:', error);
      }
    };
    reader.readAsText(file);
  }, [loadUserProgress]);

  return {
    // 数据
    userProgress,
    
    // 方法
    recordAnswer,
    updateStreakDays,
    getAnswerStats,
    getRecentRecords,
    getFavoriteQuestions,
    isQuestionAnswered,
    isQuestionFavorited,
    resetProgress,
    exportProgress,
    importProgress,
  };
};

export default useQuestionHistory;
