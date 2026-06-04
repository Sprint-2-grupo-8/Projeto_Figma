const janelaConfiguracao = document.getElementById('popup');


// Abre a janela de configuração e preenche os campos
// com os limites que estão atualmente salvos
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
// Busca as leituras mais recentes de cada estufa e verifica
// se os valores estão dentro da faixa configurada.
// Quando um valor ultrapassa os limites definidos, uma
// notificação de alerta é criada e exibida ao usuário.
async function atualizarAlertas() {
    const areaNotificacoes = document.querySelector('.notificacoes');

    if (!areaNotificacoes) return;

    areaNotificacoes.innerHTML = '';

    // Reseta os alertas para nâo acumular infinitamente
    estufas_alertas.forEach(estufa => {
        estufa.alertas = 0;
    });

    const estufas = [1, 2, 3, 4];

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

            const registros = await resposta.json(); // [{ ppm }]

            console.log('Dados recebidos da estufa', idEstufa, registros);

            registros.forEach(registro => {
                const ppm = Number(registro.ppm);

                if (isNaN(ppm)) return;

                let classeStatus = 'green';
                let textoStatus = 'Normal';

                if (ppm < limiteInferior) {
                    classeStatus = 'red';
                    textoStatus = 'Perigo (abaixo)';
                } else if (ppm > limiteSuperior) {
                    classeStatus = 'red';
                    textoStatus = 'Perigo (acima)';
                } else {
                    classeStatus = 'green';
                    textoStatus = 'Normal';
                }

                if (classeStatus !== 'green') {
                    estufas_alertas[Number(idEstufa - 1)].alertas++; // Incrementa a quantidade total de alertas naquela estufa
                    
                    sessionStorage.setItem('ESTUFAS_ALERTAS', JSON.stringify(estufas_alertas));
                    
                    const alerta = document.createElement('div');

                    alerta.className = `notificacao ${classeStatus}`;

                    alerta.innerHTML = `
                        <div class="descricao">
                            <span class="estufa">${textoStatus}: Estufa ${idEstufa} - ${ppm} ppm</span>
                            <span class="horario">Agora</span>
                            <button onclick="irParaDash(${idEstufa})"><i class="fa-solid fa-right-to-bracket"></i> Verificar a estufa</button>
                        </div>
                        <div class="buttons">
                            <button><img src="assets/img/check.svg" alt=""/></button>
                        </div>`;

                    areaNotificacoes.appendChild(alerta);
                }
            });

        } catch (erro) {
            console.error('Erro ao buscar registros da estufa', idEstufa, erro);
        }
    }
}


// As notificações de alerta são geradas automaticamente, se baseia na leitutra mais recente de cada estufa e nos limites configurados;
window.addEventListener('load', atualizarAlertas);

function irParaDash(idEstufa) {
    sessionStorage.setItem('ID_ESTUFA_FILTER', idEstufa);
    console.log("estufa clicada", idEstufa);

    window.location="dashboard.html";
}