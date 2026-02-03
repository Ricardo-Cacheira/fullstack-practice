import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherBaseUrl = 'http://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_SOME_KEY

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
      <h2>Weather in {country.capital[0]}</h2>
      <Weather capital={country.capital[0]} />
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    axios
    .get(`${weatherBaseUrl}?q=${capital}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
        console.log('Weather data:', response.data)
        setIcon(response.data.weather[0].icon)
      })
  }, [capital])

  return (
    <div>
      {
        weather ? (
          <div>
            <p>Temperature: {weather.main.temp} °C</p>
            <img 
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={`Weather icon for ${weather.weather[0].description}`}
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        ) 
        : ( <p>Loading weather ...</p> )
      }
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
      // console.log(countries.data)
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
              <li key={country.name.common}>
                {country.name.common}
                <button onClick={() => setFilter(country.name.common)}>Show</button>
              </li>
            )}
          </div>
      }
    </>
  )
}

export default App
