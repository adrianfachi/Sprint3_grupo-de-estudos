import css from "../pages/WeatherData/style.module.css"
import type dadosInterface from "../Interfaces/dadosInterface"

export default function DayForeCast({
    day,
    getIcon,
    dados,
    indexDay
} : {
    day: string
    getIcon: (clima: string, hour: number) => string
    dados: dadosInterface
    indexDay: number
}) {
    const { conditions, tempmax, tempmin } = dados.days[indexDay]
    return (
        <div className={css.previsoesDias}>
            <p>{day}</p>
            <img src={getIcon(conditions, 12)} alt="Icone tempo" />
            <p>{tempmax.toFixed(0)}°C <span>{tempmin.toFixed(0)}°C</span></p>
        </div>
    )
}