    import css from './style.module.css'
    import logo from '../../assets/Logo.png'
    import axios from 'axios'
    import { useRef, useState, useEffect } from 'react'
    import ClearDay from '../../assets/ClearDay.png'
    import ClearNight from '../../assets/ClearNight.png'
    import CloudyDay from '../../assets/CloudyDay.png'
    import CloudyNight from '../../assets/CloudyNight.png'
    import RainDay from '../../assets/RainDay.png'
    import RainNight from '../../assets/RainNight.png'
    import SnowDay from '../../assets/SnowDay.png'
    import SnowNight from '../../assets/SnowNight.png'
    import Default from '../../assets/Default.png'

    function WeatherData() {
        const [dadosAtual, setDadosAtual] = useState<dadosAtualInterface>()
        const [dados, setDados] = useState<dadosInterface>()
        const key = '21c20658a9c6364742a4c2cb760a5672'
        const cityName = useRef<HTMLInputElement>(null);
        const tempDiv = useRef<HTMLDivElement>(null);

        const tempMinMax: {data: string, min: number; max: number }[] = []

        interface dadosAtualInterface {
            main: {
                temp: number
                feels_like: number
                humidity: number
                temp_max: number
                temp_min: number
            }
            wind: {
                speed: number
            }
            coord: {
                lat: number
                lon: number
            }
            weather: [{
                description: string
                main: string
            }]
            dt: number
            timezone: number
        }

        interface dadosInterface {
            city: {
                name: string
                country: string
            }
            list: {
                dt: number
                main: {
                    temp: number
                    temp_max: number
                    temp_min: number
                },
                dt_txt: string
                pop: number
            }[]
        }
        
        useEffect(() => {
            const handleKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    searchCity()
                }
            }

            document.addEventListener('keypress', handleKeyPress)
                return () => {
                    document.removeEventListener('keypress', handleKeyPress)
                }
        }, [])

        async function searchCity() {
            const apiAtual = await axios.get<dadosAtualInterface>(`https://api.openweathermap.org/data/2.5/weather?q=${cityName.current?.value}&appid=${key}&units=metric&lang=pt_br`)
            const tempA : dadosAtualInterface = apiAtual.data
            setDadosAtual(tempA)

            const api = await axios.get<dadosInterface>(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName.current?.value}&appid=${key}&units=metric&lang=pt_br`)
            const temp : dadosInterface = api.data
            setDados(temp)
        }

        const data = new Date()

        const hoje:string = data.toLocaleDateString(undefined, {
            weekday: 'long',
        });

        const optionsString: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const dataString:string = data.toLocaleDateString(undefined, optionsString);

        const optionsHour: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        }

        const dataHour:string = data.toLocaleTimeString(undefined, optionsHour)


        function getBackgroundImage(clima: string, hour: number) {
            const isNight = hour < 6 || hour >= 18
            const normalized = clima.toLowerCase()
            switch (normalized) {
                case 'clear': return isNight ? `url(${ClearNight})` : `url(${ClearDay})`
                case 'clouds': return isNight ? `url(${CloudyNight})` : `url(${CloudyDay})`
                case 'rain': return isNight ? `url(${RainNight})` : `url(${RainDay})`
                case 'snow': return isNight ? `url(${SnowNight})` : `url(${SnowDay})`
                default: return `url(${Default})`
            }
        }

        useEffect(() => {
            if (dadosAtual && tempDiv.current) {
                const now = new Date()
                const hour = now.getHours()
                tempDiv.current.style.backgroundImage = getBackgroundImage(dadosAtual.weather[0].main, hour)
            }
        }, [dadosAtual, dados, tempDiv.current])

        return (
            <div className={css.principal}>
                    {dados && dadosAtual ? (
                        <>
                        {
                            (() => {
                                const tempHoje = { data: hoje, min: dadosAtual.main.temp_min, max: dadosAtual.main.temp_max }
                                tempMinMax.push(tempHoje)

                                dados.list.forEach((item) => {
                                    const dayForecast = new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'long' })
                                    const index = tempMinMax.findIndex(obj => obj.data === dayForecast)
                                    if (index === -1) {
                                        tempMinMax.push({ data: dayForecast, min: item.main.temp_min, max: item.main.temp_max })
                                    } else {
                                        tempMinMax[index].min = Math.min(tempMinMax[index].min, item.main.temp_min)
                                        tempMinMax[index].max = Math.max(tempMinMax[index].max, item.main.temp_max)
                                    }
                                })
                            })()
                        }
                        <div id={css.resultado}>
                            <section id={css.pesquisaTemp}>
                            <div id={css.pesquisaDados}>
                                <img src={logo} alt="Logo"/>
                                <input ref={cityName} type="text" placeholder='Buscar local' id={css.input}/>
                            </div>
                            <div id={css.temperatura} ref={tempDiv}>
                                <div id={css.nomeDatas}>
                                    <div>
                                        <h2>{dados.city.name}, {dados.city.country}</h2>
                                        <p>{dataString}</p>
                                    </div>
                                    <p>{dataHour}</p>
                                </div>
                                <div>
                                    <h2>{dadosAtual.main.temp.toFixed(0)}°C</h2>
                                    <p>{tempMinMax[0].max.toFixed(0)}°C/{tempMinMax[0].min.toFixed(0)}°C • {dadosAtual.weather[0].description}</p>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div id={css.detalhes}>
                                <p>Detalhes do clima hoje</p>
                                <p>Sensação termica <span>{dadosAtual.main.feels_like.toFixed(0)}°C</span></p>
                                <p>Probabilidade de chuva <span>{dados.list[0].pop*100}%</span></p>
                                <p>Velocidade do vento <span>{dadosAtual.wind.speed.toFixed(0)} km/h</span></p>
                                <p>Umidade do ar <span>{dadosAtual.main.humidity}%</span></p>
                            </div>
                            <div id={css.previsao}>
                                <>
                                <p>Previsão para 5 dias</p>
                                <div id={css.previsoes}>
                                    {tempMinMax && tempMinMax.map((dia) => (
                                    <div key={dia.data} className={css.previsoesDias}>
                                        <p>{dia.data}</p>
                                        <p>{dia.max.toFixed(0)}°C/{dia.min.toFixed(0)}°C</p>
                                    </div>
                                    ))}
                                </div>
                                </>   
                            </div>       
                        </section>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className={css.logo}>
                            <img src={logo} alt="Logo"/>
                            <p>WeatherData</p>
                        </div>
                        <div className={css.pesquisa}>
                            <div>
                                <h2 className={css.boasVindas}>Boas vindas ao <span id={css.strong}>WeatherData</span></h2>
                                <p>Escolha um local para ver a previsão do tempo</p>
                            </div>
                            <input ref={cityName} type="text" placeholder='Buscar local' id={css.input}/>
                        </div>
                        </>
                    )}
            </div>
            
        )
    }

    export default WeatherData