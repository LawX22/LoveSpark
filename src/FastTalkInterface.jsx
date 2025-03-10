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
    <div className="flex flex-col items-center w-full max-w-4xl p-6 mx-auto bg-gradient-to-b from-white to-pink-50 rounded-xl shadow-lg">
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
      `}</style>
    
      {/* Header with decorative elements */}
      <div className="relative w-full flex flex-col items-center mb-8">
        <button 
          onClick={onBackToDashboard}
          className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
        
        {/* Decorative hearts */}
        <div className="absolute top-0 left-0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F9A8D4" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-0 right-0">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F9A8D4" opacity="0.4" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">Couples Fast Talk</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full mb-4"></div>
        <p className="text-center text-gray-600 max-w-lg">Add questions for your partner to answer. Deepen your connection with quick, meaningful conversations.</p>
      </div>

      {isConfiguring ? (
        <>
          {/* Setup Phase UI */}
          <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-pink-600 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Create Your Questions
            </h2>
            
            {/* Question Input */}
            <form onSubmit={handleAddQuestion} className="w-full mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type a question for your partner..."
                  className="flex-grow px-4 py-3 text-gray-700 border border-pink-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-r-lg transition-all hover:from-pink-600 hover:to-pink-700 active:transform active:scale-95 shadow-md"
                >
                  Add
                </button>
              </div>
            </form>

            {/* Question Suggestions */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Need inspiration? Try these questions:</h3>
              <div className="flex flex-wrap gap-2">
                {questionSuggestions.slice(0, 4).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => addSuggestedQuestion(question)}
                    className="px-3 py-2 text-xs text-pink-700 bg-pink-50 rounded-full hover:bg-pink-100 transition-all"
                  >
                    {question}
                  </button>
                ))}
                <button
                  onClick={() => addSuggestedQuestion(questionSuggestions[Math.floor(Math.random() * questionSuggestions.length)])}
                  className="px-3 py-2 text-xs text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-all"
                >
                  + Random Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="w-full mb-6 p-5 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Your Questions 
                <span className="ml-2 text-sm bg-pink-100 text-pink-800 py-1 px-2 rounded-full">
                  {questions.length}
                </span>
              </h2>
              <div className="max-h-64 overflow-y-auto">
                {questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-500 text-center mb-2">No questions yet</p>
                    <p className="text-sm text-gray-400 text-center">Add questions above or select from our suggestions</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {questions.map((q, index) => (
                      <li key={index} className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm flex justify-between items-center question-card">
                        <div className="flex items-center flex-grow">
                          <span className="flex items-center justify-center min-w-8 h-8 mr-3 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold">{index + 1}</span>
                          <span className="text-gray-700">{q}</span>
                        </div>
                        <button 
                          onClick={() => removeQuestion(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <div className="w-full mb-8 flex items-center justify-between p-5 bg-gray-50 rounded-lg shadow-sm">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Time Per Question
                </h2>
                <div className="flex items-center mt-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full text-xl font-bold mr-3">
                    {timerPerQuestion}
                  </div>
                  <p className="text-gray-600">seconds to answer each question</p>
                </div>
              </div>
              <button
                onClick={openTimerModal}
                className="px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all flex items-center shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Configure
              </button>
            </div>

            {/* Start Button */}
            <button
              onClick={startSession}
              className={`w-full px-6 py-4 mb-8 text-lg font-semibold text-white rounded-lg shadow-lg transition-all ${
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
                  <span className="mr-2">Start Couples Fast Talk</span>
                  <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
            {/* Timer Display */}
            <div className="w-full mb-6 p-4 flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-sm">
              <div className="flex justify-between w-full mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-lg font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <p className="text-lg font-medium text-green-600">
                      Score: {score}/{questions.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`py-4 px-8 rounded-full ${timeRemaining <= 10 ? 'bg-red-100' : 'bg-pink-100'} mb-2`}>
                <span className={`text-5xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-pink-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`${timeRemaining <= 10 ? 'bg-red-500' : 'bg-pink-500'} h-2 rounded-full transition-all`}
                  style={{ width: `${(timeRemaining / timerPerQuestion) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Progress Indicators */}
            <div className="w-full mb-6 flex justify-center">
              <div className="flex space-x-2">
                {questions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-8 h-2 rounded-full transition-all ${
                      currentQuestionIndex === idx ? 'bg-pink-500 w-12' : 
                      answeredQuestions.includes(idx) ? 'bg-green-500' : 
                      failedQuestions.includes(idx) ? 'bg-red-400' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6 justify-center w-full">
              <button
                onClick={markAsAnswered}
                className="px-6 py-4 font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Got It!
              </button>
              <button
                onClick={nextQuestion}
                className="px-6 py-4 font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
                Skip / Next
              </button>
            </div>

            {/* Current Question Card */}
            <div className={`w-full p-6 mb-6 bg-white rounded-lg shadow-md ${cardGlowEffect}`}>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Current Question
              </h2>
              <div className="text-center p-8 bg-pink-50 rounded-lg mb-4">
                <p className="text-3xl text-gray-800 font-medium leading-relaxed">
                  {questions[currentQuestionIndex]}
                </p>
              </div>
              {timeExpired && (
                <div className="w-full flex justify-center">
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Time's up! Moving to the next question...
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSession}
              className="px-4 py-2 text-pink-600 border border-pink-300 rounded-lg hover:bg-pink-50 transition-all flex items-center justify-center mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset & Configure New Game
            </button>
          </div>
        </>
      )}

      {/* Game Completed UI */}
      {gameCompleted && (
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col items-center">
            {/* Confetti animation - just adding a few static elements for visualization */}
            <div className="relative w-full h-32">
              <div className="confetti" style={{ left: '10%', animationDelay: '0.2s', backgroundColor: '#F472B6' }}></div>
              <div className="confetti" style={{ left: '20%', animationDelay: '0.5s', backgroundColor: '#38BDF8' }}></div>
              <div className="confetti" style={{ left: '30%', animationDelay: '0.1s', backgroundColor: '#A78BFA' }}></div>
              <div className="confetti" style={{ left: '40%', animationDelay: '0.7s', backgroundColor: '#FB923C' }}></div>
              <div className="confetti" style={{ left: '50%', animationDelay: '0.3s', backgroundColor: '#4ADE80' }}></div>
              <div className="confetti" style={{ left: '60%', animationDelay: '0.6s', backgroundColor: '#F472B6' }}></div>
              <div className="confetti" style={{ left: '70%', animationDelay: '0.2s', backgroundColor: '#38BDF8' }}></div>
              <div className="confetti" style={{ left: '80%', animationDelay: '0.4s', backgroundColor: '#A78BFA' }}></div>
              <div className="confetti" style={{ left: '90%', animationDelay: '0.5s', backgroundColor: '#FB923C' }}></div>
            </div>

            <h2 className="text-3xl font-bold text-center text-pink-600 mb-4">Session Complete!</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full mb-6"></div>
            
            <div className="w-32 h-32 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{score}</div>
                <div className="text-sm">of {questions.length}</div>
              </div>
            </div>
            
            <p className="text-xl text-center text-gray-700 mb-6 max-w-lg">
              {getFeedbackMessage()}
            </p>
            
            <div className="w-full bg-gray-50 rounded-lg p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Question Breakdown</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {questions.map((q, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg flex items-start ${
                      answeredQuestions.includes(index) 
                        ? 'bg-green-50 border border-green-100' 
                        : 'bg-red-50 border border-red-100'
                    }`}
                  >
                    <div 
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        answeredQuestions.includes(index) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-400 text-white'
                      }`}
                    >
                      {answeredQuestions.includes(index) ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        answeredQuestions.includes(index) 
                          ? 'text-green-700' 
                          : 'text-red-700'
                      }`}>
                        Question {index + 1}
                      </p>
                      <p className="text-gray-700">{q}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={resetSession}
                className="px-6 py-3 font-semibold text-pink-600 bg-white border-2 border-pink-500 rounded-lg hover:bg-pink-50 transition-all shadow-md"
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Play Again
              </button>
              <button
                onClick={onBackToDashboard}
                className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Configuration Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Timer Settings</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Time per question (seconds)</label>
              <input
                type="number"
                value={timerInput}
                onChange={(e) => setTimerInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="5"
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {timerOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimerInput(time.toString())}
                    className={`px-3 py-1 text-sm rounded-full transition-all ${
                      parseInt(timerInput) === time
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeTimerModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTimerConfig}
                className="px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default FastTalkInterface;