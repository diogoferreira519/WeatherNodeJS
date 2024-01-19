let fetchWeather = '/weather';
const apiIp = 'http://ip-api.com/json/';
let search = document.querySelector('#search');
let cityInput = document.querySelector('#city-input');
let cityName = document.querySelector('#city');
let descricao = document.querySelector('#description');
let temperature = document.querySelector('#temperature span');
let umidade = document.querySelector('#humidity span');
let icone = document.querySelector('#HowareWeather');
let wind = document.querySelector('#wind span');
let fundoCard = document.querySelector('.fundocard');
let loading = document.querySelector('#loading');
let container = document.querySelector('.container');
let sugestoesContainer = document.getElementById('sugestoes');

consultaCidadeAtual();


cityInput.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        pesquisa();
    }
});


cityInput.addEventListener('input', function () {
    const termoPesquisa = cityInput.value;
    if (termoPesquisa.length < 3) {
        sugestoesContainer.style.display = 'none';
        return;
    }

    buscarSugestoes(termoPesquisa)
        .then(sugestoes => {
            return mostrarSugestoes(sugestoes);
        })
        .catch(error => {
            console.error('Erro ao obter sugestões:', error);
        });

});

search.addEventListener("click", function (e) {
    e.preventDefault();
    pesquisa();
});

container.addEventListener('click', () => {
    sugestoesContainer.style.display = 'none';
});

function pesquisa() {
    let inputCidade = cityInput.value.trim();
    if (inputCidade === '') {
        alert('o campo cidade não pode estar vazio');
    } else {
        consultaCidade(inputCidade);
        loading.style.display = 'block';
        container.classList.add('blur-effect');
    }
}

function buscarSugestoes(pesquisa) {
    
    return fetch(urlSearch)
        .then(response => {
            if (!response.ok) {
                alert('Erro ao realizar a requisição');
                throw new Error('Erro de rede na pesquisa- ${response.status}');
            }
            return response.json()
        })
        .then(data => {
            let cidades = data.list.map(cidade => cidade.name);
            return cidades;
        })
        .catch(error => {
            console.error('erro na busca de sugestões ' + error);
        })
}
async function mostrarSugestoes(nomesCidades) {
    const listaPronta = nomesCidades.map(cidades => `<li onclick='itemLista(event)'>${cidades}</li>`).join('');
    sugestoesContainer.innerHTML = `<ul>${listaPronta}</ul>`
    sugestoesContainer.style.display = 'block';
}
function consultaCidadeAtual() {
    fetch(apiIp).then(response => {
        if (!response.ok) {
            loading.style.display = 'none';
            container.classList.remove('blur-effect');
            alert('Erro:' + response.error.message);
            throw new Error('Erro de rede - ${response.status}');
        }
        return response.json();
    }).then(data => {
        consultaCidade(data.city);
    }).catch(error => {
        alert('Erro na solicitação:' + error.message)
        console.error('Erro na solicitação', error);
        loading.style.display = 'none';
        container.classList.remove('blur-effect');
    });
}
function consultaCidade(city) {
    let apiWeather = fetchWeather + '/?address=' + city;
    console.log(apiWeather)
     fetch(apiWeather)
        .then(response => {
            console.log(response)
            return response.json()
        })
        .then(data => {
            if (!data) {
                console.log(data)
                console.error('Erro na response da API weather');
                cityInput.value = '';
                loading.style.display = 'none';
                container.classList.remove('blur-effect');
                alert('Insira uma cidade válida');
            }
            else {
                return data;
            }
        })
        .then(data => {
            preencheCard(data);
        })
        .catch(error => {
            cityInput.value = '';
            loading.style.display = 'none';
            container.classList.remove('blur-effect');
            alert('Erro na solicitação:' + error.message)
        });
}
function itemLista(e) {
    cityInput.value = e.target.textContent;
    let cidadeSelecionada = cityInput.value;
    sugestoesContainer.style.display = 'none';
    consultaCidade(cidadeSelecionada);
    loading.style.display = 'block';
    container.classList.add('blur-effect');
}
function preencheCard(dados) {
    console.log(dados)
    cityName.innerHTML = dados.cityName;
    temperature.innerHTML = dados.temperature;
    umidade.innerHTML = dados.umidade;
    wind.innerHTML = dados.wind;
    let main = dados.main;
    const nascerdoSolTimeStamp = dados.nascerdoSolTimeStamp;
    const pordoSolTimeStamp = dados.pordoSolTimeStamp;
    let nascerdoSol = new Date(nascerdoSolTimeStamp * 1000);
    let porDoSol = new Date(pordoSolTimeStamp * 1000);
    const agora = new Date();
    if (agora > nascerdoSol && agora < porDoSol) {
        fundoCard.style.backgroundImage = 'url("../assets/background/dia.svg")';

        if (main === 'Rain' || main === 'Drizzle') {
            icone.src = '../assets/icones/dia chuvoso.svg'
        }
        else if (main === 'Thunderstorm') {
            icone.src = '../assets/icones/tempestade.svg'
        }
        else if (main === 'Snow') {
            icone.src = '../assets/icones/neve.svg'
        }
        else if (main === 'Clear') {
            icone.src = '../assets/icones/dia.svg'
        }
        else {
            icone.src = '../assets/icones/dia nublado.svg'
            fundoCard.style.backgroundImage = 'url("../assets/background/nublado.svg")';
        }
    } else {
        fundoCard.style.backgroundImage = 'url("../assets/background/noite.svg")';
        if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') {
            icone.src = '../assets/icones/tempestade.svg'
        }
        else if (main === 'Clear') {
            icone.src = '../assets/icones/noite.svg'
        }
        else if (main === 'Snow') {
            icone.src = '../assets/icones/neve.svg'
        }
        else {
            icone.src = '../assets/icones/noite nublada.svg'
        }
    }
    if (main === 'Thunderstorm' || main === 'Squall') {
        icone.src = '../assets/icones/tempestade.svg'
    }
    if (main === 'Snow') {
        icone.src = '../assets/icones/neve.svg'
    }

    let tempo = dados.descricao
    descricao.innerHTML = tempo;
    loading.style.display = 'none';
    container.classList.remove('blur-effect');
    sugestoesContainer.style.display = 'none';
    cityInput.value = '';
}
