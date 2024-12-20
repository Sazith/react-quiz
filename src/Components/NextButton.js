import React from 'react'

const NextButton = ({dispatch, answer, numQuestion, index}) => {
  if (answer == null) return null
  if (index < numQuestion - 1) return (<>
    <button className='btn btn-ui' onClick={() => dispatch({ type: 'nextQuestion' })}>Next</button>
  </>)
    if (index === numQuestion - 1) return (<>
      <button className='btn btn-ui' onClick={() => dispatch({ type: 'finished' })}>Finished</button>
    </>)
}

export default NextButton
