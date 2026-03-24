/**
 * 面试题分类类型
 */
export type QuestionCategory = 'react' | 'javascript' | 'css' | 'html' | 'algorithm' | 'performance' | 'browser' | 'engineering';

/**
 * 面试题难度等级
 */
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

/**
 * 答案选项类型（用于选择题）
 */
export type AnswerOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

/**
 * 答案解析类型
 */
export type Answer = {
  text: string;
  explanation: string;
  codeExample?: string;
  tips?: string[];
  references?: string[];
};

/**
 * 面试题主体类型
 */
export type Question = {
  id: string;
  title: string;
  description: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  tags: string[];
  type: 'multiple-choice' | 'open-ended' | 'coding';
  options?: AnswerOption[];
  answer: Answer;
  createdAt: string;
  updatedAt?: string;
  isFavorite?: boolean;
  viewCount?: number;
};

/**
 * 用户答题记录类型
 */
export type UserAnswerRecord = {
  questionId: string;
  answeredAt: string;
  isCorrect?: boolean;
  userAnswer?: string;
  timeSpent?: number;
};

/**
 * 用户学习进度类型
 */
export type UserProgress = {
  totalQuestions: number;
  answeredQuestions: string[];
  favoriteQuestions: string[];
  correctAnswers: string[];
  answerRecords: UserAnswerRecord[];
  lastStudyDate?: string;
  streakDays: number;
};

/**
 * 应用状态类型
 */
export type AppState = {
  currentQuestion: Question | null;
  currentCategory: QuestionCategory | 'all';
  isAnswerVisible: boolean;
  userProgress: UserProgress;
  dailyQuestionId: string | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Context Provider Props 类型
 */
import type { ReactNode } from 'react';

export type QuestionProviderProps = {
  children: ReactNode;
};
