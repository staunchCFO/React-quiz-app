import React, {useState} from 'react';
import {fetchQuizQuestions} from './API'
//Importing the Components
import QuestionCard from './components/QuestionCard';

//types
import {QuestionState , Difficulty} from "./API";

//Styles
import {GlobalStyle , Wrapper} from "./App.styles"

export type AnswerObject = {
  question : string;
  answer : string;
  correct : boolean;
  correctAnswer : string;
}

const TOTAL_QUESTIONS = 30;

const App = () => {

  const [loading , setLoading] = useState (false);
  const [questions , setQuestion] = useState<QuestionState[]> ([]);
  const [number , setNumber] = useState (0);
  const [userAnswers , setUserAnswers] = useState<AnswerObject[]> ([]);
  const [score , setScore] = useState (0);
  const [gameOver , setGameOver] = useState (true);


  const startTrivia = async () => {
      setLoading(true);
      setGameOver(false);

      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );
      setQuestion(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      //This is where we get the Users Answers for the next button to appear and be fully functional
      const answer = e.currentTarget.value;

      //Checking user answers against the correct option
      const correct = questions[number].correct_answer === answer;

      //Adding the score if the answer is correct
      if (correct) setScore(prev => prev + 1);

      //Saving the Users answer in the Array for user answer
      const answerObject = {
        question : questions[number].question,
        answer,
        correct,
        correctAnswer : questions[number].correct_answer
      };
      setUserAnswers((prev) => [...prev, answerObject]);


    }
  };

  const nextQuestion = () => {
      //Setting up the next question option, if not the last question

      const nextQuestion = number + 1;
      if(nextQuestion === TOTAL_QUESTIONS) {

        setGameOver(true);
      }else{
        setNumber(nextQuestion);
      }
  };

  return (
    <>
    <GlobalStyle />
    <Wrapper>
      <h1> REACT QUIZ </h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
      <button className="start" onClick={startTrivia}>
        Start Quiz
      </button>
      ) : null}
      {!gameOver ? <p className="score"> Score: {score} </p> : null }
      {loading && <p> Loading Questions</p>}
        
      {!loading && !gameOver && (
      <QuestionCard 
          questionNr = {number + 1}
          totalQuestions = {TOTAL_QUESTIONS}
          question = {questions[number].question}
          answers = {questions[number].answers}
          userAnswer = {userAnswers ? userAnswers[number] : undefined}
          callback = {checkAnswer}
      />
      )}

      {!loading && !gameOver && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQuestion}>
        Next Question 
      </button>

      ) : null }
      
    </Wrapper>
    </>
  );
};

export default App;
