import { useEffect, useReducer } from 'react';
import Header from './Header'
import Main from './Components/Main';
import Loader from './Components/Loader';
import Error from './Components/Error';
import StartScreen from './Components/StartScreen';
import Question from './Components/Question';
import NextButton from './Components/NextButton';
import ProgressBar from './Components/ProgressBar';
import FinishScreen from './Components/FinishScreen';
import Footer from './Components/Footer';
import Timer from './Components/Timer';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions : [],
  /// 'loading' , 'error', 'ready', 'active', 'finished'
  status : "loading",
  index: 0, 
  points: 0,
  highscore:0,
  secondRemaining:null
}

function reducer (state, action){

  switch (action.type) {
    case 'dataReceived':
        return {
          ...state, 
          questions: action.payload,
          status: 'ready'
        }
      case 'dataFailed':
        return{
          ...state,
          status: 'error'
        }
      case 'start':
          return{
            ...state,
            status: 'active',
            secondRemaining: state.questions.length * SECS_PER_QUESTION
          }
        case 'newAnswer':
          const question = state.questions.at(state.index)
          return {
          ...state,
          answer: action.payload,
          points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points
          }
        case 'nextQuestion':
          return{
            ...state,
            index: state.index + 1,
            answer: null
          }
        case 'finished':
          return{
            ...state,
            status:'finished',
            highscore: state.points > state.highscore ? state.points : state.highscore
          }
        case 'restart':
          return{
            ...initialState,
            questions: state.questions,
            status: 'ready',
            highscore: state.highscore
          }
        case 'tick':
          return{
            ...state,
            secondRemaining: state.secondRemaining - 1,
            status: state.secondRemaining === 0 ? "finished" : state.status
          }
    default:
      throw new Error('Action Unknown')
  }
}

function App() {

  // const [state, dispatch] = useReducer(reducer, initialState)
  const [{questions, status, index, answer, points,highscore, secondRemaining}, dispatch] = useReducer(reducer, initialState)

  const numQuestion = questions?.length;
  const maxPossiblePoint = questions?.reduce(
    (prev, cur) => prev + cur.points,0)

  useEffect(() => {
  fetch('http://localhost:8000/questions')
  .then(res => res.json())
  .then(data => dispatch({type: 'dataReceived', payload: data}))
  .catch((err) => dispatch({type: 'dataFailed'}))
  }, [])
  

  return (
    <div className="app">
        <Header/>
        <Main>
          { status === 'loading' && <Loader/> }
          { status === 'error' && <Error/> }
          { status === 'ready' && <StartScreen numQuestion={numQuestion} dispatch={dispatch}/> }
        {status === 'active' &&
          <>
          <ProgressBar
            index={index}
            numQuestions={numQuestion}
            points={points}
            maxPossiblePoint={maxPossiblePoint}
            answer={answer}
          />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
          <Footer>
            <Timer dispatch={dispatch} secondRemaining={secondRemaining}/>
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestion={numQuestion}
              index={index}
            />
          </Footer>
          </>
        }
        {
          status === 'finished' &&
          <FinishScreen
            points={points}
            maxPossiblePoint={maxPossiblePoint}
            highscore={highscore}
            dispatch={dispatch}
          />
        }
        </Main>
    </div>
  );
}

export default App;
