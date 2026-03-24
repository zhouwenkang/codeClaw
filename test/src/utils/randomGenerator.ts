import type { Question } from '../types/question';
import questionsDataRaw from '../data/questions.json';

const questionsData = questionsDataRaw as Question[];

/**
 * 生成随机整数（包含 min，不包含 max）
 */
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 随机生成一道题目（不重复）
 * @param excludeIds 要排除的题目 ID 列表
 * @returns 随机题目
 */
export function generateRandomQuestion(excludeIds: string[] = []): Question {
  // 过滤掉已排除的题目
  const availableQuestions = questionsData.filter(q => !excludeIds.includes(q.id));
  
  if (availableQuestions.length === 0) {
    // 如果没有可用题目，返回所有题目中的随机一题
    const randomIndex = getRandomInt(0, questionsData.length);
    return questionsData[randomIndex];
  }
  
  const randomIndex = getRandomInt(0, availableQuestions.length);
  return availableQuestions[randomIndex];
}

/**
 * 批量生成随机题目
 * @param count 生成的题目数量
 * @param excludeIds 要排除的题目 ID 列表
 */
export function generateRandomQuestions(count: number, excludeIds: string[] = []): Question[] {
  const availableQuestions = questionsData.filter(q => !excludeIds.includes(q.id));
  
  if (availableQuestions.length < count) {
    console.warn(`Only ${availableQuestions.length} questions available, requested ${count}`);
    return availableQuestions;
  }
  
  // Fisher-Yates 洗牌算法
  const shuffled = [...availableQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}

/**
 * 根据分类随机生成题目
 * @param category 题目分类
 * @param excludeIds 要排除的题目 ID 列表
 */
export function generateRandomQuestionByCategory(
  category: string,
  excludeIds: string[] = []
): Question | null {
  const filteredQuestions = questionsData.filter(
    q => q.category === category && !excludeIds.includes(q.id)
  );
  
  if (filteredQuestions.length === 0) {
    return null;
  }
  
  const randomIndex = getRandomInt(0, filteredQuestions.length);
  return filteredQuestions[randomIndex];
}

/**
 * 根据难度随机生成题目
 * @param difficulty 题目难度
 * @param excludeIds 要排除的题目 ID 列表
 */
export function generateRandomQuestionByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
  excludeIds: string[] = []
): Question | null {
  const filteredQuestions = questionsData.filter(
    q => q.difficulty === difficulty && !excludeIds.includes(q.id)
  );
  
  if (filteredQuestions.length === 0) {
    return null;
  }
  
  const randomIndex = getRandomInt(0, filteredQuestions.length);
  return filteredQuestions[randomIndex];
}

/**
 * 生成随机的题目列表，支持按分类和难度筛选
 * @param options 生成选项
 */
interface GenerateRandomQuestionsOptions {
  count?: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  excludeIds?: string[];
}

export function generateRandomQuestionsWithFilter(
  options: GenerateRandomQuestionsOptions = {}
): Question[] {
  const {
    count = 1,
    category,
    difficulty,
    excludeIds = [],
  } = options;
  
  let filteredQuestions = questionsData.filter(q => !excludeIds.includes(q.id));
  
  // 按分类筛选
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  // 按难度筛选
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (filteredQuestions.length === 0) {
    return [];
  }
  
  // 如果需要的数量大于可用数量，返回所有可用题目
  if (filteredQuestions.length <= count) {
    return filteredQuestions;
  }
  
  // Fisher-Yates 洗牌算法
  const shuffled = [...filteredQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}

/**
 * 生成随机的练习集
 * @param total 总题数
 * @param difficultyDistribution 难度分布 {easy: 数量, medium: 数量, hard: 数量}
 */
export function generatePracticeSet(
  total: number = 10,
  difficultyDistribution?: { easy: number; medium: number; hard: number }
): Question[] {
  if (!difficultyDistribution) {
    // 默认分布：简单 40%，中等 40%，困难 20%
    difficultyDistribution = {
      easy: Math.floor(total * 0.4),
      medium: Math.floor(total * 0.4),
      hard: Math.floor(total * 0.2),
    };
    
    // 调整总数（由于四舍五入可能少一两题）
    const actualTotal = Object.values(difficultyDistribution).reduce((sum, count) => sum + count, 0);
    if (actualTotal < total) {
      difficultyDistribution.hard += total - actualTotal;
    }
  }
  
  const { easy, medium, hard } = difficultyDistribution;
  const questions: Question[] = [];
  
  // 生成各个难度的题目
  const easyQuestions = generateRandomQuestionsWithFilter({
    count: easy,
    difficulty: 'easy',
  });
  questions.push(...easyQuestions);
  
  const mediumQuestions = generateRandomQuestionsWithFilter({
    count: medium,
    difficulty: 'medium',
    excludeIds: questions.map(q => q.id),
  });
  questions.push(...mediumQuestions);
  
  const hardQuestions = generateRandomQuestionsWithFilter({
    count: hard,
    difficulty: 'hard',
    excludeIds: questions.map(q => q.id),
  });
  questions.push(...hardQuestions);
  
  // 随机打乱最终列表
  for (let i = questions.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i + 1);
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  return questions;
}
