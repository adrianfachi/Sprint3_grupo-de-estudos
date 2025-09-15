import css from "../pages/WeatherData/style.module.css"
import LoadingIcon from "../assets/Loading.svg"
import type { Ref, RefObject } from "react";
import type dadosCityInterface from "../Interfaces/dadosCityInterface";

export default function LocationInput({
	refInput,
	handleInputChange,
	setIsFocused,
	loading,
	suggestions,
	isFocused,
	cityName,
	setSuggestions,
	searchCity
} : {
	refInput: Ref<HTMLInputElement> | null,
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	setIsFocused: (e: boolean) => void
	loading: boolean
	suggestions: Array<dadosCityInterface>
	isFocused: boolean
	cityName: RefObject<HTMLInputElement | null>
	setSuggestions: (e: Array<dadosCityInterface>) => void
	searchCity: () => void
}) {
	return (
			<div>
				<div className={css.searchEngine}>
					<div>
						<input
							ref={refInput}
							type="text"
							placeholder="Buscar local"
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
										cityName.current.value = `${s.name}, ${s.adminName1}, ${s.countryName}`;
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
	);
}
