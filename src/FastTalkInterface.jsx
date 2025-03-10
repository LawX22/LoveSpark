import React, { useState, useEffect } from 'react';

const FastTalkInterface = ({ onBackToDashboard }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [timerPerQuestion, setTimerPerQuestion] = useState(60); // Default 60 seconds
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

  // Handle timer countdown
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
        
        // Warning when time is running low (less than 10 seconds)
        if (timeRemaining <= 10) {
          setTimeExpired(false);
        }
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      clearInterval(interval);
      
      // Time's up for current question
      setTimeExpired(true);
      setCardGlowEffect('red-glow');
      
      // Add to failed questions list
      if (!failedQuestions.includes(currentQuestionIndex)) {
        setFailedQuestions(prev => [...prev, currentQuestionIndex]);
      }
      
      handleTimeUp();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Handle when time is up for a question
  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setTimeout(() => {
        goToNextQuestion();
      }, 1500); // Brief delay to show the red glow
    } else {
      // End of all questions
      setTimeout(() => {
        endSession();
      }, 1500); // Brief delay to show the red glow
    }
  };

  // Go to next question
  const goToNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setTimeRemaining(timerPerQuestion);
    setShowQuestionModal(true);
    setTimeExpired(false);
    setCardGlowEffect('');
  };

  // End the session
  const endSession = () => {
    setIsActive(false);
    setIsPlaying(false);
    setGameCompleted(true);
  };

  // Handle question submission
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.trim() !== '') {
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
      setNewQuestion('');
    }
  };

  // Remove a question
  const removeQuestion = (index) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });
  };

  // Start the question session
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

  // Reset the session
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

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer duration options
  const timerOptions = [15, 30, 60, 90, 120];

  // Open timer configuration modal
  const openTimerModal = () => {
    setShowTimerModal(true);
  };

  // Close timer configuration modal
  const closeTimerModal = () => {
    setShowTimerModal(false);
  };

  // Save timer configuration
  const saveTimerConfig = () => {
    const parsedTime = parseInt(timerInput);
    if (!isNaN(parsedTime) && parsedTime > 0) {
      setTimerPerQuestion(parsedTime);
      closeTimerModal();
    } else {
      alert('Please enter a valid time in seconds');
    }
  };

  // Close the question modal and ensure timer is running
  const handleCloseModal = () => {
    setShowQuestionModal(false);
  };

  // Mark question as answered correctly
  const markAsAnswered = () => {
    if (!answeredQuestions.includes(currentQuestionIndex)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredQuestions(prevAnswered => [...prevAnswered, currentQuestionIndex]);
      
      // Remove from failed questions if it was there
      setFailedQuestions(prev => prev.filter(idx => idx !== currentQuestionIndex));
      
      // Set the green glow effect
      setCardGlowEffect('green-glow');
      
      // Remove the glow effect after a delay
      setTimeout(() => {
        // Automatically go to the next question after marking as answered
        if (currentQuestionIndex < questions.length - 1) {
          goToNextQuestion();
        } else {
          // End of all questions
          endSession();
        }
      }, 1500); // Allow time to see the green glow
    }
  };

  // Show current question in modal
  const showCurrentQuestion = () => {
    setShowQuestionModal(true);
  };

  // Skip to next question
  const nextQuestion = () => {
    // If it wasn't answered yet, mark it as failed
    if (!answeredQuestions.includes(currentQuestionIndex) && !failedQuestions.includes(currentQuestionIndex)) {
      setFailedQuestions(prev => [...prev, currentQuestionIndex]);
      setCardGlowEffect('red-glow');
      
      // Delay going to next question to show the red effect
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          goToNextQuestion();
        } else {
          // End of all questions
          endSession();
        }
      }, 1500); // Allow time to see the red glow
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        goToNextQuestion();
      } else {
        // End of all questions
        endSession();
      }
    }
  };

  // Get feedback message based on score percentage
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
    <div className="flex flex-col items-center w-full max-w-4xl p-4 mx-auto bg-white rounded-xl shadow-md">
      {/* CSS for glow effects */}
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
      `}</style>
    
      {/* Back button */}
      <button 
        onClick={onBackToDashboard}
        className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Dashboard
      </button>
      
      <h1 className="mb-6 text-3xl font-bold text-center text-pink-600">Couples Fast Talk</h1>
      <p className="text-center text-gray-600 mb-8">Add questions for your partner to answer. Deepen your connection with quick, meaningful conversations.</p>

      {isConfiguring ? (
        <>
          {/* Question Input */}
          <form onSubmit={handleAddQuestion} className="w-full mb-6">
            <div className="flex">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type a question for your partner..."
                className="flex-grow px-3 py-3 text-gray-700 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 font-semibold text-white bg-pink-500 rounded-r-lg transition-all hover:bg-pink-600 active:transform active:scale-95"
              >
                Add
              </button>
            </div>
          </form>

          {/* Questions List */}
          <div className="w-full mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Questions ({questions.length})</h2>
            <div className="max-h-64 overflow-y-auto">
              {questions.length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">No questions yet. Try some relationship-building questions!</p>
              ) : (
                <ul className="space-y-2">
                  {questions.map((q, index) => (
                    <li key={index} className="p-3 bg-white rounded-lg border border-gray-100 flex justify-between items-center">
                      <div className="flex flex-grow">
                        <span className="mr-2 text-pink-500 font-medium">{index + 1}.</span>
                        <span>{q}</span>
                      </div>
                      <button 
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-700"
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

          {/* Timer Display (now just a button to open the modal) */}
          <div className="w-full mb-8 flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Time Per Question</h2>
              <p className="text-gray-600 mt-1">Currently set to: <span className="font-medium text-pink-600">{timerPerQuestion} seconds</span></p>
            </div>
            <button
              onClick={openTimerModal}
              className="px-4 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Configure Timer
            </button>
          </div>

          {/* Start Button */}
          <button
            onClick={startSession}
            className={`px-6 py-3 mb-8 text-lg font-semibold text-white rounded-lg shadow-md transition-all ${
              questions.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 active:transform active:scale-95'
            }`}
            disabled={questions.length === 0}
          >
            Start Couples Fast Talk
          </button>
        </>
      ) : (
        <>
          {/* Timer Display */}
          <div className="w-full mb-6 p-4 flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-sm">
            <div className="flex justify-between w-full mb-2">
              <p className="text-lg font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <p className="text-lg font-medium text-green-600">
                Connection: {score}/{questions.length}
              </p>
            </div>
            <div className={`text-4xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-pink-500'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Question Status Indicators */}
          <div className="w-full mb-4 flex justify-center">
            <div className="flex space-x-2">
              {questions.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-3 h-3 rounded-full ${
                    currentQuestionIndex === idx ? 'bg-pink-500 animate-pulse' : 
                    answeredQuestions.includes(idx) ? 'bg-green-500' : 
                    failedQuestions.includes(idx) ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6 justify-center w-full">
            <button
              onClick={showCurrentQuestion}
              className="px-6 py-3 font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-all flex-1 max-w-xs"
              disabled={!isActive}
            >
              View Question
            </button>
            
            <button
              onClick={nextQuestion}
              className="px-6 py-3 font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-all flex-1 max-w-xs"
              disabled={!isActive}
            >
              Skip Question
            </button>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center mb-6">
            <button
              onClick={resetSession}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
            >
              End Session
            </button>
          </div>
        </>
      )}

      {/* Timer Configuration Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full transform transition-all">
            <h2 className="text-xl font-bold text-pink-600 mb-4">Configure Timer</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time per question (seconds)</label>
              <input
                type="number"
                value={timerInput}
                onChange={(e) => setTimerInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Quick options:</p>
              <div className="flex flex-wrap gap-2">
                {timerOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setTimerInput(option.toString())}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                      parseInt(timerInput) === option
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                    }`}
                  >
                    {option}s
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Your partner will have this much time to answer each question. Make it challenging but fun!
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={saveTimerConfig}
                className="flex-1 px-4 py-2 font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-all"
              >
                Save
              </button>
              <button
                onClick={closeTimerModal}
                className="flex-1 px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestionModal && isPlaying && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`bg-white p-8 rounded-xl shadow-lg max-w-lg w-full transform transition-all ${cardGlowEffect}`}>
            {/* Timer in Modal */}
            <div className="p-4 rounded-lg mb-6 flex flex-col items-center bg-gray-100">
              <p className="text-lg font-medium text-gray-700 mb-1">Time Remaining</p>
              <div className={`text-4xl font-bold ${
                timeRemaining <= 10 ? 'text-red-500' : 'text-pink-500'
              }`}>
                {timeExpired ? "00:00" : formatTime(timeRemaining)}
              </div>
              {timeExpired && (
                <p className="text-red-500 font-medium mt-2">Time's up!</p>
              )}
              {cardGlowEffect === 'green-glow' && (
                <p className="text-green-500 font-medium mt-2">Great answer!</p>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-pink-600 mb-3">Question {currentQuestionIndex + 1} of {questions.length}</h2>
            <p className="text-2xl mb-6 p-4 rounded-lg border-l-4 bg-gray-50 border-pink-500">
              {questions[currentQuestionIndex]}
            </p>
            
            {/* Modal buttons arranged horizontally */}
            <div className="flex space-x-3 mb-4">
              <button
                onClick={() => {
                  markAsAnswered();
                }}
                className={`px-6 py-3 font-semibold text-white rounded-lg transition-all flex-1 ${
                  cardGlowEffect === 'green-glow' || answeredQuestions.includes(currentQuestionIndex)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={cardGlowEffect === 'green-glow' || answeredQuestions.includes(currentQuestionIndex)}
              >
                Answered
              </button>
              
              <button
                onClick={() => {
                  handleCloseModal();
                  nextQuestion();
                }}
                className="px-6 py-3 font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-all flex-1"
              >
                Skip
              </button>
              
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Completed Modal */}
      {gameCompleted && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full transform transition-all">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Couple's Fast Talk Completed!</h2>
            
            {/* Score with visual percentage */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xl">Connection Score: {score}/{questions.length}</p>
                <p className="text-lg font-medium">
                  {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-pink-500 h-4 rounded-full" 
                  style={{ width: `${questions.length > 0 ? (score / questions.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            {/* Questions summary */}
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Questions Summary:</p>
              <div className="flex justify-between text-sm">
                <p className="text-green-600">Answered: {answeredQuestions.length}</p>
                <p className="text-red-600">Missed: {failedQuestions.length}</p>
              </div>
            </div>
            
            {/* Feedback message based on percentage */}
            <p className="text-gray-700 mb-6 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
              {getFeedbackMessage()}
            </p>
            
            <button
              onClick={resetSession}
              className="px-6 py-3 font-semibold text-white bg-pink-500 rounded-lg shadow-md hover:bg-pink-600 transition-all w-full"
            >
              Back to Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FastTalkInterface;