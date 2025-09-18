import css from "./style.module.css";
import logo from "../../assets/Logo.svg";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import getBackgroundImage from "../../functions/getBackgroundImage.tsx";
import getIcon from "../../functions/getIcon.tsx";
import handleInputChange from "../../functions/handleInputChange.tsx";
import LocationInput from "../../components/LocationInput";
import DayForeCast from "../../components/ForeCast";
import WeatherDetails from "../../components/Details";
import HourForecast from "../../components/HourForeCast.tsx";
import type dadosInterface from "../../Interfaces/dadosInterface";
import type dadosCityInterface from "../../Interfaces/dadosCityInterface";

function WeatherData() {
	const [dados, setDados] = useState<dadosInterface>();
	const [dadosCity, setDadosCity] = useState<dadosCityInterface[]>();
	const [suggestions, setSuggestions] = useState<dadosCityInterface[]>([]);
	const key2 = "EGC5Y2WCAS5A8RVDE2996JDB9";
	const cityName = useRef<HTMLInputElement>(null);
	const tempDiv = useRef<HTMLDivElement>(null);
	const popup = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const cities: string[] = JSON.parse(localStorage.getItem("cities") || '[]');

	useEffect(() => {
		const enter = (event: KeyboardEvent) => {
			if (event.key === "Enter") {
				searchCity();
			}
		};
		document.addEventListener("keypress", enter);
		return () => {
			document.removeEventListener("keypress", enter);
		};
	}, []);

	async function searchCity() {
		try {
			setLoading(true);
			const apiCity = await axios.get<{ geonames: dadosCityInterface[] }>(
				`https://secure.geonames.org/searchJSON?q=${cityName.current?.value}&username=WeatherData&maxRows=10`
			);
			const city: dadosCityInterface[] = apiCity.data.geonames;
			const arrayCitys: dadosCityInterface[] = [];
			city.map((city) => {
				if (city.fclName.includes("city")) {
					arrayCitys.push(city);
				}
			});
			const location = `${arrayCitys[0].name} - ${arrayCitys[0].countryName}`;

			if(cities.indexOf(location) == -1) {
				if (cities.length < 5) {
					cities.unshift(location)
				} else {
					cities.pop()
					cities.unshift(location)
				}
			} else {
				const indexRemove = cities.indexOf(location)
				cities.splice(indexRemove, 1)
				cities.unshift(location)
			}

			if (city.length > 0) {
				setDadosCity(arrayCitys)
				localStorage.setItem("cities", JSON.stringify(cities));
			}

			
			const api = await axios.get<dadosInterface>(
				`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
					location
				)}?unitGroup=metric&key=${key2}&contentType=json`
			);
			const temp: dadosInterface = api.data;
			setDados(temp);
			setSuggestions([]);
			if (cityName.current) {
				cityName.current.value = "";
			}
		} catch (error) {
			ativaPopup("Cidade não encontrada!");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (dados && tempDiv.current) {
			tempDiv.current.style.backgroundImage = getBackgroundImage(
				dados.currentConditions.conditions,
				Number(dados.currentConditions.datetime.slice(0, 2))
			);
		}
	}, [dados, tempDiv.current]);

	function ativaPopup(valor: string) {
		if (popup.current) {
			popup.current.innerHTML = valor;
			popup.current.className = css.popupAtivo;
			setTimeout(() => {
				if (popup.current) {
					popup.current.className = css.popup;
				}
			}, 2000);
		}
	}

	function getNextHour() {
		const data = new Date();
		data.setHours(data.getHours() + 1);

		return data.toLocaleTimeString(undefined, { hour: "2-digit" });
	}

	return (
		<div className={css.principal}>
			{dados && dadosCity ? (
				<>
					<div ref={popup} className={css.popup}></div>
					<div id={css.resultado}>
						<section id={css.pesquisaTemp}>
							<div id={css.pesquisaDados}>
								<img src={logo} alt="Logo" onClick={() => {location.reload()}}/>
								<LocationInput
									refInput={cityName}
									handleInputChange={(e) =>
										handleInputChange({ e, setSuggestions, cityName })
									}
									setIsFocused={setIsFocused}
									loading={loading}
									suggestions={suggestions}
									isFocused={isFocused}
									cityName={cityName}
									setSuggestions={setSuggestions}
									searchCity={searchCity}
								/>
							</div>
							<div id={css.temperatura} ref={tempDiv}>
								<div id={css.nomeDatas}>
									<div>
										<h2>
											{dadosCity[0] ? dadosCity[0].name : ""}
											{dadosCity[0].adminName1
												? ", " + dadosCity[0].adminName1
												: ""}
											{dadosCity[0].countryName
												? ", " + dadosCity[0].countryName
												: ""}
										</h2>
										<p>
											{new Date(dados.days[1].datetime).toLocaleDateString(
												undefined,
												{
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												}
											)}
										</p>
									</div>
									<p>{dados.currentConditions.datetime.slice(0, 5)}</p>
								</div>
								<div id={css.tempIcon}>
									<div>
										<h2>{dados.currentConditions.temp.toFixed(0)}°C</h2>
										<p>
											{dados.days[0].tempmax.toFixed(0)}°C /{" "}
											{dados.days[0].tempmin.toFixed(0)}°C
										</p>
									</div>
									<img
										src={getIcon(
											dados.currentConditions.conditions,
											Number(dados.currentConditions.datetime.slice(0, 2))
										)}
										alt="Icone tempo"
									/>
								</div>
							</div>
							<div className={css.ForeCastHour}>
								<>
									{[0, 1].map((day) =>
										dados.days[day].hours.map((hour) => {
											if (
												(hour.datetime.slice(0, 2) >= getNextHour() &&
													day === 0) ||
												(hour.datetime.slice(0, 2) < getNextHour() && day === 1)
											) {
												return (
													<HourForecast
														key={`${day}-${hour.datetime}`} // sempre bom usar key no map
														hour={hour.datetime.slice(0, 2)}
														getIcon={getIcon}
														dados={dados}
														indexDay={day}
														indexHour={Number(hour.datetime.slice(0, 2))}
													/>
												);
											}
											return null
										})
									)}
								</>
							</div>
						</section>
						<section>
							<WeatherDetails dados={dados} />
							<div id={css.previsao}>
								<>
									<p id={css.prev5dias}>Previsão para 5 dias</p>
									<div id={css.previsoes}>
										<DayForeCast
											day={"amanhã"}
											getIcon={getIcon}
											dados={dados}
											indexDay={1}
										/>
										{[2, 3, 4, 5].map((item, index) => (
											<DayForeCast
												key={index}
												day={new Date(
													dados.days[item + 1].datetime
												).toLocaleDateString(undefined, { weekday: "short" })}
												getIcon={getIcon}
												dados={dados}
												indexDay={item}
											/>
										))}
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
							<h2 className={css.boasVindas}>
								Boas vindas ao <span id={css.strong}>WeatherData</span>
							</h2>
							<p>Escolha um local para ver a previsão do tempo</p>
						</div>
						<div>
							<LocationInput
								refInput={cityName}
								handleInputChange={(e) =>
									handleInputChange({ e, setSuggestions, cityName })
								}
								setIsFocused={setIsFocused}
								loading={loading}
								suggestions={suggestions}
								isFocused={isFocused}
								cityName={cityName}
								setSuggestions={setSuggestions}
								searchCity={searchCity}
							/>
						</div>
						<div id={css.citiesPesquisadas}>
							<>
								{cities.map((city, index) => {
									return (
										<input key={index} type="button" value={city} onClick={() => {
											if (cityName.current) {
												cityName.current.value = city
											}
											searchCity();
										}
										}/>
									)
								})}
							</>
						</div>
					</div>
					
				</>
			)}
		</div>
	);
}

export default WeatherData;
