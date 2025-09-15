import type dadosCityInterface from "../Interfaces/dadosCityInterface";
import axios from "axios";
import type { RefObject } from "react";

export default async function handleInputChange({
    e,
    setSuggestions,
    cityName
}:{
    e: React.ChangeEvent<HTMLInputElement>
    setSuggestions: (e: Array<dadosCityInterface>) => void
    cityName: RefObject<HTMLInputElement | null>
}) {
    const value = e.target.value;
    if (value.length < 1) {
        setSuggestions([]);
        return;
    }

    try {
        const { data: res } = await axios.get<{ geonames: dadosCityInterface[] }>(
            `https://secure.geonames.org/searchJSON?q=${cityName.current?.value}&username=WeatherData&maxRows=10`
        );

        const arraySuggestions: dadosCityInterface[] = []
        res.geonames.map((city) => {
            if (city.fclName.includes("city")) {
                arraySuggestions.push(city);
            }
        })
        setSuggestions(arraySuggestions)
    } catch (error) {
        setSuggestions([]);
    }
}