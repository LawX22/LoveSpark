import React, { useState } from 'react';

const CoupleDashboard = ({ onNavigate }) => {
  const [hoverOption, setHoverOption] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-pink-600 mb-4">Couple Connect</h1>
          <p className="text-lg text-gray-700">Choose an activity to strengthen your relationship</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card Generator Option */}
          <div 
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform cursor-pointer ${hoverOption === 'cards' ? 'scale-105 shadow-lg' : ''}`}
            onMouseEnter={() => setHoverOption('cards')}
            onMouseLeave={() => setHoverOption(null)}
            onClick={() => onNavigate('cards')}
          >
            <div className="bg-pink-500 h-40 flex justify-center items-center">
              <span className="text-6xl">❤️</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Couple Cards</h2>
              <p className="text-gray-600 mb-4">Generate conversation cards to deepen your connection with thoughtful questions across various categories.</p>
              <div className="flex space-x-2">
                <span className="inline-block bg-pink-100 text-pink-600 text-xs font-medium rounded-full px-2 py-1">Romantic</span>
                <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium rounded-full px-2 py-1">Fun</span>
                <span className="inline-block bg-purple-100 text-purple-600 text-xs font-medium rounded-full px-2 py-1">Deep</span>
              </div>
            </div>
          </div>

          {/* Fast Talk Option */}
          <div 
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform cursor-pointer ${hoverOption === 'fastTalk' ? 'scale-105 shadow-lg' : ''}`}
            onMouseEnter={() => setHoverOption('fastTalk')}
            onMouseLeave={() => setHoverOption(null)}
            onClick={() => onNavigate('fastTalk')}
          >
            <div className="bg-blue-500 h-40 flex justify-center items-center">
              <span className="text-6xl">⏱️</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Fast Talk</h2>
              <p className="text-gray-600 mb-4">Quick-fire questions with a timer to spark spontaneous conversations and create memorable moments.</p>
              <div className="flex space-x-2">
                <span className="inline-block bg-green-100 text-green-600 text-xs font-medium rounded-full px-2 py-1">Timed</span>
                <span className="inline-block bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full px-2 py-1">Spontaneous</span>
                <span className="inline-block bg-red-100 text-red-600 text-xs font-medium rounded-full px-2 py-1">Fun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-pink-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">5 Question Categories</h3>
                <p className="text-gray-600">Explore different aspects of your relationship.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Timed Conversations</h3>
                <p className="text-gray-600">Adjustable timers for quick or in-depth talks.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Personalized Experience</h3>
                <p className="text-gray-600">Customize cards with colors and styles.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Question Library</h3>
                <p className="text-gray-600">Hundreds of curated questions for couples.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ready to strengthen your relationship?</p>
          <button 
            onClick={() => onNavigate('cards')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoupleDashboard;