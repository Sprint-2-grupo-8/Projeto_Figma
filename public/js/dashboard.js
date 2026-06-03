let data_atual = new Date();
let data_formatada = data_atual.toLocaleDateString('pt-BR');

document.getElementById('data_atual').innerText = data_formatada;

//o querySelectorAll retorna uma lista de todos os elementos que possuem a determinada classe
const grafico_geral = document.querySelectorAll('.geral');
const grafico_individual = document.querySelectorAll('.individual');
const indicadores_gerais = document.querySelector('.indicadores');
const indicadores_individuais = document.querySelector('.indicadores-individual');

function filter() {
    const tipo_dash = document.getElementById('filter');
    const escolha = tipo_dash.querySelector('option:checked');
    const estufa_escolhida = escolha.dataset.estufa;
    // se estufa_escolhida == undefined, signfica que nenhuma estufa individual foi escolhida
    

    if (tipo_dash.value === 'geral') {

        for (let i = 0; i < grafico_geral.length; i++) {
            grafico_geral[i].style.display = 'flex';
        }

        for (let i = 0; i < grafico_individual.length; i++) {
            grafico_individual[i].style.display = 'none';
        }

        indicadores_gerais.style.display = 'flex';
        indicadores_individuais.style.display = 'none';

    } else if (tipo_dash.value === 'individual') {

        for (let i = 0; i < grafico_geral.length; i++) {
            grafico_geral[i].style.display = 'none';
        }

        for (let i = 0; i < grafico_individual.length; i++) {
            grafico_individual[i].style.display = 'flex';
        }

        indicadores_gerais.style.display = 'none';
        indicadores_individuais.style.display = 'flex';

        obterDadosGrafico(estufa_escolhida);
        buscarRegistros(estufa_escolhida);
    }
}


