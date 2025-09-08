import { BrowserRouter, Route, Routes} from "react-router-dom";
import WeatherData from './pages/WeatherData/WeatherData.tsx';

function App() {
  return (
    <BrowserRouter>
        <Routes> 
          <Route path="/" element={<WeatherData/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
