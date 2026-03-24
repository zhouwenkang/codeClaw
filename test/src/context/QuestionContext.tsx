import React, { createContext, useContext, useReducer } from 'react';
import type { Question, AppState, QuestionCategory, UserProgress } from '../types/question';
import questionsDataRaw from '../data/questions.json';

// 类型断言：将 JSON 数据断言为 Question[] 类型
const questionsData = questionsDataRaw as Question[];

// 定义 Action 类型
interface SetQuestionAction {
  type: 'SET_QUESTION';
  payload: Question;
}

interface SetCategoryAction {
  type: 'SET_CATEGORY';
  payload: QuestionCategory | 'all';
}

interface ToggleAnswerAction {
  type: 'TOGGLE_ANSWER';
}

interface SetDailyQuestionAction {
  type: 'SET_DAILY_QUESTION';
  payload: string;
}

interface SetLoadingAction {
  type: 'SET_LOADING';
  payload: boolean;
}

interface SetErrorAction {
  type: 'SET_ERROR';
  payload: string | null;
}

interface MarkAsAnsweredAction {
  type: 'MARK_AS_ANSWERED';
  payload: string;
}

interface ToggleFavoriteAction {
  type: 'TOGGLE_FAVORITE';
  payload: string;
}

interface LoadUserProgressAction {
  type: 'LOAD_USER_PROGRESS';
  payload: UserProgress;
}

// 合并所有 Action 类型
export type QuestionAction =
  | SetQuestionAction
  | SetCategoryAction
  | ToggleAnswerAction
  | SetDailyQuestionAction
  | SetLoadingAction
  | SetErrorAction
  | MarkAsAnsweredAction
  | ToggleFavoriteAction
  | LoadUserProgressAction;

// 初始状态
const initialState: AppState = {
  currentQuestion: null,
  currentCategory: 'all',
  isAnswerVisible: false,
  userProgress: {
    totalQuestions: questionsData.length,
    answeredQuestions: [],
    favoriteQuestions: [],
    correctAnswers: [],
    answerRecords: [],
    streakDays: 0,
  },
  dailyQuestionId: null,
  isLoading: false,
  error: null,
};

// Reducer 函数
const questionReducer = (state: AppState, action: QuestionAction): AppState => {
  switch (action.type) {
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
        isAnswerVisible: false,
        isLoading: false,
        error: null,
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload,
      };

    case 'TOGGLE_ANSWER':
      return {
        ...state,
        isAnswerVisible: !state.isAnswerVisible,
      };

    case 'SET_DAILY_QUESTION':
      return {
        ...state,
        dailyQuestionId: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'MARK_AS_ANSWERED':
      const isAlreadyAnswered = state.userProgress.answeredQuestions.includes(action.payload);
      if (isAlreadyAnswered) {
        return state;
      }
      
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          answeredQuestions: [...state.userProgress.answeredQuestions, action.payload],
        },
      };

    case 'TOGGLE_FAVORITE':
      const isFavorite = state.userProgress.favoriteQuestions.includes(action.payload);
      const updatedFavorites = isFavorite
        ? state.userProgress.favoriteQuestions.filter(id => id !== action.payload)
        : [...state.userProgress.favoriteQuestions, action.payload];
      
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          favoriteQuestions: updatedFavorites,
        },
      };

    case 'LOAD_USER_PROGRESS':
      return {
        ...state,
        userProgress: action.payload,
      };

    default:
      return state;
  }
};

// Context 接口
interface QuestionContextType {
  state: AppState;
  setQuestion: (question: Question) => void;
  setCategory: (category: QuestionCategory | 'all') => void;
  toggleAnswer: () => void;
  setDailyQuestion: (questionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markAsAnswered: (questionId: string) => void;
  toggleFavorite: (questionId: string) => void;
  loadUserProgress: (progress: UserProgress) => void;
  getQuestionsByCategory: () => Question[];
  getNextQuestion: (currentId: string) => Question | null;
  getPreviousQuestion: (currentId: string) => Question | null;
}

// 创建 Context
const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// Provider 组件
export const QuestionProvider: React.FC<import('../types/question').QuestionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, initialState);

  // Action creators
  const setQuestion = (question: Question) => {
    dispatch({ type: 'SET_QUESTION', payload: question });
  };

  const setCategory = (category: QuestionCategory | 'all') => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const toggleAnswer = () => {
    dispatch({ type: 'TOGGLE_ANSWER' });
  };

  const setDailyQuestion = (questionId: string) => {
    dispatch({ type: 'SET_DAILY_QUESTION', payload: questionId });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const markAsAnswered = (questionId: string) => {
    dispatch({ type: 'MARK_AS_ANSWERED', payload: questionId });
  };

  const toggleFavorite = (questionId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: questionId });
  };

  const loadUserProgress = (progress: UserProgress) => {
    dispatch({ type: 'LOAD_USER_PROGRESS', payload: progress });
  };

  // 工具函数：根据当前分类获取题目列表
  const getQuestionsByCategory = (): Question[] => {
    if (state.currentCategory === 'all') {
      return questionsData;
    }
    return questionsData.filter(q => q.category === state.currentCategory);
  };

  // 工具函数：获取下一题
  const getNextQuestion = (currentId: string): Question | null => {
    const questions = getQuestionsByCategory();
    const currentIndex = questions.findIndex(q => q.id === currentId);
    
    if (currentIndex === -1 || currentIndex >= questions.length - 1) {
      return null;
    }
    
    return questions[currentIndex + 1];
  };

  // 工具函数：获取上一题
  const getPreviousQuestion = (currentId: string): Question | null => {
    const questions = getQuestionsByCategory();
    const currentIndex = questions.findIndex(q => q.id === currentId);
    
    if (currentIndex <= 0) {
      return null;
    }
    
    return questions[currentIndex - 1];
  };

  // Context value
  const contextValue: QuestionContextType = {
    state,
    setQuestion,
    setCategory,
    toggleAnswer,
    setDailyQuestion,
    setLoading,
    setError,
    markAsAnswered,
    toggleFavorite,
    loadUserProgress,
    getQuestionsByCategory,
    getNextQuestion,
    getPreviousQuestion,
  };

  return (
    <QuestionContext.Provider value={contextValue}>
      {children}
    </QuestionContext.Provider>
  );
};

// 自定义 Hook：使用 Question Context
export const useQuestion = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  
  if (context === undefined) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  
  return context;
};

export default QuestionContext;
