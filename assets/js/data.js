const countries = async () => {
    const api = await fetch('https://restcountries.com/v2/all')
    const data = await api.json()
    return data;
}