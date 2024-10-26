import React from 'react'

const StartScreen = ({numQuestion, dispatch}) => {
  return (
    <div className='start'>
      <h2>Welcome to the react quiz!</h2>
      <h3>{numQuestion} Question To Test Your React Mastery</h3>
      <button className='btn btn-ui' onClick={() => dispatch({type:'start'})}>Let's start</button>
    </div>
  )
}

export default StartScreen
