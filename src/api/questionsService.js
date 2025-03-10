// Service to handle API requests for questions
export const fetchQuestions = async (category) => {
    try {
      // You would replace this with a real API call
      const response = await fetch(`/api/questions/${category}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching ${category} questions: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch questions for ${category}:`, error);
      
      // If API call fails, fall back to mock data
      return {
        category,
        questions: mockQuestionData[category] || []
      };
    }
  };
  
  // Mock data as fallback in case the API call fails
  const mockQuestionData = {
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
      "What's the most romantic movie we've watched together?",
      "What's one romantic gesture that caught you by surprise?",
      "If you could recreate our first date, what would you change?",
      "What's the most meaningful compliment I've given you?",
      "What's one romantic tradition you'd like us to start?",
      "How do you like to be shown love and affection?",
      "What song reminds you of our relationship?",
      "What's the most romantic place we've been together?",
      "What physical touch makes you feel most loved?",
      "What's something romantic you've always wanted us to try?",
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
      "If we had a theme song as a couple, what would it be?",
      "What's one silly habit of mine that you secretly love?",
      "What's the most spontaneous thing we've ever done?",
      "If we could invent a holiday just for us, what would it be about?",
      "What celebrity couple do you think we're most like?",
      "If we were cartoon characters, who would we be?",
      "What's the weirdest food combination we've tried together?",
      "If we had a couples costume, what should we be?",
      "What's one fun activity on your bucket list you want us to do?",
      "If we had a reality show about our relationship, what would it be called?",
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
      "How has our relationship changed you as a person?",
      "What values do you think we share that make our relationship strong?",
      "What's one challenge we've overcome that made us stronger?",
      "What do you think has been our biggest misunderstanding?",
      "When do you feel most connected to me?",
      "What's something I do that helps you grow as a person?",
      "How do you define commitment in our relationship?",
      "What's one way I've helped you heal from past hurts?",
      "What unspoken rule do you think exists in our relationship?",
      "What's something difficult you want us to talk about more openly?",
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
      "What kind of home do you envision us having someday?",
      "What traditions would you like to establish in our future?",
      "How do you think our relationship will evolve over time?",
      "What's one career goal you'd like us to support each other in?",
      "How do you hope we'll balance work and personal life in the future?",
      "What role do you see our extended families playing in our future?",
      "What financial goals should we prioritize together?",
      "How do you want to celebrate major milestones in our future?",
      "What's one way you hope we'll grow old together?",
      "What legacy would you like us to create together?",
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
      "What was going through your mind during our first kiss?",
      "What's a small moment between us that you cherish but rarely mention?",
      "What's the best surprise you've ever received from me?",
      "What's a time when you felt most understood by me?",
      "What's your favorite holiday memory we've shared?",
      "What was your first impression of me and how has it changed?",
      "What moment made you realize we were a good match?",
      "What's the most meaningful gift you've received from me?",
      "What's a challenge we overcame that you're proud of?",
      "What's a time when my support meant everything to you?",
    ],
  };