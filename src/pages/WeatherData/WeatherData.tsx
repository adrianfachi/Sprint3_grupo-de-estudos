import css from './style.module.css'
import logo from '../../assets/Logo.svg'
import axios from 'axios'
import { useRef, useState, useEffect } from 'react'
import ClearDay from '../../assets/ClearDay.svg'
import ClearNight from '../../assets/ClearNight.svg'
import CloudyDay from '../../assets/CloudyDay.svg'
import CloudyNight from '../../assets/CloudyNight.svg'
import RainDay from '../../assets/RainDay.svg'
import RainNight from '../../assets/RainNight.svg'
import SnowDay from '../../assets/SnowDay.svg'
import SnowNight from '../../assets/SnowNight.svg'
import StormDay from '../../assets/StormDay.svg'
import StormNight from '../../assets/StormNight.svg'
import Default from '../../assets/RainNight.svg'
import ClearDayIcon from '../../assets/Weather=Clear, Moment=Day.svg'
import ClearNightIcon from '../../assets/Weather=Clear, Moment=Night.svg'
import CloudyDayIcon from '../../assets/Weather=Cloudy, Moment=Day.svg'
import CloudyNightIcon from '../../assets/Weather=Clear, Moment=Night.svg'
import RainDayIcon from '../../assets/Weather=Rain, Moment=Day.svg'
import RainNightIcon from '../../assets/Weather=Rain, Moment=Night.svg'
import SnowDayIcon from '../../assets/Weather=Snow, Moment=Day.svg'
import SnowNightIcon from '../../assets/Weather=Snow, Moment=Night.svg'
import StormDayIcon from '../../assets/Weather=Storm, Moment=Day.svg'
import StormNightIcon from '../../assets/Weather=Snow, Moment=Night.svg'
import iconFeelsLike from '../../assets/iconFeelsLike.svg'
import iconHumidity from '../../assets/iconHumidity.svg'
import iconPrecipProb from '../../assets/iconPrecipProb.svg'
import iconUvIndex from '../../assets/iconUvIndex.svg'
import iconWindSpeed from '../../assets/iconWindSpeed.svg'
import LoadingIcon from '../../assets/Loading.svg'

