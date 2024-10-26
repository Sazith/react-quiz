import { useEffect, useReducer } from 'react';
import Header from './Header'
import Main from './Components/Main';
import Loader from './Components/Loader';
import Error from './Components/Error';
import StartScreen from './Components/StartScreen';
import Question from './Components/Question';

const initialState = {
  questions : [],
  /// 'loading' , 'error', 'ready', 'active', 'finished'
  status : "loading",
  index: 0, 
  points: 0,
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
            status: 'active'
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
    default:
      throw new Error('Action Unknown')
  }
}

function App() {

  // const [state, dispatch] = useReducer(reducer, initialState)
  const [{questions, status, index, answer}, dispatch] = useReducer(reducer, initialState)

  const numQuestion = questions.length;

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
          { status === 'active' && <Question question={questions[index]} dispatch={dispatch} answer={answer}/> }
        </Main>
    </div>
  );
}

export default App;
