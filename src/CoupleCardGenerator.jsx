import React, { useState, useEffect } from "react";
import { fetchQuestions } from "./api/questionsService";

const CoupleCardGenerator = ({ onBackToDashboard }) => {
  const [cards, setCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("romantic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customOptions, setCustomOptions] = useState({
    includeEmojis: true,
    cardColor: "#ff6b6b",
    fontSize: "medium",
    questionCount: 3,
    cardStyle: "modern",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [questions, setQuestions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);

  // Categories definition with enhanced descriptions
  const categories = [
    {
      id: "romantic",
      name: "Romantic",
      emoji: "❤️",
      description: "Intimate questions to deepen your connection",
    },
    {
      id: "fun",
      name: "Fun & Playful",
      emoji: "😄",
      description: "Lighthearted questions to share laughs together",
    },
    {
      id: "deep",
      name: "Deep Connection",
      emoji: "✨",
      description: "Profound questions about life, values and dreams",
    },
    {
      id: "future",
      name: "Future Plans",
      emoji: "🔮",
      description: "Explore your hopes and aspirations together",
    },
    {
      id: "memories",
      name: "Memories",
      emoji: "📸",
      description: "Reminisce about your shared experiences",
    },
  ];

  // Card style options with visual descriptions
  const cardStyles = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean, bold gradients with smooth shadows",
    },
    {
      id: "vintage",
      name: "Vintage",
      description: "Classic look with aged texture and elegant fonts",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Simple, uncluttered design with essential elements",
    },
    {
      id: "playful",
      name: "Playful",
      description: "Fun patterns and vibrant visual elements",
    },
  ];

  // Color palette with names
  const colorPalette = [
    { color: "#ff6b6b", name: "Rose" },
    { color: "#4ecdc4", name: "Teal" },
    { color: "#ffbe0b", name: "Amber" },
    { color: "#8a2be2", name: "Purple" },
    { color: "#ff85a2", name: "Pink" },
    { color: "#2d3047", name: "Navy" },
    { color: "#4d8c57", name: "Emerald" },
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
      const modal = document.querySelector(".modal-content");
      if (modal && !modal.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  // Generate random question cards
  const generateCards = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCards = [];
      const categoryQuestions = questions[selectedCategory] || [];
      const questionCount = Math.min(
        customOptions.questionCount,
        categoryQuestions.length
      );

      // Shuffle the questions array to get random questions
      const shuffledQuestions = [...categoryQuestions].sort(
        () => Math.random() - 0.5
      );

      // Slice the shuffled array to get the desired number of questions
      const selectedQuestions = shuffledQuestions.slice(0, questionCount);

      selectedQuestions.forEach((question) => {
        newCards.push({
          id: Date.now() + Math.random(),
          question: question,
          emoji: customOptions.includeEmojis
            ? categories.find((c) => c.id === selectedCategory).emoji
            : "",
          color: customOptions.cardColor,
          fontSize: customOptions.fontSize,
          style: customOptions.cardStyle,
          category: selectedCategory,
        });
      });

      setCards(newCards);
      setIsGenerating(false);
      setIsModalOpen(true);
      setCurrentCardIndex(0);
    }, 800);
  };

  // Get font size in pixels based on selection
  const getFontSize = (size) => {
    switch (size) {
      case "small":
        return "16px";
      case "medium":
        return "20px";
      case "large":
        return "24px";
      default:
        return "20px";
    }
  };

  // Get background pattern based on card style
  const getCardBackground = (color, style, category) => {
    // Base styling
    const baseStyle = { backgroundColor: color };

    // Add style-specific details
    switch (style) {
      case "vintage":
        return {
          ...baseStyle,
          backgroundImage: `radial-gradient(circle, ${color}, ${adjustColor(
            color,
            -20
          )})`,
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.2)",
          border: "4px double rgba(255,255,255,0.3)",
        };
      case "minimalist":
        return {
          ...baseStyle,
          backgroundImage: "none",
          boxShadow: "none",
          border: `2px solid ${adjustColor(color, -30)}`,
        };
      case "playful":
        return {
          ...baseStyle,
          backgroundImage: `linear-gradient(45deg, ${color} 25%, ${adjustColor(
            color,
            15
          )} 25%, ${adjustColor(
            color,
            15
          )} 50%, ${color} 50%, ${color} 75%, ${adjustColor(color, 15)} 75%)`,
          backgroundSize: "24px 24px",
          boxShadow: `0 8px 20px rgba(0,0,0,0.2), 0 0 0 8px ${adjustColor(
            color,
            -10
          )}`,
        };
      case "modern":
      default:
        return {
          ...baseStyle,
          backgroundImage: `linear-gradient(135deg, ${color}, ${adjustColor(
            color,
            -30
          )})`,
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        };
    }
  };

  // Adjust color brightness (positive val = lighter, negative val = darker)
  const adjustColor = (color, amount) => {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
              16
            )
          ).substr(-2)
        )
    );
  };

  // Get font styling based on card style
  const getFontStyling = (style) => {
    switch (style) {
      case "vintage":
        return {
          fontFamily: "Georgia, serif",
          textShadow: "1px 1px 1px rgba(0,0,0,0.2)",
          letterSpacing: "0.5px",
        };
      case "minimalist":
        return {
          fontFamily: "Arial, sans-serif",
          letterSpacing: "1px",
          fontWeight: "300",
        };
      case "playful":
        return {
          fontFamily: "Comic Sans MS, cursive",
          textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
          letterSpacing: "0.5px",
        };
      case "modern":
      default:
        return {
          fontFamily: "Poppins, sans-serif",
          letterSpacing: "0.5px",
        };
    }
  };

  // Navigate to the next card
  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  // Navigate to the previous card
  const prevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Render decoration elements based on category and style
  const renderDecorations = (category, style) => {
    if (style === "minimalist") return null;

    switch (category) {
      case "romantic":
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-white"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full border-2 border-white"></div>
          </div>
        );
      case "fun":
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {style === "playful" &&
              Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full opacity-20 bg-white"
                  style={{
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                ></div>
              ))}
          </div>
        );
      case "future":
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute top-4 right-4 text-white text-opacity-30 text-4xl">
              ✧
            </div>
            <div className="absolute bottom-4 left-4 text-white text-opacity-30 text-4xl">
              ✧
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Toggle customization panel
  const toggleCustomizationPanel = () => {
    setShowCustomizationPanel(!showCustomizationPanel);
  };

  // If loading, show loading state with improved animation
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl p-6 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
        <button
          onClick={onBackToDashboard}
          className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Dashboard
        </button>
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Couple Love Cards
        </h1>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-12 h-12 border-4 border-pink-100 border-t-pink-300 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading your perfect questions...
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            This will just take a moment
          </p>
        </div>
      </div>
    );
  }

  // If error, show error state with improved visuals
  if (error && !Object.keys(questions).length) {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl p-6 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
        <button
          onClick={onBackToDashboard}
          className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Dashboard
        </button>
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Couple Love Cards
        </h1>
        <div className="p-6 mb-4 text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-start">
          <svg
            className="w-6 h-6 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <p className="font-medium">Error loading questions: {error}</p>
            <p className="mt-2 text-red-600">
              Please try refreshing the page or check your connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl p-6 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
      <button
        onClick={onBackToDashboard}
        className="self-start mb-6 bg-white text-pink-600 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center group"
      >
        <svg
          className="w-4 h-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Back to Dashboard
      </button>

      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Couple Love Cards
        </h1>
        <span className="ml-2 px-2 py-1 text-xs bg-pink-100 text-pink-700 font-medium rounded-full">
          Beta
        </span>
      </div>

      <p className="text-gray-600 max-w-2xl text-center mb-8">
        Create personalized conversation cards to deepen your connection with
        your partner. Choose from different question types and customize your
        card design.
      </p>

      {/* Category Selection with improved cards */}
      <div className="w-full mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 flex items-center">
          <span className="inline-block mr-2 text-pink-500">1.</span> Choose
          Question Type
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl transition-all flex flex-col items-center ${
                selectedCategory === category.id
                  ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <span
                className={`text-3xl ${
                  selectedCategory === category.id ? "animate-pulse" : ""
                }`}
              >
                {category.emoji}
              </span>
              <span className="mt-2 font-medium">{category.name}</span>
              <span
                className={`mt-1 text-xs ${
                  selectedCategory === category.id
                    ? "text-pink-100"
                    : "text-gray-500"
                }`}
              >
                {category.description.length > 20
                  ? `${category.description.substring(0, 20)}...`
                  : category.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Customization Panel Toggle */}
      <div className="w-full mb-4">
        <button
          onClick={toggleCustomizationPanel}
          className="w-full p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="inline-block mr-2 text-pink-500">2.</span>
            <h2 className="text-xl font-semibold text-gray-700">
              Customize Your Cards
            </h2>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              showCustomizationPanel ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Customization Options with improved UI */}
      {showCustomizationPanel && (
        <div className="w-full mb-8 p-5 bg-white rounded-lg shadow-sm border border-gray-100 transition-all">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Card style selection with preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {cardStyles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() =>
                        setCustomOptions({
                          ...customOptions,
                          cardStyle: style.id,
                        })
                      }
                      className={`relative p-3 rounded-lg cursor-pointer transition-all ${
                        customOptions.cardStyle === style.id
                          ? "ring-2 ring-pink-500 bg-pink-50"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <div
                        className="w-full h-16 mb-2 rounded"
                        style={{
                          ...getCardBackground(
                            customOptions.cardColor,
                            style.id,
                            "romantic"
                          ),
                        }}
                      ></div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {style.name}
                        </span>
                        {customOptions.cardStyle === style.id && (
                          <svg
                            className="w-5 h-5 text-pink-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color palette with improved selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Color
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {colorPalette.map((item) => (
                    <div
                      key={item.color}
                      onClick={() =>
                        setCustomOptions({
                          ...customOptions,
                          cardColor: item.color,
                        })
                      }
                      className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                        customOptions.cardColor === item.color
                          ? "ring-2 ring-offset-1 ring-gray-700 transform scale-105"
                          : ""
                      }`}
                    >
                      <div
                        className="h-12 w-full mb-1"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <p className="text-xs font-medium text-center text-gray-700 pb-1">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Font size selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <div className="flex flex-col space-y-2">
                  {["small", "medium", "large"].map((size) => (
                    <label
                      key={size}
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${
                        customOptions.fontSize === size
                          ? "bg-pink-50 border border-pink-200"
                          : "bg-white border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={customOptions.fontSize === size}
                        onChange={() =>
                          setCustomOptions({ ...customOptions, fontSize: size })
                        }
                        className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                      />
                      <div className="ml-2 flex justify-between w-full items-center">
                        <span
                          className="text-gray-700"
                          style={{ fontSize: getFontSize(size) }}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {getFontSize(size)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of questions with slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <div className="px-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={customOptions.questionCount}
                    onChange={(e) =>
                      setCustomOptions({
                        ...customOptions,
                        questionCount: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                  <div className="text-center mt-3">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">
                      {customOptions.questionCount}{" "}
                      {customOptions.questionCount === 1
                        ? "question"
                        : "questions"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emoji toggle with improved UI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji Icons
                </label>
                <div className="relative flex items-center p-4 rounded-lg bg-gray-50">
                  <div
                    className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 ${
                      customOptions.includeEmojis
                        ? "bg-pink-600"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      setCustomOptions({
                        ...customOptions,
                        includeEmojis: !customOptions.includeEmojis,
                      })
                    }
                  >
                    <div
                      className={`absolute top-[16px] left-[6px] bg-white border border-gray-300 h-5 w-5 rounded-full transition-all ${
                        customOptions.includeEmojis
                          ? "transform translate-x-5 border-pink-400"
                          : ""
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-gray-700">
                    {customOptions.includeEmojis
                      ? "Emojis Enabled"
                      : "No Emojis"}
                  </span>
                  {customOptions.includeEmojis && (
                    <span className="ml-auto text-xl animate-pulse">✨</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card preview */}
      <div className="w-full mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 flex items-center">
          <span className="inline-block mr-2 text-pink-500">3.</span> Preview
        </h2>
        <div className="flex justify-center">
          <div
            className="w-full max-w-md h-48 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg"
            style={{
              ...getCardBackground(
                customOptions.cardColor,
                customOptions.cardStyle,
                selectedCategory
              ),
            }}
          >
            {renderDecorations(selectedCategory, customOptions.cardStyle)}
            <div className="text-center z-10 p-6">
              {customOptions.includeEmojis && (
                <span className="text-4xl block mb-4">
                  {categories.find((c) => c.id === selectedCategory)?.emoji}
                </span>
              )}
              <p
                className="font-medium text-white"
                style={{
                  fontSize: getFontSize(customOptions.fontSize),
                  ...getFontStyling(customOptions.cardStyle),
                }}
              >
                Preview of your{" "}
                {categories.find((c) => c.id === selectedCategory)?.name} card
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button with improved styling */}
      <button
        onClick={generateCards}
        disabled={isGenerating}
        className={`px-8 py-4 mb-8 text-lg font-semibold text-white rounded-xl shadow-lg transition-all relative overflow-hidden ${
          isGenerating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:shadow-xl active:transform active:scale-95"
        }`}
      >
        <span className="relative z-10 flex items-center">
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Cards...
            </>
          ) : (
            <>
              Generate Cards
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                ></path>
              </svg>
            </>
          )}
        </span>
      </button>

      {/* Helpful tips for better usage */}
      <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-700 mb-8">
        <h3 className="font-medium flex items-center mb-2">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Tips for a great experience
        </h3>
        <ul className="ml-7 list-disc text-sm space-y-1 text-blue-600">
          <li>Set aside dedicated time without distractions</li>
          <li>Take turns answering the questions</li>
          <li>Listen actively without interrupting your partner</li>
          <li>Remember there are no right or wrong answers</li>
          <li>Save any cards you love for future conversations</li>
        </ul>
      </div>

      {/* Modal for card display */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="modal-content bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {categories.find((c) => c.id === selectedCategory)?.name}{" "}
                Question Cards
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              {cards.length > 0 && (
                <div
                  className="w-full h-64 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg mb-6"
                  style={{
                    ...getCardBackground(
                      cards[currentCardIndex].color,
                      cards[currentCardIndex].style,
                      cards[currentCardIndex].category
                    ),
                  }}
                >
                  {renderDecorations(
                    cards[currentCardIndex].category,
                    cards[currentCardIndex].style
                  )}
                  <div className="text-center z-10 p-6">
                    {cards[currentCardIndex].emoji && (
                      <span className="text-4xl block mb-4">
                        {cards[currentCardIndex].emoji}
                      </span>
                    )}
                    <p
                      className="font-medium text-white"
                      style={{
                        fontSize: getFontSize(cards[currentCardIndex].fontSize),
                        ...getFontStyling(cards[currentCardIndex].style),
                      }}
                    >
                      {cards[currentCardIndex].question}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center w-full">
                <button
                  onClick={prevCard}
                  className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </button>

                <span className="text-sm text-gray-500">
                  Card {currentCardIndex + 1} of {cards.length}
                </span>

                <button
                  onClick={nextCard}
                  className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with features coming soon section */}
      <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-gray-700 font-medium mb-2">Coming Soon</h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="flex items-center text-gray-600 text-sm">
            <svg
              className="w-4 h-4 mr-2 text-pink-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              ></path>
            </svg>
            Timed question mode
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <svg
              className="w-4 h-4 mr-2 text-pink-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
            </svg>
            Custom question creation
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <svg
              className="w-4 h-4 mr-2 text-pink-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
            </svg>
            Share cards with friends
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <div className="text-gray-600 text-xs">
            <span className="font-medium">© 2025 All Rights Reserved</span>
          </div>
          <div className="text-gray-600 text-xs">
            <span>Developer: MrLawX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoupleCardGenerator;
