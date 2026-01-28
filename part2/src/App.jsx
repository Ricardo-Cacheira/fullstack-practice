const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => (
  <div>
    {props.parts.map(part => <Part key={part.id} part={part} />)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Course = ({name, parts}) => 
{
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
      <Total total={total} />
    </div>
  )
}
const Total = (props) => <b>total of {props.total} exercises</b>

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      },
    ]
  }

  return <Course name={course.name} parts={course.parts} />
}

export default App