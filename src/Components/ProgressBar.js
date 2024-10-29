import React from 'react'

const ProgressBar = ({index, numQuestions, points, maxPossiblePoint, answer}) => {
  return (
    <header className='progress'>
      <progress max={numQuestions} value={index + Number(answer !== null)}/>
      <p>Question {index + 1} / {numQuestions}</p>

      <p>Ponts : {points} / {maxPossiblePoint}</p>
    </header>
  )
}

export default ProgressBar
