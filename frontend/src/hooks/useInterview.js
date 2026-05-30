import { useState, useCallback } from 'react';
import { analyzeAnswer } from '../utils/api';

export function useInterview(questions, type) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers,      setAnswers]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [feedback,     setFeedback]     = useState(null);

  const submit = useCallback(async (answer) => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeAnswer({ question: questions[currentIndex], answer, type });
      setFeedback(result);
      setAnswers((prev) => [
        ...prev,
        { question: questions[currentIndex], answer, feedback: result },
      ]);
      return result;
    } finally {
      setLoading(false);
    }
  }, [currentIndex, questions, type]);

  const next = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setFeedback(null);
  }, []);

  const isComplete = currentIndex >= questions.length;

  return { currentIndex, answers, loading, feedback, submit, next, isComplete };
}