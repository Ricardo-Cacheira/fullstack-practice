import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}km²</p>
      <h2>Languages: </h2>
      <ul>
        {Object.values(country.languages).map(language => 
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} width='150' />
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.
    get(baseUrl)
    .then(countries => {
      console.log(countries.data)
      setCountries(countries.data)
    })
  }, [])

  const countriesToShow = filter === ''
  ? countries
  : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))


  return (
    <>
      <div>
        filter shown with: <input value={filter} onChange={(event) => setFilter(event.target.value)} />
      </div>
      {
        countriesToShow.length > 10 ?
          <p>Too many matches, specify another filter</p>
        : (countriesToShow.length === 1) ?
          <Country country={countriesToShow[0]} />
        :
          <div>
            {countriesToShow.map(country => 
              <li key={country.name.common}>{country.name.common}</li>
            )}
          </div>
      }
    </>
  )
}

export default App
