import React, { useState, useEffect } from 'react';

const FastTalkInterface = ({ onBackToDashboard }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [timerPerQuestion, setTimerPerQuestion] = useState(60);
  const [timerInput, setTimerInput] = useState('60');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [failedQuestions, setFailedQuestions] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [cardGlowEffect, setCardGlowEffect] = useState('');
  
  // Sample question suggestions to inspire users
  const questionSuggestions = [
    "What's your favorite memory of us together?",
    "What small thing do I do that makes you smile?",
    "If we could travel anywhere right now, where would you want to go?",
    "What's one thing you want us to try together this year?",
    "What was your first impression of me?",
    "What's something I do that you find adorable?",
    "If you could change one thing about our relationship, what would it be?",
    "What's one thing you've always wanted to tell me but haven't?",
  ];

  // Handle timer countdown
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
        
        if (timeRemaining <= 10) {
          setTimeExpired(false);
        }
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      clearInterval(interval);
      
      setTimeExpired(true);
      setCardGlowEffect('red-glow');
      
      if (!failedQuestions.includes(currentQuestionIndex)) {
        setFailedQuestions(prev => [...prev, currentQuestionIndex]);
      }
      
      handleTimeUp();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        goToNextQuestion();
      }, 1500);
    } else {
      setTimeout(() => {
        endSession();
      }, 1500);
    }
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setTimeRemaining(timerPerQuestion);
    setShowQuestionModal(true);
    setTimeExpired(false);
    setCardGlowEffect('');
  };

  const endSession = () => {
    setIsActive(false);
    setIsPlaying(false);
    setGameCompleted(true);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.trim() !== '') {
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
      setNewQuestion('');
    }
  };

  // Add a suggested question to the list
  const addSuggestedQuestion = (question) => {
    setQuestions(prevQuestions => [...prevQuestions, question]);
  };

  const removeQuestion = (index) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });
  };

  const startSession = () => {
    if (questions.length === 0) {
      alert('Please add at least one question before starting');
      return;
    }
    
    const parsedTime = parseInt(timerInput);
    if (!isNaN(parsedTime) && parsedTime > 0) {
      setTimerPerQuestion(parsedTime);
      setTimeRemaining(parsedTime);
      setCurrentQuestionIndex(0);
      setIsConfiguring(false);
      setIsPlaying(true);
      setIsActive(true);
      setShowQuestionModal(true);
      setScore(0);
      setAnsweredQuestions([]);
      setFailedQuestions([]);
      setGameCompleted(false);
      setTimeExpired(false);
      setCardGlowEffect('');
    } else {
      alert('Please enter a valid time in seconds');
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setIsPlaying(false);
    setTimeRemaining(0);
    setCurrentQuestionIndex(0);
    setIsConfiguring(true);
    setShowQuestionModal(false);
    setScore(0);
    setAnsweredQuestions([]);
    setFailedQuestions([]);
    setGameCompleted(false);
    setTimeExpired(false);
    setCardGlowEffect('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerOptions = [15, 30, 60, 90, 120];

  const openTimerModal = () => {
    setShowTimerModal(true);
  };

  const closeTimerModal = () => {
    setShowTimerModal(false);
  };

  const saveTimerConfig = () => {
    const parsedTime = parseInt(timerInput);
    if (!isNaN(parsedTime) && parsedTime > 0) {
      setTimerPerQuestion(parsedTime);
      closeTimerModal();
    } else {
      alert('Please enter a valid time in seconds');
    }
  };

  const handleCloseModal = () => {
    setShowQuestionModal(false);
  };

  const markAsAnswered = () => {
    if (!answeredQuestions.includes(currentQuestionIndex)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredQuestions(prevAnswered => [...prevAnswered, currentQuestionIndex]);
      
      setFailedQuestions(prev => prev.filter(idx => idx !== currentQuestionIndex));
      
      setCardGlowEffect('green-glow');
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          goToNextQuestion();
        } else {
          endSession();
        }
      }, 1500);
    }
  };

  const showCurrentQuestion = () => {
    setShowQuestionModal(true);
  };

  const nextQuestion = () => {
    if (!answeredQuestions.includes(currentQuestionIndex) && !failedQuestions.includes(currentQuestionIndex)) {
      setFailedQuestions(prev => [...prev, currentQuestionIndex]);
      setCardGlowEffect('red-glow');
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          goToNextQuestion();
        } else {
          endSession();
        }
      }, 1500);
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        goToNextQuestion();
      } else {
        endSession();
      }
    }
  };

  const getFeedbackMessage = () => {
    if (questions.length === 0) return "You didn't answer any questions together.";
    
    const percentage = (score / questions.length) * 100;
    
    if (percentage === 100) {
      return "Perfect score! You two are incredibly in sync!";
    } else if (percentage >= 90) {
      return "Outstanding! You communicate wonderfully together!";
    } else if (percentage >= 80) {
      return "Amazing connection! You really understand each other!";
    } else if (percentage >= 70) {
      return "Great teamwork! Your bond is strong!";
    } else if (percentage >= 60) {
      return "Good chemistry! You're on the right track as a couple!";
    } else if (percentage >= 50) {
      return "You got half right! Keep talking and learning about each other!";
    } else if (percentage >= 40) {
      return "Room for growth, but that's what relationships are about!";
    } else if (percentage >= 30) {
      return "Keep connecting! Every conversation brings you closer!";
    } else if (percentage >= 20) {
      return "Don't give up! Communication takes practice!";
    } else if (percentage > 0) {
      return "You've started your journey together! Keep learning about each other!";
    } else {
      return "Every couple starts somewhere! Try again and enjoy getting to know each other!";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl p-2 sm:p-4 md:p-6 mx-auto bg-gradient-to-b from-white to-pink-50 rounded-xl shadow-lg">
      {/* CSS for effects */}
      <style jsx>{`
        .green-glow {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.7);
          animation: pulseGreen 1s infinite;
          background-color: rgba(16, 185, 129, 0.1);
        }
        
        .red-glow {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.7);
          animation: pulseRed 1s infinite;
          background-color: rgba(239, 68, 68, 0.1);
        }
        
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.8); }
          100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); }
        }
        
        @keyframes pulseRed {
          0% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.8); }
          100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
        }
        
        .question-card {
          transition: all 0.3s ease;
        }
        
        .question-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #f687b3;
          animation: confetti-fall 3s ease-in-out infinite;
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
        }
        
        @media (max-width: 640px) {
          .suggestion-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
            width: 100%;
          }
          
          .action-buttons > button {
            width: 100%;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    
      {/* Header with decorative elements */}
      <div className="relative w-full flex flex-col items-center mb-4 sm:mb-6 md:mb-8">
        <button 
          onClick={onBackToDashboard}
          className="self-start mb-4 sm:mb-6 bg-white text-pink-600 text-sm sm:text-base font-medium py-1 sm:py-2 px-2 sm:px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>
        
        {/* Decorative hearts - hidden on smallest screens */}
        <div className="absolute top-0 left-0 hidden sm:block">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F9A8D4" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 hidden sm:block">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F9A8D4" opacity="0.4" />
          </svg>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-pink-600 mb-2">Couples Fast Talk</h1>
        <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full mb-2 sm:mb-4"></div>
        <p className="text-center text-xs sm:text-sm md:text-base text-gray-600 max-w-lg px-2">Add questions for your partner to answer. Deepen your connection with quick, meaningful conversations.</p>
      </div>

      {isConfiguring ? (
        <>
          {/* Setup Phase UI */}
          <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-600 mb-3 sm:mb-4 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Create Your Questions
            </h2>
            
            {/* Question Input */}
            <form onSubmit={handleAddQuestion} className="w-full mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type a question for your partner..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 border border-pink-200 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-2 sm:mb-0"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg sm:rounded-l-none sm:rounded-r-lg transition-all hover:from-pink-600 hover:to-pink-700 active:transform active:scale-95 shadow-md"
                >
                  Add
                </button>
              </div>
            </form>

            {/* Question Suggestions */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Need inspiration? Try these questions:</h3>
              <div className="flex flex-wrap gap-1 sm:gap-2 suggestion-container">
                {questionSuggestions.slice(0, 4).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => addSuggestedQuestion(question)}
                    className="px-2 sm:px-3 py-1 sm:py-2 text-xxs sm:text-xs text-pink-700 bg-pink-50 rounded-full hover:bg-pink-100 transition-all"
                  >
                    {question}
                  </button>
                ))}
                <button
                  onClick={() => addSuggestedQuestion(questionSuggestions[Math.floor(Math.random() * questionSuggestions.length)])}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-xxs sm:text-xs text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-all"
                >
                  + Random Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="w-full mb-4 sm:mb-6 p-2 sm:p-5 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Your Questions 
                <span className="ml-2 text-xs sm:text-sm bg-pink-100 text-pink-800 py-0.5 sm:py-1 px-1 sm:px-2 rounded-full">
                  {questions.length}
                </span>
              </h2>
              <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                {questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-sm sm:text-base text-gray-500 text-center mb-1 sm:mb-2">No questions yet</p>
                    <p className="text-xs sm:text-sm text-gray-400 text-center">Add questions above or select from our suggestions</p>
                  </div>
                ) : (
                  <ul className="space-y-2 sm:space-y-3">
                    {questions.map((q, index) => (
                      <li key={index} className="p-2 sm:p-3 bg-white rounded-lg border border-gray-100 shadow-sm flex justify-between items-center question-card text-xs sm:text-sm">
                        <div className="flex items-center flex-grow overflow-hidden">
                          <span className="flex-shrink-0 flex items-center justify-center min-w-6 sm:min-w-8 h-6 sm:h-8 mr-2 sm:mr-3 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm font-semibold">{index + 1}</span>
                          <span className="text-gray-700 truncate">{q}</span>
                        </div>
                        <button 
                          onClick={() => removeQuestion(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-1 sm:ml-2 flex-shrink-0"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Timer Configuration */}
            <div className="w-full mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-5 bg-gray-50 rounded-lg shadow-sm">
              <div className="mb-2 sm:mb-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Time Per Question
                </h2>
                <div className="flex items-center mt-1 sm:mt-2">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full text-base sm:text-xl font-bold mr-2 sm:mr-3">
                    {timerPerQuestion}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">seconds to answer each question</p>
                </div>
              </div>
              <button
                onClick={openTimerModal}
                className="px-3 sm:px-4 py-1 sm:py-2 text-sm text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all flex items-center justify-center shadow-md mt-2 sm:mt-0"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Configure
              </button>
            </div>

            {/* Start Button */}
            <button
              onClick={startSession}
              className={`w-full px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-8 text-base sm:text-lg font-semibold text-white rounded-lg shadow-lg transition-all ${
                questions.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 active:transform active:scale-98'
              }`}
              disabled={questions.length === 0}
            >
              {questions.length === 0 ? (
                "Add Questions to Start"
              ) : (
                <>
                  <span className="mr-1 sm:mr-2">Start Couples Fast Talk</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Game Phase UI */}
          <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            {/* Timer Display */}
            <div className="w-full mb-4 sm:mb-6 p-2 sm:p-4 flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between w-full mb-2 sm:mb-4 gap-2 sm:gap-0">
                <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm sm:text-base text-gray-700">Time Remaining</span>
                </div>
                <div className={`text-2xl sm:text-3xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-pink-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className={`h-2 sm:h-3 rounded-full transition-all duration-1000 ease-linear ${
                    timeRemaining <= 10 ? 'bg-red-500' : 'bg-pink-500'
                  }`}
                  style={{ width: `${(timeRemaining / timerPerQuestion) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question Display */}
            <div className={`w-full mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-md border-2 border-pink-100 ${cardGlowEffect} transition-all duration-300`}>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-600 mb-2 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <p className="text-base sm:text-lg text-gray-700">{questions[currentQuestionIndex]}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 action-buttons">
              <button
                onClick={markAsAnswered}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Correct Answer
              </button>
              <button
                onClick={nextQuestion}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Skip Question
              </button>
            </div>
          </div>
        </>
      )}

      {/* Timer Configuration Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-pink-600 mb-4">Set Timer Duration</h2>
            <input
              type="number"
              value={timerInput}
              onChange={(e) => setTimerInput(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-700 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
              placeholder="Enter time in seconds"
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {timerOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => setTimerInput(time.toString())}
                  className="px-3 sm:px-4 py-1 sm:py-2 text-sm text-pink-700 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all"
                >
                  {time} seconds
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeTimerModal}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveTimerConfig}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Completion Modal */}
      {gameCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-pink-600 mb-4">Game Completed!</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">{getFeedbackMessage()}</p>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              You answered {score} out of {questions.length} questions correctly.
            </p>
            <button
              onClick={resetSession}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FastTalkInterface;