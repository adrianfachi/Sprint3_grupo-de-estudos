export default interface dadosInterface {
    days: {
        conditions: string
        datetime: string
        tempmax: number
        tempmin: number
        precipprob: number
        precip: number
        description: string
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