import React, { useState, useEffect } from 'react';
import { fetchQuestions } from './api/questionsService';

const CoupleCardGenerator = ({ onBackToDashboard }) => {
  const [cards, setCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('romantic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customOptions, setCustomOptions] = useState({
    includeEmojis: true,
    cardColor: '#ff6b6b',
    fontSize: 'medium',
    questionCount: 3,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [questions, setQuestions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories definition
  const categories = [
    { id: 'romantic', name: 'Romantic', emoji: '❤️' },
    { id: 'fun', name: 'Fun & Playful', emoji: '😄' },
    { id: 'deep', name: 'Deep Connection', emoji: '✨' },
    { id: 'future', name: 'Future Plans', emoji: '🔮' },
    { id: 'memories', name: 'Memories', emoji: '📸' },
  ];

  // Fetch questions when component mounts
  useEffect(() => {
    const loadAllQuestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const questionsData = {};
        
        for (const category of categories) {
          const data = await fetchQuestions(category.id);
          questionsData[category.id] = data.questions;
        }
        
        setQuestions(questionsData);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Failed to load questions. Please try again later.");
        setIsLoading(false);
      }
    };
    
    loadAllQuestions();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.querySelector('.modal-content');
      if (modal && !modal.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  // Generate random question cards
  const generateCards = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCards = [];
      const categoryQuestions = questions[selectedCategory] || [];
      const questionCount = Math.min(customOptions.questionCount, categoryQuestions.length);

      // Shuffle the questions array to get random questions
      const shuffledQuestions = [...categoryQuestions].sort(() => Math.random() - 0.5);

      // Slice the shuffled array to get the desired number of questions
      const selectedQuestions = shuffledQuestions.slice(0, questionCount);

      selectedQuestions.forEach((question) => {
        newCards.push({
          id: Date.now() + Math.random(),
          question: question,
          emoji: customOptions.includeEmojis ? categories.find((c) => c.id === selectedCategory).emoji : '',
          color: customOptions.cardColor,
          fontSize: customOptions.fontSize,
        });
      });

      setCards(newCards);
      setIsGenerating(false);
      setIsModalOpen(true); // Open the modal after generating cards
      setCurrentCardIndex(0); // Reset to the first card
    }, 800);
  };

  // Get font size in pixels based on selection
  const getFontSize = (size) => {
    switch (size) {
      case 'small':
        return '16px';
      case 'medium':
        return '20px';
      case 'large':
        return '24px';
      default:
        return '20px';
    }
  };

  // Navigate to the next card
  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  // Navigate to the previous card
  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl p-4 mx-auto bg-gray-50 rounded-lg">
        <button 
          onClick={onBackToDashboard}
          className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Couple Love Cards</h1>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error && !Object.keys(questions).length) {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl p-4 mx-auto bg-gray-50 rounded-lg">
        <button 
          onClick={onBackToDashboard}
          className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Couple Love Cards</h1>
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          <p>Error loading questions: {error}</p>
          <p className="mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl p-4 mx-auto bg-gray-50 rounded-lg">
      <button 
        onClick={onBackToDashboard}
        className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Dashboard
      </button>

      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Couple Love Cards</h1>

      {/* Category Selection */}
      <div className="w-full mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Choose Question Type</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-pink-100'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl">{category.emoji}</span>
                <span className="mt-1 text-sm font-medium">{category.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Customization Options */}
      <div className="w-full mb-8 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Customize Your Cards</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Emoji toggle */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={customOptions.includeEmojis}
                onChange={() => setCustomOptions({ ...customOptions, includeEmojis: !customOptions.includeEmojis })}
                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-gray-700">Include Emojis</span>
            </label>
          </div>

          {/* Card color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
            <div className="flex space-x-2">
              {['#ff6b6b', '#4ecdc4', '#ffbe0b', '#8a2be2', '#ff85a2'].map((color) => (
                <button
                  key={color}
                  onClick={() => setCustomOptions({ ...customOptions, cardColor: color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    customOptions.cardColor === color ? 'border-gray-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Font size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
            <select
              value={customOptions.fontSize}
              onChange={(e) => setCustomOptions({ ...customOptions, fontSize: e.target.value })}
              className="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Number of questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
            <select
              value={customOptions.questionCount}
              onChange={(e) => setCustomOptions({ ...customOptions, questionCount: parseInt(e.target.value) })}
              className="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            >
              {[1, 2, 3, 5, 7, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateCards}
        disabled={isGenerating}
        className={`px-6 py-3 mb-8 text-lg font-semibold text-white bg-pink-500 rounded-lg shadow-md transition-all ${
          isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-600 active:transform active:scale-95'
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Love Cards'}
      </button>

      {/* Modal for Card Display */}
      {isModalOpen && cards.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            {/* Card Content */}
            <div
              className="p-8 text-center rounded-t-lg"
              style={{ backgroundColor: cards[currentCardIndex].color }}
            >
              {cards[currentCardIndex].emoji && (
                <span className="text-4xl">{cards[currentCardIndex].emoji}</span>
              )}
              <p
                className="mt-6 font-medium text-white"
                style={{ fontSize: getFontSize(cards[currentCardIndex].fontSize) }}
              >
                {cards[currentCardIndex].question}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between p-4 bg-gray-100 rounded-b-lg">
              <button
                onClick={prevCard}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Previous
              </button>
              <span className="flex items-center text-gray-700">
                {currentCardIndex + 1} / {cards.length}
              </span>
              <button
                onClick={nextCard}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupleCardGenerator;