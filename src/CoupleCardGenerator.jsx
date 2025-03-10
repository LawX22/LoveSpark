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
      // Add more questions as needed
    ],
    // Add other categories as needed
  };

  // Generate random question cards
  const generateCards = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCards = [];
      const categoryQuestions = questionBanks[selectedCategory];
      const questionCount = Math.min(customOptions.questionCount, categoryQuestions.length);

      const indices = new Set();
      while (indices.size < questionCount) {
        indices.add(Math.floor(Math.random() * categoryQuestions.length));
      }

      indices.forEach((index) => {
        const question = categoryQuestions[index];
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