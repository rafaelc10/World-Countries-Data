const countriesArea = document.querySelector('#countries')
const filterNameButton = document.querySelector('#filter-name')
const filterCapitalButton = document.querySelector('#filter-capital')
const filterPopulationButton = document.querySelector('#filter-population')
const inputSearch = document.querySelector('input[type=search]')

const renderCountries = async () => {
    const data = await countries()

    data.forEach(element => {
        const cloneCard = document.querySelector('.models .country-card').cloneNode(true);

        let languages = []
        for (const i in element.languages) {
            languages.push(element.languages[i].name)
        }

        cloneCard.querySelector('img').src = element.flag;
        cloneCard.querySelector('#country-name').innerHTML = element.name;
        cloneCard.querySelector('#capital').innerHTML = `Capital: ${element.capital}`
        cloneCard.querySelector('#language').innerHTML = `Languages: ${languages.join(', ')}`
        cloneCard.querySelector('#population').innerHTML = `Population: ${element.population.toLocaleString('pt-BR', {maximumFractionDigits: 2})}`
        countriesArea.appendChild(cloneCard)
    });
    renderGraphics()
}


let order = true;
filterNameButton.addEventListener('click', () => {
    arrowButtons()
    let divs = document.querySelectorAll('#countries .country-card');
    let elements = [].map.call(divs, function (element) {
        return element;
    });
    order = !order;
    elements.sort((a, b) => {
        const x = a.children[1].innerText
        const y = b.children[1].innerText
        return order ? x.localeCompare(y) : y.localeCompare(x);
    })

    if (order === false) {
        filterNameButton.innerText = 'Name ⬆️'
    } else {
        filterNameButton.innerText = 'Name ⬇️'
    }

    for (let i in elements) {
        countriesArea.appendChild(elements[i]);
    }
})

filterCapitalButton.addEventListener('click', () => {
    arrowButtons()
    let divs = document.querySelectorAll('#countries .country-card');
    let elements = [].map.call(divs, function (element) {
        return element;
    });
    order = !order;
    elements.sort((a, b) => {
        const x = a.children[2].innerText.replace('Capital: ', '');
        const y = b.children[2].innerText.replace('Capital: ', '');
        return order ? x.localeCompare(y) : y.localeCompare(x);
    })
    if (order === false) {
        filterCapitalButton.innerText = 'Capital ⬆️'
    } else {
        filterCapitalButton.innerText = 'Capital ⬇️'
    }
    for (let i in elements) {
        countriesArea.appendChild(elements[i]);
    }
})

filterPopulationButton.addEventListener('click', () => {
    arrowButtons()
    let divs = document.querySelectorAll('#countries .country-card');
    let elements = [].map.call(divs, function (element) {
        return element;
    });
    order = !order;
    elements.sort((a, b) => {
        const x = a.children[4].innerText.replace('Population: ', '');
        const y = b.children[4].innerText.replace('Population: ', '');
        return order ? x - y : y - x;
    })

    if (order === false) {
        filterPopulationButton.innerText = 'Population ⬆️'
    } else {
        filterPopulationButton.innerText = 'Population ⬇️'
    }

    for (let i in elements) {
        countriesArea.appendChild(elements[i]);
    }
})

const arrowButtons = () => {
    filterPopulationButton.innerText = "Population"
    filterCapitalButton.innerText = "Capital"
    filterNameButton.innerText = "Name"
}

inputSearch.addEventListener('input', () => {
    let divs = document.querySelectorAll('#countries .country-card');
    let elements = [].map.call(divs, function (element) {
        return element;
    });
    for (let i in elements) {
        let country = elements[i].children[1].innerText.toLowerCase();
        let capital = elements[i].children[2].innerText.toLowerCase();
        if (country.includes(inputSearch.value.toLowerCase()) || capital.includes(inputSearch.value.toLowerCase())) {
            elements[i].style.display = "";
        } else {
            elements[i].style.display = "none";
        }
    }
})
const populationSome = async () => {
    const data = await countries()

    const worldPopulation = await data.reduce((acc, item) => acc + item.population, 0);
    return worldPopulation;
}

let elements = []

