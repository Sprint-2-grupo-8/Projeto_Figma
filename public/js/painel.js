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

// Atualiza a visualização dos limites de PPM na UI
function atualizarDisplayLimites() {
    const display = document.getElementById('limites_display');
    if (display) {
        display.textContent = `Limites definidos: ${limiteInferior} ppm (mínimo) – ${limiteSuperior} ppm (máximo)`;
    }
}
// Atualiza logo ao carregar a página
atualizarDisplayLimites();



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
    atualizarDisplayLimites();
    atualizarAlertas();
}


let estufas_alertas = JSON.parse(sessionStorage.getItem('ESTUFAS_ALERTAS')) || [
    { "estufa": 1, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 2, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 3, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 4, "alertas": 0, "alertas_estabilizados": 0 }
];

// Faz a soma de todos os alertas pendentes no JSON
let alertas_totais = 0;
estufas_alertas.forEach(e => {
    alertas_totais += Math.max(0, e.alertas - (e.alertas_estabilizados || 0));
});


function classificarPpm(ppm) {
    const faixaAlerta = limiteSuperior > limiteInferior
        ? (limiteSuperior - limiteInferior) * 0.1
        : 50;

    if (ppm < limiteInferior)  
     return { status: 'red',    texto: 'Perigo (Abaixo)' };
    if (ppm > limiteSuperior)                     
         return { status: 'red',    texto: 'Perigo (Acima)' };
    if (ppm <= limiteInferior + faixaAlerta)       
        return { status: 'yellow', texto: 'Atenção (Próximo ao Mínimo)' };
    if (ppm >= limiteSuperior - faixaAlerta)      
         return { status: 'yellow', texto: 'Atenção (Próximo ao Máximo)' };
    return    { status: 'green',  texto: 'Ideal' };

}


function criarCardAlerta(alertaInfo) {
    const template = document.getElementById('template-alerta');
    const card = template.content.cloneNode(true).querySelector('.notificacao');

    card.classList.add(alertaInfo.classeStatus);

    card.querySelector('.estufa').textContent = `${alertaInfo.textoStatus}: Estufa ${alertaInfo.idEstufa} - ${alertaInfo.ppm} ppm`;

    const btnVerificar = card.querySelector('.btn-verificar');
    btnVerificar.addEventListener('click', () => irParaDash(alertaInfo.idEstufa));

    const btnResolver = card.querySelector('.btn-resolver');

    if (alertaInfo.originalStatus === 'green') {
        
        btnResolver.classList.add('btn-resolver--inativo');
    } else if (alertaInfo.isResolvido) {
     
        btnResolver.classList.add('btn-resolver--resolvido');
        btnResolver.title = 'Marcado como resolvido';
        btnResolver.addEventListener('click', () => desfazerResolucao(alertaInfo.idEstufa, alertaInfo.ppm));
    } else {
      
        btnResolver.title = 'Marcar como resolvido';
        btnResolver.addEventListener('click', () => resolverAlerta(alertaInfo.idEstufa, alertaInfo.ppm));
    }

    return card;
}

// Verifica os valores <ATUAIS> de cada estufa. Se alguma estiver com o PPM fora do limite definido,
// um aviso é mostrado na tela.
async function atualizarAlertas() {
    const areaNotificacoes = document.querySelector('.notificacoes');

    if (!areaNotificacoes) return;

    areaNotificacoes.innerHTML = '';

    // Carrega os alertas resolvidos do sessionStorage
    const resolvidos = JSON.parse(sessionStorage.getItem('ALERTAS_RESOLVIDOS')) || [];

    // Reseta os alertas para não acumular para sempre
    estufas_alertas.forEach(estufa => {
        estufa.alertas = 0;
        estufa.alertas_estabilizados = 0;
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

                const { status: statusOriginal, texto: textoOriginal } = classificarPpm(ppm);
                const foiResolvido = resolvidos.some(r => r.estufa === idEstufa && r.ppm === ppm);

                let classeStatus = statusOriginal;
                let textoStatus = textoOriginal;
                let isResolvido = false;

                if (statusOriginal === 'red' || statusOriginal === 'yellow') {
                    estufas_alertas[Number(idEstufa - 1)].alertas++;

                    if (foiResolvido) {
                        classeStatus = 'green';
                        textoStatus = `Resolvido - ${textoOriginal}`;
                        isResolvido = true;
                        estufas_alertas[Number(idEstufa - 1)].alertas_estabilizados++;
                    }
                }

                todosAlertas.push({ idEstufa, ppm, classeStatus, textoStatus, isResolvido, originalStatus: statusOriginal });
            });

        } catch (erro) {
            console.error('Erro ao buscar registros da estufa', idEstufa, erro);
        }
    }

    
    const prioridades = { 'red': 1, 'yellow': 2, 'green': 3 };
    todosAlertas.sort((a, b) => prioridades[a.classeStatus] - prioridades[b.classeStatus]);

    
    todosAlertas.forEach(alertaInfo => {
        areaNotificacoes.appendChild(criarCardAlerta(alertaInfo));
    });

   
    sessionStorage.setItem('ESTUFAS_ALERTAS', JSON.stringify(estufas_alertas));

    // Atualiza dinamicamente o contador
    let alertas_totais_atualizados = 0;
    estufas_alertas.forEach(e => {
        alertas_totais_atualizados += Math.max(0, e.alertas - e.alertas_estabilizados);
    });
    const elQtdAlertas = document.getElementById('id_qtd_alertas');
    if (elQtdAlertas) {
        elQtdAlertas.innerHTML = alertas_totais_atualizados;
    }
}



window.addEventListener('load', atualizarAlertas);

function irParaDash(idEstufa) {
    sessionStorage.setItem('ID_ESTUFA_FILTER', idEstufa);
    console.log("estufa clicada", idEstufa);
    window.location = "dashboard.html";
}

// Marca um alerta como resolvido
function resolverAlerta(idEstufa, ppm) {
    const resolvidos = JSON.parse(sessionStorage.getItem('ALERTAS_RESOLVIDOS')) || [];
    resolvidos.push({ estufa: idEstufa, ppm: ppm });
    sessionStorage.setItem('ALERTAS_RESOLVIDOS', JSON.stringify(resolvidos));
    atualizarAlertas();
}

// Desfaz a resolução de um alerta
function desfazerResolucao(idEstufa, ppm) {
    let resolvidos = JSON.parse(sessionStorage.getItem('ALERTAS_RESOLVIDOS')) || [];
    resolvidos = resolvidos.filter(r => !(r.estufa === idEstufa && r.ppm === ppm));
    sessionStorage.setItem('ALERTAS_RESOLVIDOS', JSON.stringify(resolvidos));
    atualizarAlertas();
}