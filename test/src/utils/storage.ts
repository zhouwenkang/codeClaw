import type { UserProgress } from '../types/question';

/**
 * localStorage 封装工具类
 */
export class Storage {
  private static readonly KEYS = {
    USER_PROGRESS: 'question_app_user_progress',
    DAILY_QUESTION: 'question_app_daily_question',
    LAST_VISIT_DATE: 'question_app_last_visit_date',
  };

  /**
   * 保存用户进度到 localStorage
   */
  static saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(this.KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }

  /**
   * 从 localStorage 加载用户进度
   */
  static loadUserProgress(): UserProgress | null {
    try {
      const data = localStorage.getItem(this.KEYS.USER_PROGRESS);
      if (!data) return null;
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load user progress:', error);
      return null;
    }
  }

  /**
   * 保存每日题目 ID
   */
  static saveDailyQuestionId(questionId: string): void {
    try {
      const data = {
        questionId,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      };
      localStorage.setItem(this.KEYS.DAILY_QUESTION, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save daily question:', error);
    }
  }

  /**
   * 获取今日题目 ID
   */
  static getTodayQuestionId(): string | null {
    try {
      const data = localStorage.getItem(this.KEYS.DAILY_QUESTION);
      if (!data) return null;
      
      const { questionId, date } = JSON.parse(data);
      const today = new Date().toISOString().split('T')[0];
      
      // 检查是否是今天的题目
      if (date === today) {
        return questionId;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get today question:', error);
      return null;
    }
  }

  /**
   * 保存最后访问日期
   */
  static saveLastVisitDate(): void {
    try {
      localStorage.setItem(this.KEYS.LAST_VISIT_DATE, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save last visit date:', error);
    }
  }

  /**
   * 获取最后访问日期
   */
  static getLastVisitDate(): Date | null {
    try {
      const dateStr = localStorage.getItem(this.KEYS.LAST_VISIT_DATE);
      if (!dateStr) return null;
      
      return new Date(dateStr);
    } catch (error) {
      console.error('Failed to get last visit date:', error);
      return null;
    }
  }

  /**
   * 检查是否是连续访问
   */
  static isConsecutiveVisit(): boolean {
    const lastVisit = this.getLastVisitDate();
    if (!lastVisit) return false;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // 检查最后访问日期是否是昨天
    return lastVisit.toDateString() === yesterday.toDateString();
  }

  /**
   * 清除所有数据
   */
  static clearAll(): void {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

/**
 * 防抖函数（用于优化频繁触发的操作）
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * 节流函数（用于限制函数执行频率）
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
