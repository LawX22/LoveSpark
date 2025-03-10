import React, { useState, useEffect } from 'react';

const CoupleCardGenerator = () => {
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

  // Question categories
  const categories = [
    { id: 'romantic', name: 'Romantic', emoji: '❤️' },
    { id: 'fun', name: 'Fun & Playful', emoji: '😄' },
    { id: 'deep', name: 'Deep Connection', emoji: '✨' },
    { id: 'future', name: 'Future Plans', emoji: '🔮' },
    { id: 'memories', name: 'Memories', emoji: '📸' },
  ];

  // Question banks by category
  const questionBanks = {
    romantic: [
      "What's your favorite memory of us together?",
      "When did you first realize you were falling in love with me?",
      "What's one small thing I do that makes you feel loved?",
      "What do you think is the most romantic thing we've ever done?",
      "How do you feel when we're apart for a long time?",
      "What's your favorite way to spend time with me?",
      "What's one thing you'd like us to do more often?",
      "What's the most romantic gift you've ever received from me?",
      "What's your favorite thing about our relationship?",
      "What's one thing you'd like to improve in our relationship?",
    ],
    fun: [
      "If we could go on any adventure together, where would you want to go?",
      "What's the funniest thing that's ever happened to us?",
      "If we could switch lives for a day, what would you do?",
      "What's your favorite inside joke between us?",
      "What's the most fun date we've ever been on?",
      "If we could have any superpower together, what would it be?",
      "What's your favorite game or activity to do together?",
      "What's the silliest thing we've ever done together?",
      "If we could have a movie night, what would we watch?",
      "What's your favorite way to make me laugh?",
    ],
    deep: [
      "What's one thing you've always wanted to tell me but haven't?",
      "What do you think is the strongest part of our relationship?",
      "What's one thing you admire most about me?",
      "What's one thing you think we need to work on together?",
      "What's your biggest fear about our relationship?",
      "What's one thing you'd like to achieve together in the next year?",
      "What's the most meaningful moment we've shared?",
      "What's one thing you'd like to learn about me?",
      "What's one thing you'd like me to understand about you?",
      "What's your favorite way we support each other?",
    ],
    future: [
      "Where do you see us in 5 years?",
      "What's one dream you'd like us to achieve together?",
      "What's your ideal way to spend our future vacations?",
      "What's one thing you'd like us to build or create together?",
      "What's your vision for our future family?",
      "What's one place you'd like us to visit together?",
      "What's one goal you'd like us to work towards?",
      "What's your favorite thing about planning a future with me?",
      "What's one thing you'd like us to learn together?",
      "What's your favorite way to imagine our future?",
    ],
    memories: [
      "What's your favorite memory of us from the past year?",
      "What's the first thing you remember about us?",
      "What's your favorite photo of us and why?",
      "What's one memory that always makes you smile?",
      "What's the most unforgettable moment we've shared?",
      "What's one memory you'd like to relive?",
      "What's your favorite trip we've taken together?",
      "What's one memory that makes you feel proud of us?",
      "What's your favorite way we've celebrated something together?",
      "What's one memory you'd like to create in the future?",
    ],
  };

  // Generate random question cards
  const generateCards = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCards = [];
      const categoryQuestions = questionBanks[selectedCategory];
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

  return (
    <div className="flex flex-col items-center w-full max-w-4xl p-4 mx-auto bg-gray-50 rounded-lg">
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
      {isModalOpen && (
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