const renderGraphics = async () => {
    const graphicLineName = document.querySelector('.graphic-line-name')
    const graphicLineData = document.querySelector('.graphic-line-data')


    const data = await countries()
    elements = [].map.call(data, function (element) {
        return { 'country': element.name, 'population': element.population }
    });

    elements.sort((a, b) => {
        return b.population - a.population;
    })

    for (let i = 0; i < 11; i++) {
        const graphicData = document.querySelector('.graphics-data')
        const newGraphicLine = document.createElement('div')
        const newGraphicLineName = document.createElement('span')
        const newGraphicLineBar = document.createElement('div')
        const newGraphicLineBar2 = document.createElement('div')
        const newGraphicLineData = document.createElement('span')

        newGraphicLine.classList.add('graphic-line')
        newGraphicLineName.classList.add('graphic-line-name')
        newGraphicLineBar.classList.add('graphic-line-bar')
        newGraphicLineBar2.classList.add('graphic-line-bar2')
        newGraphicLineData.classList.add('graphic-line-data')

        newGraphicLine.appendChild(newGraphicLineName)
        newGraphicLine.appendChild(newGraphicLineBar)
        newGraphicLine.appendChild(newGraphicLineData)
        newGraphicLineBar.appendChild(newGraphicLineBar2);

        let barPercentage = (elements[i].population * 10) / 775943810
        newGraphicLineBar2.style.width = barPercentage.toFixed(2) + "%"

        newGraphicLineName.innerText = elements[i].country
        newGraphicLineData.innerText = elements[i].population.toLocaleString('pt-BR', {
            maximumFractionDigits: 2
        })

        graphicData.appendChild(newGraphicLine)
    }

    graphicLineName.innerText = "World"
    const worldPopulation = await populationSome()
    graphicLineData.innerText = worldPopulation.toLocaleString('pt-BR', {
        maximumFractionDigits: 2
    });

}

const buttonPopulation = document.querySelector('#filter-graphic-population');
const buttonLanguages = document.querySelector('#filter-graphic-languages')

buttonLanguages.addEventListener('click', () => {
    renderLanguages();
})
buttonPopulation.addEventListener('click', ()=> {
    renderPopulation();
})

let countriesMap = [];
const mostSpokenLanguages = async (object, tamanho) => {
    const data = await countries();
    let countriesReduce = await data.reduce(function (object, item) {
        let length = item.languages.length;

        for (let i = 0; i < length; i++) {
            if (!object[item.languages[i].name]) {
                object[item.languages[i].name] = 1;
            } else {
                object[item.languages[i].name]++;
            }
        }
        return object;
    }, {})

    let countriesKeys = Object.keys(countriesReduce)
    let countriesValues = Object.values(countriesReduce)

    for (let i = 0; i < countriesKeys.length; i++) {
        countriesMap.push({ 'language': countriesKeys[i], 'count': countriesValues[i] });
    }
    countriesMap.sort((a, b) => b.count - a.count)
}

const renderLanguages = () => {
    const graphicLines = document.querySelectorAll('.graphics-data .graphic-line')
    document.querySelector('#graphic-span').innerText = "Most Spoken Languages"
    for (let i = 0; i < graphicLines.length; i++) {
        const graphicLineName = graphicLines[i].querySelector('.graphic-line-name')
        const graphicLineBar2 = graphicLines[i].querySelector('.graphic-line-bar2')
        const graphicLineData = graphicLines[i].querySelector('.graphic-line-data')
        graphicLineName.innerText = countriesMap[i].language;
        let barPercentage = (countriesMap[i].count * 100) / 91
        graphicLineBar2.style.width = barPercentage.toFixed(2) + "%"
        graphicLineData.innerText = countriesMap[i].count
    }
}

const renderPopulation = () => {
    elements.sort((a, b) => {
        return b.population - a.population;
    })
    const graphicLines = document.querySelectorAll('.graphics-data .graphic-line')
    document.querySelector('#graphic-span').innerText = "World Population"
    const graphicLineNameWorld = document.querySelector('.graphic-line-name');
    const graphicLineDataWorld = document.querySelector('.graphic-line-data')
    graphicLineNameWorld.innerText = "World"
    const worldPopulation = 7759438109;
    graphicLineDataWorld.innerText = worldPopulation.toLocaleString('pt-BR', {
        maximumFractionDigits: 2
    });
    for (let i = 0; i < graphicLines.length - 1; i++) {
        const graphicLineName = graphicLines[i+1].querySelector('.graphic-line-name')
        const graphicLineBar2 = graphicLines[i+1].querySelector('.graphic-line-bar2')
        const graphicLineData = graphicLines[i+1].querySelector('.graphic-line-data')

        graphicLineName.innerText = elements[i].country
        let barPercentage = (elements[i].population * 10) / 775943810
        graphicLineBar2.style.width = barPercentage.toFixed(2) + "%"
        graphicLineData.innerText = elements[i].population.toLocaleString('pt-BR', {maximumFractionDigits: 2});
    }
}
mostSpokenLanguages()
renderCountries()