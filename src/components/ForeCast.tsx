import type dadosInterface from "../Interfaces/dadosInterface";
import iconPrecipProb from "../assets/iconPrecipProb.svg";
import { useState, useEffect } from "react";
import css from "../pages/WeatherData/style.module.css";
import translateDescription from "../functions/translateCondition";

export default function DayForeCast({
    day,
    getIcon,
    dados,
    indexDay
}: {
    day: string;
    getIcon: (clima: string, hour: number) => string;
    dados: dadosInterface;
    indexDay: number;
}) {
    const { conditions, tempmax, tempmin, precipprob, description, precip } = dados.days[indexDay];
    const [active, setActive] = useState(false);
    const [translatedDescription, setTranslatedDescription] = useState('');

    useEffect(() => {
        const fetchTranslation = async () => {
            const text = await translateDescription(description);
            setTranslatedDescription(text);
        };
        fetchTranslation();
    }, [description]);


    return (
        <div className={`${css.previsoesDias} ${active ? css.active : ""}`} id={css.prevDay} onClick={() => { setActive(!active)}}>
            {active ? (
                <>
                    <p>{day}</p>
                    <img src={getIcon(conditions, 12)} alt="Ícone do tempo" />
                    <p>{tempmax.toFixed(0)}°C <span>{tempmin.toFixed(0)}°C</span></p>
                    <p id={css.precipForeCast}><img src={iconPrecipProb} alt="Chuva" />{precipprob.toFixed(0)}% | {precip}mm</p>
                    <p>{translatedDescription}</p>
                </>
            ) : (
                <>
                    <p>{day}</p>
                    <img src={getIcon(conditions, 12)} alt="Ícone do tempo" />
                    <p>{tempmax.toFixed(0)}°C <span>{tempmin.toFixed(0)}°C</span></p>
                </>
            )}
        </div>
    );
}