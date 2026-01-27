import { useState } from 'react'

const Statistics = (props) => {
  const total = props.reviews.good + props.reviews.neutral + props.reviews.bad

  if (props.reviews.good == 0 && props.reviews.neutral == 0 && props.reviews.bad == 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.reviews.good} />
        <StatisticLine text="neutral" value={props.reviews.neutral} />
        <StatisticLine text="bad" value={props.reviews.bad} />
        <StatisticLine text="all" value={props.reviews.good + props.reviews.neutral + props.reviews.bad} />
        <StatisticLine text="average" value={(props.reviews.good - props.reviews.bad) / total} />
        <StatisticLine text="positive" value={(props.reviews.good / total * 100) + "%"} />
      </tbody>
    </table>
  )
}

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

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