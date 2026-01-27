import { useState } from 'react'

const Statistics = (props) => {
  if (props.reviews.good == 0 && props.reviews.neutral == 0 && props.reviews.bad == 0) {
    return (
      <div>
        No reviews given
      </div>
    )
  }
  return (
    <div>
      good {props.reviews.good} <br />
      neutral {props.reviews.neutral} <br />
      bad {props.reviews.bad} <br />
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Title = ({ text }) => <h1>{text}</h1>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Title text='give feedback' />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Title text='statistics' />
      <Statistics reviews={{ good, neutral, bad }} />
    </div>
  )
}

export default App