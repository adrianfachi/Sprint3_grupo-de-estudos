import axios from "axios";

export default async function translateDescription(desc: string): Promise<string> {
    if (!desc) {
        return '';
    }
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(desc)}`;
        const response = await axios.get(url);
        const translatedText = response.data[0][0][0];
        return translatedText;
    } catch (error) {
        console.error("Erro ao traduzir:", error);
        return desc; 
    }
}