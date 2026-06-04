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

