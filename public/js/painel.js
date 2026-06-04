const janelaConfiguracao = document.getElementById('popup');


// Abre a janela de configuração (escolher o nivel de PPM que o cliente quer) e preenche os campos
// com os limites que estão atualmente salvos (que o cliente digitou)
function atualizarAncora() {
    janelaConfiguracao.style.display = 'flex';
    document.getElementById('lowerInput').value = limiteInferior;
    document.getElementById('upperInput').value = limiteSuperior;
}

function fecharPopup() {
    janelaConfiguracao.style.display = 'none';
}


let limiteInferior = 0;
let limiteSuperior = 900;
const salvo = localStorage.getItem('limites');
if (salvo) {
    try {
        const limitesSalvos = JSON.parse(salvo);
        if (!isNaN(limitesSalvos.inferior)) limiteInferior = Number(limitesSalvos.inferior);
        if (!isNaN(limitesSalvos.superior)) limiteSuperior = Number(limitesSalvos.superior);
    } catch (erro) {
        console.error('Erro ao ler limites salvos', erro);
    }
}

console.log('Limites carregados -> Inferior:', limiteInferior, 'Superior:', limiteSuperior);


function atualizarConfiguracoes() {
    const limiteMinimo = document.getElementById('lowerInput').value;
    const limiteMaximo = document.getElementById('upperInput').value;

    if (limiteMinimo !== '' && !isNaN(limiteMinimo)) {
        limiteInferior = Number(limiteMinimo);
    }

    if (limiteMaximo !== '' && !isNaN(limiteMaximo)) {
        limiteSuperior = Number(limiteMaximo);
    }

    localStorage.setItem(
        'limites',
        JSON.stringify({
            inferior: limiteInferior,
            superior: limiteSuperior
        })
    );

    fecharPopup();
    atualizarAlertas();
}


let estufas_alertas = JSON.parse(sessionStorage.getItem('ESTUFAS_ALERTAS')) || [
    { "estufa": 1, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 2, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 3, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 4, "alertas": 0, "alertas_estabilizados": 0 }
]; 

// Faz a soma de todos os alertas no JSON
let alertas_totais = 0;
estufas_alertas.forEach(e => {
    alertas_totais += e.alertas;
});

// Verifica os valores <ATUAIS> de cada estufa. Se alguma estiver com o PPM fora do limite definido,
// um aviso é mostrado na tela.
async function atualizarAlertas() {
    const areaNotificacoes = document.querySelector('.notificacoes');

    if (!areaNotificacoes) return;

    areaNotificacoes.innerHTML = '';

    // Reseta os alertas para não acumular para sempre
    estufas_alertas.forEach(estufa => {
        estufa.alertas = 0;
    });

    const estufas = [1, 2, 3, 4];
    const todosAlertas = [];

    for (const idEstufa of estufas) {
        try {
            const resposta = await fetch(`/medidas/registros/${idEstufa}`);

            if (resposta.status === 204) {
                console.log('Sem registros recentes para a estufa', idEstufa);
                continue;
            }

            if (!resposta.ok) {
                console.error('Erro na requisição para a estufa', idEstufa, resposta.statusText);
                continue;
            }

            const registros = await resposta.json(); //ppm

            console.log('Dados recebidos da estufa', idEstufa, registros);

            registros.forEach(registro => {
                const ppm = Number(registro.ppm);

                if (isNaN(ppm)) return;

                let classeStatus = 'green';
                let textoStatus = 'Ideal';

                // Define uma faixa de alerta (amarelo) de 10% do intervalo
                let faixaAlerta = 50; // valor padrão caso o cálculo seja inválido
                if (limiteSuperior > limiteInferior) {
                    faixaAlerta = (limiteSuperior - limiteInferior) * 0.1;
                }

                if (ppm < limiteInferior) {
                    classeStatus = 'red';
                    textoStatus = 'Perigo (Abaixo)';
                } else if (ppm > limiteSuperior) {
                    classeStatus = 'red';
                    textoStatus = 'Perigo (Acima)';
                } else if (ppm <= limiteInferior + faixaAlerta) {
                    classeStatus = 'yellow';
                    textoStatus = 'Atenção (Próximo ao Mínimo)';
                } else if (ppm >= limiteSuperior - faixaAlerta) {
                    classeStatus = 'yellow';
                    textoStatus = 'Atenção (Próximo ao Máximo)';
                } else {
                    classeStatus = 'green';
                    textoStatus = 'Ideal';
                }

                // Apenas alertas Amarelo e Vermelho vão somar no contador de alertas
                if (classeStatus === 'red' || classeStatus === 'yellow') {
                    estufas_alertas[Number(idEstufa - 1)].alertas++; 
                }

                todosAlertas.push({
                    idEstufa,
                    ppm,
                    classeStatus,
                    textoStatus
                });
            });

        } catch (erro) {
            console.error('Erro ao buscar registros da estufa', idEstufa, erro);
        }
    }

    // Ordena os alertas por prioridade: vermelho > amarelo > verde
    const prioridades = {
        'red': 1,
        'yellow': 2,
        'green': 3
    };

    todosAlertas.sort((a, b) => prioridades[a.classeStatus] - prioridades[b.classeStatus]);

    // Renderizar os alertas ordenados
    todosAlertas.forEach(alertaInfo => {
        const alerta = document.createElement('div');
        alerta.className = `notificacao ${alertaInfo.classeStatus}`;

        alerta.innerHTML = `
            <div class="descricao">
                <span class="estufa">${alertaInfo.textoStatus}: Estufa ${alertaInfo.idEstufa} - ${alertaInfo.ppm} ppm</span>
                <span class="horario">Agora</span>
                <button onclick="irParaDash(${alertaInfo.idEstufa})"><i class="fa-solid fa-right-to-bracket"></i> Verificar a estufa</button>
            </div>
            <div class="buttons">
                <button><img src="assets/img/check.svg" alt=""/></button>
            </div>`;

        areaNotificacoes.appendChild(alerta);
    });

    // Salva o estado atualizado no sessionStorage
    sessionStorage.setItem('ESTUFAS_ALERTAS', JSON.stringify(estufas_alertas));

   
    let alertas_totais_atualizados = 0;
    estufas_alertas.forEach(e => {
        alertas_totais_atualizados += e.alertas;
    });
    const elQtdAlertas = document.getElementById('id_qtd_alertas');
    if (elQtdAlertas) {
        elQtdAlertas.innerHTML = alertas_totais_atualizados;
    }
}


// Alertas são gerados automaticamente.
window.addEventListener('load', atualizarAlertas);

function irParaDash(idEstufa) {
    sessionStorage.setItem('ID_ESTUFA_FILTER', idEstufa);
    console.log("estufa clicada", idEstufa);

    window.location="dashboard.html";
}