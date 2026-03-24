import React, { useState } from 'react';
import type { Answer } from '../types/question';

interface AnswerSectionProps {
  answer: Answer;
  isVisible: boolean;
  onToggle: () => void;
}

const AnswerSection: React.FC<AnswerSectionProps> = ({ answer, isVisible, onToggle }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  // 复制代码到剪贴板
  const copyCode = async () => {
    if (!answer.codeExample) return;
    
    try {
      await navigator.clipboard.writeText(answer.codeExample);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="mt-8">
      {/* 答案切换按钮 */}
      <div className="flex justify-center">
        <button
          onClick={onToggle}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
            isVisible
              ? 'bg-gray-500 hover:bg-gray-600 text-white'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
          }`}
        >
          {isVisible ? (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              收起答案
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              查看答案解析
            </span>
          )}
        </button>
      </div>

      {/* 答案内容 */}
      {isVisible && (
        <div className="mt-6 animate-fadeIn">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            {/* 答案概述 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                答案概述
              </h3>
              <p className="text-gray-700 leading-relaxed">{answer.text}</p>
            </div>

            {/* 详细解析 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                详细解析
              </h3>
              <p className="text-gray-700 leading-relaxed">{answer.explanation}</p>
            </div>

            {/* 代码示例 */}
            {answer.codeExample && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    代码示例
                  </h3>
                  <button
                    onClick={copyCode}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      copiedCode
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {copiedCode ? (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        已复制
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        复制代码
                      </span>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono">
                    <code>{answer.codeExample}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* 提示和技巧 */}
            {answer.tips && answer.tips.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  提示与技巧
                </h3>
                <ul className="space-y-2">
                  {answer.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 参考资料 */}
            {answer.references && answer.references.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  参考资料
                </h3>
                <ul className="space-y-2">
                  {answer.references.map((reference, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-500 mr-2">🔗</span>
                      <a
                        href={reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
                      >
                        {reference}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerSection;
