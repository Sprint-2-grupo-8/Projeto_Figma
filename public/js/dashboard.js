let data_atual = new Date();
let data_formatada = data_atual.toLocaleDateString('pt-BR');
console.log(
    'ID recebida:',
    sessionStorage.getItem('ID_ESTUFA_FILTER')
);
const dataAtualElement = document.getElementById('data_atual');
if (dataAtualElement) {
    dataAtualElement.innerText = data_formatada;
}

//o querySelectorAll retorna uma lista de todos os elementos que possuem a determinada classe
const grafico_geral = document.querySelectorAll('.geral');
const grafico_individual = document.querySelectorAll('.individual');
const indicadores_gerais = document.querySelector('.indicadores');
const indicadores_individuais = document.querySelector('.indicadores-individual');

function filter(idEstufa) {
    console.log('filter chamado com:', idEstufa);
    const tipo_dash = document.getElementById('filter');
    const escolha = tipo_dash.querySelector('option:checked');
    const estufa_escolhida = escolha ? escolha.dataset.estufa : undefined;
    // se estufa_escolhida == undefined, signfica que nenhuma estufa individual foi escolhida

    if (idEstufa != undefined) {
        tipo_dash.value = 'individual';

        let option_alerta = tipo_dash.querySelector(
            `option[data-estufa="${idEstufa}"]`
        );  
            option_alerta.selected = true;

    }

    if (tipo_dash.value === 'geral' || !(idEstufa || estufa_escolhida)) {

        buscarKpisGerais();
        buscarRankingAlertas();

        for (let i = 0; i < grafico_geral.length; i++) {
            grafico_geral[i].style.display = 'flex';
        }

        for (let i = 0; i < grafico_individual.length; i++) {
            grafico_individual[i].style.display = 'none';
        }

        indicadores_gerais.style.display = 'flex';
        indicadores_individuais.style.display = 'none';

    } else if (tipo_dash.value === 'individual' || (idEstufa || estufa_escolhida)) {
        console.log('Entrou na visão individual');

        for (let i = 0; i < grafico_geral.length; i++) {
            grafico_geral[i].style.display = 'none';
        }

        for (let i = 0; i < grafico_individual.length; i++) {
            grafico_individual[i].style.display = 'flex';
        }

        indicadores_gerais.style.display = 'none';
        indicadores_individuais.style.display = 'flex';

        obterDadosGrafico((idEstufa || estufa_escolhida));
        buscarRegistros((idEstufa || estufa_escolhida));
    }
}

function buscarKpisGerais() {
    fetch("/medidas/menor-concentracao-geral", { cache: "no-store" })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    menor_estufa.innerHTML = resposta[0].nome;
                    menor_ppm.innerHTML = resposta[0].ppm + " ppm";
                });
            }
        });

    fetch("/medidas/maior-concentracao-geral", { cache: "no-store" })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    maior_estufa.innerHTML = resposta[0].nome;
                    maior_ppm.innerHTML = resposta[0].ppm + " ppm";
                });
            }
        });

    fetch("/medidas/estufas-em-alerta", { cache: "no-store" })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    qtd_estufas_alerta.innerHTML = resposta[0].qtd_estufas_alerta + " estufas";
                });
            }
        });
}

function buscarRankingAlertas() {

    fetch("/medidas/ranking-alertas", { cache: "no-store" })
        .then(function (response) {

            if (response.status == 204) {
                console.log("Nenhum alerta encontrado para o ranking");
                return;
            }

            if (response.ok) {
                response.json().then(function (resposta) {

                    let labels = [];
                    let dados = [];

                    for (let i = 0; i < resposta.length; i++) {
                        labels.push(resposta[i].nome);
                        dados.push(resposta[i].qtd_alertas);
                    }

                    atualizarGraficoRanking(labels, dados);
                });
            } else {
                console.error("Erro ao buscar ranking de alertas");
            }
        })
        .catch(function (erro) {
            console.log(erro);
        });

}

function atualizarGraficoRanking(labels, dados) {

    bar_data.labels = labels;
    bar_data.datasets[0].data = dados;

    ranking_estufas.update();
}

function buscarPercentualRegistrosPorFaixa() {

    fetch("/medidas/percentual-registros-faixa", { cache: "no-store" })
        .then(function (response) {

            if (response.status == 204) {
                console.log("Nenhum registro encontrado para o percentual por faixa");
                return;
            }

            if (response.ok) {

                response.json().then(function (resposta) {

                    let dados = [
                        resposta[0].ideal,
                        resposta[0].intermediaria,
                        resposta[0].critica
                    ];

                    atualizarGraficoPercentual(dados);

                });

            } else {
                console.error("Erro ao buscar percentual por faixa");
            }

        })
        .catch(function (erro) {
            console.log(erro);
        });

}