function WeatherData() {
    const [dados, setDados] = useState<dadosInterface>()
    const [dadosCity, setDadosCity] = useState<dadosCityInterface[]>()
    const [suggestions, setSuggestions] = useState<dadosCityInterface[]>([]);
    const key2 = 'EGC5Y2WCAS5A8RVDE2996JDB9'
    const cityName = useRef<HTMLInputElement>(null);
    const tempDiv = useRef<HTMLDivElement>(null);
    const popup = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);



    interface dadosInterface {
        days: {
            conditions: string
            datetime: string
            tempmax: number
            tempmin: number
        }[]
        currentConditions: {
            conditions: string
            datetime: string
            datetimeEpoch: number
            feelslike: number
            humidity: number
            precipprob: number
            temp: number
            windspeed: number
            uvindex: number
        }
    }

    interface dadosCityInterface {
        name: string
        fclName: string
        countryName: string
        adminName1: string
        countryCode: string
    }

    useEffect(() => {
        const enter = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                searchCity()
            }
        }
        document.addEventListener('keypress', enter)
        return () => {
            document.removeEventListener('keypress', enter)
        }
    }, [])

    async function searchCity() {
        try {
            setLoading(true)
            const apiCity = await axios.get<{ geonames : dadosCityInterface[] }>(`http://api.geonames.org/searchJSON?q=${cityName.current?.value}&username=WeatherData&maxRows=10`)
            const city: dadosCityInterface[] = apiCity.data.geonames
            const arrayCitys : dadosCityInterface[] = []
            city.map((city) => {
                if(city.fclName.includes("city")) {
                    arrayCitys.push(city);
                }
            })
            if (city.length > 0) [
                setDadosCity(arrayCitys)
            ]
            const location = `${arrayCitys[0].name}, ${arrayCitys[0].countryCode}`;
            const api = await axios.get<dadosInterface>(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${key2}&contentType=json`
            );
            const temp: dadosInterface = api.data
            setDados(temp)
            
            
            if(cityName.current) {  
                cityName.current.value = ""
            }
        } catch (error) {
            ativaPopup("Cidade não encontrada!")
        } finally {
            setLoading(false)
        }

    }


    function getBackgroundImage(clima: string, hour: number) {
        const isNight = hour < 6 || hour >= 18
        const normalized = clima.toLowerCase()
        if (normalized.includes('clear')) {
            return isNight ? `url(${ClearNight})` : `url(${ClearDay})`
        }
        if (normalized.includes('rain')) {
            return isNight ? `url(${RainNight})` : `url(${RainDay})`
        }
        if (normalized.includes('snow')) {
            return isNight ? `url(${SnowNight})` : `url(${SnowDay})`
        }
        if (normalized.includes('storm')) {
            return isNight ? `url(${StormNight})` : `url(${StormDay})`
        }
        if (normalized.includes('cloudy') || normalized.includes('overcast')) {
            return isNight ? `url(${CloudyNight})` : `url(${CloudyDay})`
        }
        return `url(${Default})`
    }

    function getIcon(clima: string, hour: number) {
        const isNight = hour < 6 || hour >= 18
        const normalized = clima.toLowerCase()
        if (normalized.includes('clear')) {
            return isNight ? ClearNightIcon : ClearDayIcon
        }
        if (normalized.includes('rain')) {
            return isNight ? RainNightIcon : RainDayIcon
        }
        if (normalized.includes('snow')) {
            return isNight ? SnowNightIcon : SnowDayIcon
        }
        if (normalized.includes('storm')) {
            return isNight ? StormNightIcon : StormDayIcon
        }
        if (normalized.includes('cloudy') || normalized.includes('overcast')) {
            return isNight ? CloudyNightIcon : CloudyDayIcon
        }
        return isNight ? ClearNightIcon : ClearDayIcon
    }

    useEffect(() => {
        if (dados && tempDiv.current) {
            tempDiv.current.style.backgroundImage = getBackgroundImage(dados.currentConditions.conditions, Number(dados.currentConditions.datetime.slice(0, 2)))
        }
    }, [dados, tempDiv.current])

    function ativaPopup(valor: string) {
        if (popup.current) {
            popup.current.innerHTML = valor
            popup.current.className = (css.popupAtivo);
            setTimeout(() => {
                if (popup.current) {
                    popup.current.className = (css.popup);
                }
            }, 2000);
        }
    }

    async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value.length < 1) {
            setSuggestions([]);
            return;
        }

        try {
            const {data : res} = await axios.get<{geonames : dadosCityInterface[]}> (
                `http://api.geonames.org/searchJSON?q=${value}&username=WeatherData&maxRows=10`
            );

            const arraySuggestions : dadosCityInterface[] = []
            res.geonames.map((city) => {
                if(city.fclName.includes("city")) {
                    arraySuggestions.push(city);        
                }
            })
            setSuggestions(arraySuggestions)
        } catch (error) {
            setSuggestions([]);
        }
    }

    return (
        <div className={css.principal}>
            {dados && dadosCity ? (
                <>
                    <div ref={popup} className={css.popup}></div>
                    <div id={css.resultado}>
                        <section id={css.pesquisaTemp}>
                            <div id={css.pesquisaDados}>
                                <img src={logo} alt="Logo"/>
                                <div>
                                    <div className={css.searchEngine}>
                                        <div>
                                            <input 
                                                ref={cityName} 
                                                type="text" 
                                                placeholder='Buscar local' 
                                                className={css.input}
                                                onChange={handleInputChange}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                            />
                                        </div>
                                        {loading && <img src={LoadingIcon} alt="..." />}
                                    </div>
                                {suggestions.length > 0 && isFocused && (
                                    <ul className={css.suggestionsDropdown}>
                                        {suggestions.map((s, index) => (
                                            <li
                                                className={css.suggestion}
                                                key={index}
                                                onClick={() => {
                                                    if (cityName.current) {
                                                        cityName.current.value = s.name;
                                                    }
                                                    setSuggestions([]);
                                                    searchCity();
                                                }}
                                            >
                                                {s.name} - {s.countryName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            </div>
                            <div id={css.temperatura} ref={tempDiv}>
                                <div id={css.nomeDatas}>
                                    <div>
                                        <h2>{dadosCity[0] ? (dadosCity[0].name) : ("")}{dadosCity[0].adminName1 ? (", " + dadosCity[0].adminName1) : ("")}{dadosCity[0].countryName ? (", " + dadosCity[0].countryName) : ("")}</h2>
                                        <p>{new Date(dados.days[1].datetime).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</p>
                                    </div>
                                    <p>{dados.currentConditions.datetime.slice(0, 5)}</p>
                                </div>
                                <div id={css.tempIcon}>
                                    <div>
                                        <h2>{dados.currentConditions.temp.toFixed(0)}°C</h2>
                                        <p>{dados.days[0].tempmax.toFixed(0)}°C / {dados.days[0].tempmin.toFixed(0)}°C</p>
                                    </div>
                                    <img src={getIcon(dados.currentConditions.conditions, Number(dados.currentConditions.datetime.slice(0, 2)))} alt="Icone tempo" />
                                </div>
                            </div>
                        </section>
                        <section>
                            <div id={css.detalhes}>
                                <p>Detalhes do clima hoje</p>
                                <div className={css.detalhesFull}>
                                    <div className={css.detalhesIconText}>
                                        <img src={iconFeelsLike} alt="" />
                                        <p>Sensação termica</p>
                                    </div>
                                    <p>{dados.currentConditions.feelslike.toFixed(0)}°C</p>
                                </div>
                                <div className={css.detalhesFull}>
                                    <div className={css.detalhesIconText}>
                                        <img src={iconPrecipProb} alt="" />
                                        <p>Probabilidade de chuva</p>
                                    </div>
                                    <p>{dados.currentConditions.precipprob.toFixed(0)}%</p>
                                </div>
                                <div className={css.detalhesFull}>
                                    <div className={css.detalhesIconText}>
                                        <img src={iconWindSpeed} alt="" />
                                        <p>Velocidade do vento</p>
                                    </div>
                                    <p>{dados.currentConditions.windspeed.toFixed(0)} km/h</p>
                                </div>
                                <div className={css.detalhesFull}>
                                    <div className={css.detalhesIconText}>
                                        <img src={iconHumidity} alt="" />
                                        <p>Umidade do ar</p>
                                    </div>
                                    <p>{dados.currentConditions.humidity.toFixed(0)}%</p>
                                </div>
                                <div className={css.detalhesFull}>
                                    <div className={css.detalhesIconText}>
                                        <img src={iconUvIndex} alt="" />
                                        <p>Índice UV</p>
                                    </div>
                                    <p>{dados.currentConditions.uvindex.toFixed(0)}</p>
                                </div>
                            </div>
                            <div id={css.previsao}>
                                <>
                                    <p id={css.prev5dias}>Previsão para 5 dias</p>
                                    <div id={css.previsoes}>
                                        <div className={css.previsoesDias}>
                                            <p>Amanhã</p>
                                            <img src={getIcon(dados.days[1].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[1].tempmax.toFixed(0)}°C <span>{dados.days[1].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                        <div className={css.previsoesDias}>
                                            <p>{new Date(dados.days[3].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            <img src={getIcon(dados.days[2].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[2].tempmax.toFixed(0)}°C <span>{dados.days[2].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                        <div className={css.previsoesDias}>
                                            <p>{new Date(dados.days[4].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            <img src={getIcon(dados.days[3].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[3].tempmax.toFixed(0)}°C <span>{dados.days[3].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                        <div className={css.previsoesDias}>
                                            <p>{new Date(dados.days[5].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            <img src={getIcon(dados.days[4].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[4].tempmax.toFixed(0)}°C <span>{dados.days[4].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                        <div className={css.previsoesDias}>
                                            <p>{new Date(dados.days[6].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            <img src={getIcon(dados.days[5].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[5].tempmax.toFixed(0)}°C <span>{dados.days[5 ].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </section>
                    </div>
                </>
            ) : (
                <>
                    <div ref={popup} className={css.popup}></div>
                    <div className={css.logo}>
                        <img src={logo} alt="Logo" />
                        <p>WeatherData</p>
                    </div>
                    <div className={css.pesquisa}>
                        <div id={css.tituloTexto}>
                            <h2 className={css.boasVindas}>Boas vindas ao <span id={css.strong}>WeatherData</span></h2>
                            <p>Escolha um local para ver a previsão do tempo</p>
                        </div>
                            <div>
                                <div className={css.searchEngine}>
                                    <div>
                                        <input 
                                            ref={cityName} 
                                            type="text" 
                                            placeholder='Buscar local' 
                                            className={css.input}
                                            onChange={handleInputChange}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                        />
                                    </div>
                                    {loading && <img src={LoadingIcon} alt="..." />}
                                </div>
                            {suggestions.length > 0 && isFocused && (
                                <ul className={css.suggestionsDropdown}>
                                    {suggestions.map((s, index) => (
                                        <li
                                            className={css.suggestion}
                                            key={index}
                                            onClick={() => {
                                                if (cityName.current) {
                                                    cityName.current.value = s.name;
                                                }
                                                setSuggestions([]);
                                                searchCity();
                                            }}
                                        >
                                            {s.name} - {s.countryName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>

    )
}

export default WeatherData