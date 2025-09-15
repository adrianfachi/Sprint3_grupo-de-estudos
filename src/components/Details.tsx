import css from "../pages/WeatherData/style.module.css"
import iconFeelsLike from "../assets/iconFeelsLike.svg"
import iconPrecipProb from "../assets/iconPrecipProb.svg"
import iconWindSpeed from "../assets/iconWindSpeed.svg"
import iconHumidity from "../assets/iconHumidity.svg"
import iconUvIndex from "../assets/iconUvIndex.svg"
import type dadosInterface from "../Interfaces/dadosInterface"

export default function WeatherDatails ({
    dados
}:{
    dados: dadosInterface
}) {
    return (
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
    )
}