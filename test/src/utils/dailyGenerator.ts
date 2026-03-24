import type { Question } from '../types/question';
import questionsDataRaw from '../data/questions.json';

const questionsData = questionsDataRaw as Question[];

/**
 * 基于日期生成哈希值（确保同一天生成相同的题目）
 */
function generateDateHash(date: Date): number {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  let hash = 0;
  
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为 32 位整数
  }
  
  return Math.abs(hash);
}

/**
 * 生成每日题目
 * @param date 指定日期，默认为今天
 * @returns 每日题目
 */
export function generateDailyQuestion(date: Date = new Date()): Question {
  const hash = generateDateHash(date);
  const index = hash % questionsData.length;
  
  return questionsData[index];
}

/**
 * 获取今日题目（带缓存逻辑）
 */
export function getTodayQuestion(): Question {
  return generateDailyQuestion(new Date());
}

/**
 * 获取指定日期的题目
 * @param dateString 日期字符串 (YYYY-MM-DD)
 */
export function getQuestionByDate(dateString: string): Question {
  const date = new Date(dateString);
  return generateDailyQuestion(date);
}

/**
 * 获取过去几天的题目历史
 * @param days 天数
 */
export function getQuestionHistory(days: number = 7): Array<{ date: string; question: Question }> {
  const history = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dateStr = date.toISOString().split('T')[0];
    const question = generateDailyQuestion(date);
    
    history.push({
      date: dateStr,
      question,
    });
  }
  
  return history;
}

/**
 * 检查是否是周末（周六或周日）
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * 生成周末特别题目（难度较高的题目）
 */
export function generateWeekendQuestion(date: Date = new Date()): Question {
  // 筛选高难度题目
  const hardQuestions = questionsData.filter(q => q.difficulty === 'hard');
  
  if (hardQuestions.length === 0) {
    return generateDailyQuestion(date);
  }
  
  const hash = generateDateHash(date);
  const index = hash % hardQuestions.length;
  
  return hardQuestions[index];
}

/**
 * 获取智能每日题目（工作日和周末不同）
 */
export function getSmartDailyQuestion(date: Date = new Date()): Question {
  if (isWeekend(date)) {
    return generateWeekendQuestion(date);
  }
  
  return generateDailyQuestion(date);
}
