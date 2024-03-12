document.getElementById("botao").addEventListener('click', consultarDados);


//Armazenamos os códigos de cada estado.
const estadoNomes = {
    "11": "RO",
    "12": "AC",
    "13": "AM",
    "14": "RR",
    "15": "PA",
    "16": "AP",
    "17": "TO",
    "21": "MA",
    "22": "PI",
    "23": "CE",
    "24": "RN",
    "25": "PB",
    "26": "PE",
    "27": "AL",
    "28": "SE",
    "29": "BA",
    "31": "MG",
    "32": "ES",
    "33": "RJ",
    "34": "SP",
    "35": "MG",
    "41": "PR",
    "42": "SC",
    "43": "RS",
    "50": "MS",
    "51": "MT",
    "52": "GO",
    "53": "DF"  
}

// Esta função assíncrona busca dados de uma URL fornecida.
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}


//Esta função puxa os dados que foram inseridos nos campos de input e faz a requisição para a API do IBGE
async function consultarDados() {
    
    let nomeConsultado = document.getElementById("nome").value;
    let estadoConsultado = document.getElementById("estado").value;
    let resultDiv = document.getElementById("tabelaResultado");
    let infoDiv = document.getElementById("infoResulado");


    //Verifica se o campo de nome está vazio
    if (!nomeConsultado.trim()) {
        alert('Por favor, insira um nome.');
        return;
    } 
    
    //Se o campo de estado estiver vazio, a requisição é feita para o Brasil inteiro
    else if (estadoConsultado === "BR"){
        fetch(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/${nomeConsultado}?groupBy=UF`)
            .then(resposta => resposta.json())
            .then(dados => {
                    infoDiv.innerHTML = `  
                            <p><strong>Nome:</strong> ${nomeConsultado}</p>
                        `;
                    resultDiv.innerHTML = `
                        <thead id="tabelaCabecalho">
                            <tr>
                                <th class="localidade">Código</th>
                                <th class="estado">Estado</th>
                                <th class="populacao">População</th>
                                <th class="frequencia">Frequência</th>
                                <th class="proporcao">Proporção</th>
                            </tr>
                        </thead>
                    `;
                    dados.forEach(dado => {
                        dado.res.forEach(item => {
                            const estadoNome = estadoNomes[dado.localidade];
                            resultDiv.innerHTML += `
                                <tr>
                                    <td class="localidadeResult">${dado.localidade}</td>
                                    <td class="estadoResult">${estadoNome}</td>
                                    <td class="populacaoResult">${item.populacao}</td>
                                    <td class="frequenciaResult">${item.frequencia}</td>
                                    <td class="proporcaoResult">${item.proporcao}</td>
                                </tr>
                            `;
                        });
                    });                    
            })
            .catch(error => {
               alert(`Erro na requisição! ${error}`);
            });
    }
    else if (estadoConsultado !== "BR"){
        fetch(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/${nomeConsultado}?localidade=${estadoConsultado}`)
            .then(resposta => resposta.json())
            .then(dados => {
                resultDiv.innerHTML = `
                        <thead id="tabelaCabecalho">
                            <tr>
                                <th class="estado">Estado</th>
                                <th class="periodo">Periodo</th>
                                <th class="frequencia">Frequencia</th>
                            </tr>
                        </thead>
                    `;
                    dados.forEach(dado => {
                        dado.res.forEach(item => {
                            const estadoNome = estadoNomes[dado.localidade];
                            resultDiv.innerHTML += `
                                <tr>
                                    <td class="estadoResult">${estadoNome}</td>
                                    <td class="periodoResult">${item.periodo}</td>
                                    <td class="frequenciaResult">${item.frequencia}</td>
                                </tr>
                            `;
                        });
                    });         
            })
            .catch(error => {
                alert(`Erro na requisição! ${error}`);
            });
    }
}

