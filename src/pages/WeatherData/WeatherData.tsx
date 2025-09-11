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

function WeatherData() {
    const [dados, setDados] = useState<dadosInterface>()
    const [dadosCity, setDadosCity] = useState<Array<dadosCityInterface>>()
    const key = '21c20658a9c6364742a4c2cb760a5672'
    const key2 = 'EGC5Y2WCAS5A8RVDE2996JDB9'
    const cityName = useRef<HTMLInputElement>(null);
    const tempDiv = useRef<HTMLDivElement>(null);
    const popup = useRef<HTMLDivElement>(null)


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
        country: string
        local_names: {
            pt: string
        }
        state: string
    }[]

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
            const apiCity = await axios.get<Array<dadosCityInterface>>(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName.current?.value}&limit=1&appid=${key}`)
            const city: Array<dadosCityInterface> = apiCity.data
            if (city.length > 0) setDadosCity(city)

            const api = await axios.get<dadosInterface>(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city[0].name)}?unitGroup=metric&key=${key2}&lang=pt-br&contentType=json`)
            const temp: dadosInterface = api.data
            setDados(temp)
        } catch (error) {
            ativaPopup("Cidade não encontrada!")
        }

    }


    function getBackgroundImage(clima: string, hour: number) {
        // console.log(hour)
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

    return (
        <div className={css.principal}>
            {dados && dadosCity ? (
                <>
                    <div ref={popup} className={css.popup}></div>
                    <div id={css.resultado}>
                        <section id={css.pesquisaTemp}>
                            <div id={css.pesquisaDados}>
                                <img src={logo} alt="Logo"/>
                                <input ref={cityName} type="text" placeholder='Buscar local' id={css.input}/>
                            </div>
                            <div id={css.temperatura} ref={tempDiv}>
                                <div id={css.nomeDatas}>
                                    <div>
                                        <h2>{dadosCity[0].local_names ? (dadosCity[0].local_names.pt) : (dadosCity[0].name)}, {dadosCity[0].state ? (dadosCity[0].state) : (dadosCity[0].country)}</h2>
                                        <p>{new Date(dados.currentConditions.datetimeEpoch * 1000).toLocaleDateString(undefined, {
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
                                <p><span><img src={iconFeelsLike} alt="" />Sensação termica</span> <span>{dados.currentConditions.feelslike.toFixed(0)}°C</span></p>
                                <p><span><img src={iconPrecipProb} alt="" />Probabilidade de chuva</span> <span>{dados.currentConditions.precipprob.toFixed(0)}%</span></p>
                                <p><span><img src={iconWindSpeed} alt="" />Velocidade do vento</span> <span>{dados.currentConditions.windspeed.toFixed(0)} km/h</span></p>
                                <p><span><img src={iconHumidity} alt="" />Umidade do ar</span> <span>{dados.currentConditions.humidity.toFixed(0)}%</span></p>
                                <p><span><img src={iconUvIndex} alt="" />Índice UV</span> <span>{dados.currentConditions.uvindex.toFixed(0)}</span></p>
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
                                            <p>{new Date(dados.days[2].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            <img src={getIcon(dados.days[2].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[2].tempmax.toFixed(0)}°C <span>{dados.days[2].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                        <div className={css.previsoesDias}>
                                            <p>{new Date(dados.days[3].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            <img src={getIcon(dados.days[3].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[3].tempmax.toFixed(0)}°C <span>{dados.days[3].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                        <div className={css.previsoesDias}>
                                            <p>{new Date(dados.days[4].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                            <img src={getIcon(dados.days[4].conditions, 12)} alt="Icone tempo" />
                                            <p>{dados.days[4].tempmax.toFixed(0)}°C <span>{dados.days[4].tempmin.toFixed(0)}°C</span></p>
                                        </div>
                                        <div className={css.previsoesDias}>
                                            <p>{new Date(dados.days[5].datetime).toLocaleDateString(undefined, { weekday: 'short' })}</p>
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
                        <div>
                            <h2 className={css.boasVindas}>Boas vindas ao <span id={css.strong}>WeatherData</span></h2>
                            <p>Escolha um local para ver a previsão do tempo</p>
                        </div>
                        <input ref={cityName} type="text" placeholder='Buscar local' id={css.input} />
                    </div>
                </>
            )}
        </div>

    )
}

export default WeatherData