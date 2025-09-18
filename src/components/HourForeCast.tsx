import type dadosInterface from "../Interfaces/dadosInterface";
import iconPrecipProb from "../assets/iconPrecipProb.svg";
import css from "../pages/WeatherData/style.module.css";

export default function HourForecast({
    hour,
    getIcon,
    dados,
    indexDay,
    indexHour
}: {
    hour: string;
    getIcon: (clima: string, hour: number) => string;
    dados: dadosInterface;
    indexDay: number;
    indexHour: number;
}) {
    const { conditions, temp, precipprob } = dados.days[indexDay].hours[indexHour];



    return (
        <div className={css.previsoesDias}>
            <>
                <p>{hour}:00</p>
                <img src={getIcon(conditions, Number(hour))} alt="Ícone do tempo" />
                <p>{temp.toFixed(0)}°C</p>
                <p id={css.precipForeCast}><img src={iconPrecipProb} alt="Chuva" />{precipprob.toFixed(0)}%</p>
            </>
        </div>
    );
}