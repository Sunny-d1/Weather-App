import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [cities, setCities] = useState([])
  const [newCityName, setNewCityName] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [temperatureUnit, setTemperatureUnit] = useState('imperial')
  const [brightness, setBrightness] = useState(100)
  const [textSize, setTextSize] = useState('normal')

  const searchLocation = (event) => {
    try {
      if (event.key === 'Enter') {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${temperatureUnit}&appid=a83fee0401589cd0e567939e81026da7`).then((response) => {
          setData(response.data);
          console.log(response.data);
        }).catch((error) => {
          console.log('Error fetching data:', error);
          alert('Location not found');
        });
        setLocation('');
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const addCity = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${temperatureUnit}&appid=a83fee0401589cd0e567939e81026da7`;
      const response = await axios.get(url);
      const city = response.data;
      setCities([...cities, city]);
    } catch (error) {
      console.error(error);
      alert('Error: Invalid city');
    }
  };

  const removeCity = (index) => {
    setCities(cities.filter((city, i) => i !== index));
  };

  const handleTemperatureUnitChange = (event) => {
    setTemperatureUnit(event.target.value);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${event.target.value === 'imperial' ? 'imperial' : 'metric'}&appid=a83fee0401589cd0e567939e81026da7`;
    axios.get(url).then((response) => {
      setData(response.data);
    }).catch((error) => {
      console.log('Error fetching data:', error);
    });
    const updatedCities = cities.map((city) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=${event.target.value === 'imperial' ? 'imperial' : 'metric'}&appid=a83fee0401589cd0e567939e81026da7`;
      return axios.get(url).then((response) => response.data);
    });
    Promise.all(updatedCities).then((updatedCities) => {
      setCities(updatedCities);
    });
  };

  const handleBrightnessChange = (event) => {
    setBrightness(event.target.value);
    document.querySelector('.app').style.filter = `brightness(${event.target.value}%)`;
  };

  const handleTextSizeChange = (event) => {
    setTextSize(event.target.value);
    document.querySelector('.app').style.fontSize = event.target.value === 'normal' ? '16px' : event.target.value === 'large' ? '24px' : '32px';
  };

  return (
    <div className="app" style={{ filter: `brightness(${brightness}%)`, fontSize: textSize === 'normal' ? '16px' : textSize === 'large' ? '24px' : '32px' }}>
      <div className="header">
        <button className="settings-button" onClick={() => setSettingsOpen(true)}>Settings</button>
      </div>
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
      <div className="add-city">
        <div className="city-input-container">
          <input
            type="text"
            placeholder="เพิ่มเข้าในรายการโปรด"
            value={newCityName}
            onChange={(event) => setNewCityName(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                addCity(newCityName);
                setNewCityName('');
              }
            }}
          />
        </div>
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? (
              <h1>{data.main.temp.toFixed()}°{temperatureUnit === 'imperial' ? 'F' : 'C'}</h1>
            ) : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined &&
          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className='bold'>{data.main.feels_like.toFixed()}°{temperatureUnit === 'imperial' ? 'F' : 'C'}</p>
              ) : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }

        <h2>Added Cities:</h2>
        <div className="added-cities-container"></div>
        {cities.map((city, index) => (
          <div key={index}>
            <h3>{city.name}</h3>
            <p>
              Temperature: {city.main.temp.toFixed()}°{temperatureUnit === 'imperial' ? 'F' : 'C'}
            </p>
            <p>
              Feels Like: {city.main.feels_like.toFixed()}°{temperatureUnit === 'imperial' ? 'F' : 'C'}
            </p>
            <p>Humidity: {city.main.humidity}%</p>
            <p>Wind Speed: {city.wind.speed.toFixed()} MPH</p>
            <button onClick={() => removeCity(index)}>Remove City</button>
          </div>
        ))}
      </div>
      {settingsOpen && (
        <div className="settings-container">
          <h2>Settings</h2>
          <div className="settings-section">
            <h3>Temperature Unit</h3>
            <select value={temperatureUnit} onChange={handleTemperatureUnitChange}>
              <option value="imperial">Fahrenheit</option>
              <option value="metric">Celsius</option>
            </select>
          </div>
          <div className="settings-section">
            <h3>Text Size</h3>
            <select value={textSize} onChange={handleTextSizeChange}>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra-Large</option>
            </select>
          </div>
          <div className="settings-section">
            <h3>Sound Effects</h3>
            <label>
              <input type="checkbox" />
              Enable sound effects
            </label>
          </div>
          <div className="settings-section">
            <h3>Screen Brightness</h3>
            <input type="range" min="0" max="200" value={brightness} onChange={handleBrightnessChange} />
          </div>
          <div className="about-section">
            <h2>About</h2>
            <p><b>Weather Time</b></p>
            <p>&copy; 2025</p>
            <p>Version 1.0</p>
            <p>Last update: {new Date().toLocaleDateString()}</p>
            <p>Build date: {new Date().toLocaleDateString()}</p>
            <p>Developer: Sunny Leepreecha</p>
            <p>Student number: ACBI20250009</p>
          </div>
          <div className="footer-message">
            <p>Thank you for purchasing Weather Time.</p>
            <p>If you have any issues or feedback, please contact: 1800 123 456.</p>
            <p>Data provided by OpenWeather. </p>
              <p>Best efforts are taken to ensure accuracy of the data but no guarantees are made.  </p>
              <p> To view the official data, please visit the website of OpenWeather.</p>

          </div>
          <button className="back-button" onClick={() => setSettingsOpen(false)}>Back</button>
        </div>
      )}
    </div>
  );
}

export default App;