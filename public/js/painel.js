// Painel de controle de alertas - funções de configuração, filtragem e atualização automática
const janelaConfiguracao = document.getElementById('popup');

// Abre a janela de configuração (escolher o nivel de PPM que o cliente quer) e preenche os campos
// com os limites que estão atualmente salvos (que o cliente digitou)
function atualizarAncora() {
    janelaConfiguracao.style.display = 'flex';
    document.getElementById('lowerInput').value = limiteMinimo;
    document.getElementById('upperInput').value = limiteMaximo;
}

function fecharPopup() {
    janelaConfiguracao.style.display = 'none';
}

let alertasExcluidos =
    JSON.parse(
        sessionStorage.getItem('ALERTAS_EXCLUIDOS')
    ) || [];

let limiteMinimo = 0;
let limiteMaximo = 900;
const salvo = localStorage.getItem('limites');
if (salvo) {
    try {
        const limitesSalvos = JSON.parse(salvo);
        if (!isNaN(limitesSalvos.inferior)) limiteMinimo = Number(limitesSalvos.inferior);
        if (!isNaN(limitesSalvos.superior)) limiteMaximo = Number(limitesSalvos.superior);
    } catch (erro) {
        console.error('Erro ao ler limites salvos', erro);
    }
}

// Atualiza a visualização dos limites de PPM na UI
function atualizarDisplayLimites() {
    const display = document.getElementById('limites_display');
    if (display) {
        display.innerHTML = `Limites definidos: <strong>${limiteMinimo} ppm</strong> (mínimo) - <strong>${limiteMaximo} ppm</strong> (máximo)`;
    }
}
// Atualiza logo ao carregar a página
atualizarDisplayLimites();



function atualizarConfiguracoes() {
    const novoMinimo = document.getElementById('lowerInput').value;
    const novoMaximo = document.getElementById('upperInput').value;

    if (novoMinimo !== '' && !isNaN(novoMinimo)) {
        limiteMinimo = Number(novoMinimo);
    }

    if (novoMaximo !== '' && !isNaN(novoMaximo)) {
        limiteMaximo = Number(novoMaximo);
    }

    localStorage.setItem(
        'limites',
        JSON.stringify({
            inferior: limiteMinimo,
            superior: limiteMaximo
        })
    );

    fecharPopup();
    atualizarDisplayLimites();
    atualizarAlertas();
}


let estufasAlertas = JSON.parse(sessionStorage.getItem('ESTUFAS_ALERTAS')) || [
    { "estufa": 1, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 2, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 3, "alertas": 0, "alertas_estabilizados": 0 },
    { "estufa": 4, "alertas": 0, "alertas_estabilizados": 0 }
];

// Faz a soma de todos os alertas pendentes no JSON
// Removed obsolete total alerts calculation; handled in atualizarAlertas

// Classifica o valor de PPM em status e texto descritivo
function classificarPpm(ppm) {
    const faixaAlerta = limiteMaximo > limiteMinimo
        ? (limiteMaximo - limiteMinimo) * 0.1
        : 50;

    if (ppm < limiteMinimo)
        return { status: 'red', texto: 'Perigo (Abaixo)' };
    if (ppm > limiteMaximo)
        return { status: 'red', texto: 'Perigo (Acima)' };
    if (ppm <= limiteMinimo + faixaAlerta)
        return { status: 'yellow', texto: 'Atenção (Próximo ao Mínimo)' };
    if (ppm >= limiteMaximo - faixaAlerta)
        return { status: 'yellow', texto: 'Atenção (Próximo ao Máximo)' };
    return { status: 'green', texto: 'Ideal' };

}
// Cria um card de alerta com informações e botões de ação

function criarCardAlerta(alertaInfo) {
    const template = document.getElementById('template-alerta');
    const card = template.content.cloneNode(true).querySelector('.notificacao');

    const btnExcluir =
        card.querySelector('.btn-excluir');

    btnExcluir.addEventListener('click', () =>
        excluirAlerta(
            alertaInfo.idEstufa,
            alertaInfo.ppm
        )
    );

    card.classList.add(alertaInfo.classeStatus);
    if (alertaInfo.isResolvido) {
        card.classList.add('is-resolvido');
    }


    card.dataset.status = alertaInfo.classeStatus;
    card.dataset.original = alertaInfo.originalStatus;
    card.dataset.resolvido = alertaInfo.isResolvido ? 'true' : 'false';

    const chip = card.querySelector('.status-chip');
    const statusTexto = alertaInfo.isResolvido
        ? 'Resolvido'
        : alertaInfo.textoStatus.replace('Resolvido - ', '');

    chip.textContent = statusTexto;
    card.querySelector('.estufa').textContent = `Estufa ${alertaInfo.idEstufa}`;
    card.querySelector('.ppm').textContent = `- ${alertaInfo.ppm} ppm`;
    card.querySelector('.tendencia').textContent = (alertaInfo.tendencia || '')
        .replace('↑', '↗')
        .replace('↓', '↘');

    const btnVerificar = card.querySelector('.btn-verificar');
    btnVerificar.addEventListener('click', () => irParaDashboard(alertaInfo.idEstufa));

    const btnResolver = card.querySelector('.btn-resolver');
    const resolverLabel = card.querySelector('.resolver-label');

    if (alertaInfo.originalStatus === 'green') {

        btnResolver.classList.add('btn-resolver--inativo');
        btnResolver.disabled = true;
        btnResolver.title = 'Leitura dentro da faixa ideal';
    } else if (alertaInfo.isResolvido) {

        btnResolver.classList.add('btn-resolver--resolvido');
        btnResolver.title = 'Marcado como resolvido';
        resolverLabel.textContent = 'Resolvido';
        btnVerificar.querySelector('span').textContent = 'Alerta resolvido';
        btnVerificar.querySelector('i').className = 'fa-regular fa-circle-check';
        btnResolver.addEventListener('click', () => desfazerResolucao(alertaInfo.idEstufa, alertaInfo.ppm));
    } else {

        btnResolver.title = 'Marcar como resolvido';
        btnResolver.addEventListener('click', () => marcarAlertaResolvido(alertaInfo.idEstufa, alertaInfo.ppm));
    }

    return card;
}

// Verifica os valores <ATUAIS> de cada estufa. Se alguma estiver com o PPM fora do limite definido,
// um aviso é mostrado na tela.
async function atualizarAlertas() {
    const areaNotificacoes = document.querySelector('.notificacoes');

    if (!areaNotificacoes) return;

    // Guarda a posição atual da página
    const posicaoScroll = window.scrollY;

    const resolvidos =
        JSON.parse(sessionStorage.getItem('ALERTAS_RESOLVIDOS')) || [];

    estufasAlertas.forEach(estufa => {
        estufa.alertas = 0;
        estufa.alertas_estabilizados = 0;


    });

    const estufas = [1, 2, 3, 4];
    const todosAlertas = [];

    for (const idEstufa of estufas) {
        try {
            const resposta = await fetch(`/medidas/registros/${idEstufa}`);

            if (resposta.status === 204) {
                console.log(
                    'Sem registros recentes para a estufa',
                    idEstufa
                );
                continue;
            }

            if (!resposta.ok) {
                console.error(
                    'Erro na requisição para a estufa',
                    idEstufa,
                    resposta.statusText
                );
                continue;
            }

            const registros = await resposta.json();

            const ultimaLimpeza =
                localStorage.getItem('ULTIMA_LIMPEZA_ALERTAS');

            const calcularTendencia = (dados) => {
                if (!dados || dados.length < 2) return '';

                const ultimo = Number(
                    dados[dados.length - 1].ppm
                );

                const penultimo = Number(
                    dados[dados.length - 2].ppm
                );

                if (isNaN(ultimo) || isNaN(penultimo))
                    return '';

                if (ultimo > penultimo)
                    return '↑ Subindo';

                if (ultimo < penultimo)
                    return '↓ Descendo';

                return '→ Estável';
            };

            const tendenciaEstufa =
                calcularTendencia(registros);

            registros.forEach(registro => {

                if (ultimaLimpeza) {

                    const dataRegistro =
                        new Date(registro.dtHrRegistro);

                    const dataLimpeza =
                        new Date(ultimaLimpeza);

                    if (dataRegistro <= dataLimpeza) {
                        return;
                    }
                }
                const ppm = Number(registro.ppm);

                if (isNaN(ppm)) return;

                const foiExcluido =
                    alertasExcluidos.some(
                        a =>
                            a.estufa === idEstufa &&
                            a.ppm === ppm
                    );

                if (foiExcluido) {
                    return;
                }

                const {
                    status: statusOriginal,
                    texto: textoOriginal
                } = classificarPpm(ppm);

                const foiResolvido =
                    resolvidos.some(
                        r =>
                            r.estufa === idEstufa &&
                            r.ppm === ppm
                    );

                let classeStatus = statusOriginal;
                let textoStatus = textoOriginal;
                let isResolvido = false;

                if (
                    statusOriginal === 'red' ||
                    statusOriginal === 'yellow'
                ) {
                    estufasAlertas[
                        idEstufa - 1
                    ].alertas++;

                    if (foiResolvido) {
                        classeStatus = 'green';
                        textoStatus =
                            `Resolvido - ${textoOriginal}`;

                        isResolvido = true;

                        estufasAlertas[
                            idEstufa - 1
                        ].alertas_estabilizados++;
                    }
                }

                todosAlertas.push({
                    idEstufa,
                    ppm,
                    classeStatus,
                    textoStatus,
                    isResolvido,
                    originalStatus: statusOriginal,
                    tendencia: tendenciaEstufa
                });
            });

          

        } catch (erro) {
            console.error(
                'Erro ao buscar registros da estufa',
                idEstufa,
                erro
            );
        }
    }

    const prioridades = {
        red: 1,
        yellow: 2,
        green: 3
    };

    todosAlertas.sort(
        (a, b) =>
            prioridades[a.classeStatus] -
            prioridades[b.classeStatus]
    );

    const novoConteudo =
        JSON.stringify(todosAlertas);

    // Só atualiza a tela se houver alteração
    if (novoConteudo !== ultimoConteudoAlertas) {

        ultimoConteudoAlertas = novoConteudo;

        const fragmento =
            document.createDocumentFragment();

        todosAlertas.forEach(alertaInfo => {
            fragmento.appendChild(
                criarCardAlerta(alertaInfo)
            );
        });

        areaNotificacoes.replaceChildren(
            fragmento
        );

        filtrarAlertas();

        // Mantém o usuário na mesma posição
        window.scrollTo(
            0,
            posicaoScroll
        );
    }

    sessionStorage.setItem(
        'ESTUFAS_ALERTAS',
        JSON.stringify(estufasAlertas)
    );

    let totalAlertasAtualizado = 0;

    estufasAlertas.forEach(estufa => {
        totalAlertasAtualizado += Math.max(
            0,
            estufa.alertas -
            estufa.alertas_estabilizados
        );
    });

    const quantidadeAlertas =
        document.getElementById(
            'id_qtd_alertas'
        );

    if (quantidadeAlertas) {
        quantidadeAlertas.innerHTML =
            totalAlertasAtualizado;
    }
}


// Atualiza o horário da última atualização exibido na interface
let intervaloAtualizacao;
let ultimoConteudoAlertas = '';
function atualizarHorario() {
    const el = document.getElementById('last_update');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('pt-BR');
    }
}
// Filtra os cards de alerta de acordo com a seleção do usuário
// Função de filtragem de alertas
function filtrarAlertas() {
    const select = document.getElementById('filter_alertas');
    if (!select) return;
    const filtro = select.value;
    const cards = document.querySelectorAll('.notificacao');
    let exibidos = 0;
    cards.forEach(card => {
        const status = card.dataset.status; // red, yellow, green
        const original = card.dataset.original; // status original antes da resolução
        // Para o filtro "resolvidos" queremos mostrar todos os alertas verdes (resolvidos ou ideal)
        let mostrar = false;
        if (filtro === 'todos') {
            mostrar = true;
        } else if (filtro === 'perigo') {
            mostrar = (original === 'red' || status === 'red');
        } else if (filtro === 'atencao') {
            mostrar = (original === 'yellow' || status === 'yellow');
        } else if (filtro === 'resolvidos') {
            mostrar = (status === 'green');
        }
        card.style.display = mostrar ? '' : 'none';
        if (mostrar) exibidos++;
    });
    // Atualiza contagem no label do filtro
    const label = document.querySelector('label[for="filter_alertas"]');
    if (label) {
        label.innerHTML = `Filtrar (<strong>${filtro.charAt(0).toUpperCase() + filtro.slice(1)}</strong>): <strong>${exibidos}</strong>`;
    }
    // Mensagem quando nenhum alerta encontrado
    let msgVazia = document.getElementById('msg_vazia');
    if (!msgVazia) {
        msgVazia = document.createElement('div');
        msgVazia.id = 'msg_vazia';
        document.querySelector('.notificacoes').appendChild(msgVazia);
    }
    if (exibidos === 0) {
        let texto;
        if (filtro === 'perigo') texto = 'Nenhum alerta de perigo encontrado.';
        else if (filtro === 'atencao') texto = 'Nenhum alerta de atenção encontrado.';
        else if (filtro === 'resolvidos') texto = 'Nenhum alerta resolvido encontrado.';
        else texto = 'Nenhum alerta encontrado.';
        msgVazia.textContent = texto;
        msgVazia.style.display = '';
    } else {
        msgVazia.style.display = 'none';
    }
    // Salva filtro selecionado
    localStorage.setItem('alert_filter', filtro);
}

// Configura evento de mudança no filtro e carrega filtro salvo
const filtroSelect = document.getElementById('filter_alertas');
if (filtroSelect) {
    filtroSelect.addEventListener('change', filtrarAlertas);
    const filtroSalvo = localStorage.getItem('alert_filter') || 'todos';
    filtroSelect.value = filtroSalvo;
    filtrarAlertas();
}
function iniciarAtualizacaoAutomatica() {
    atualizarAlertas();
    atualizarHorario();
    // agenda atualizações a cada 10 segundos
    intervaloAtualizacao = setInterval(() => {
        atualizarAlertas();
        atualizarHorario();
    }, 10000);
    // aplica filtro após primeira carga
    filtrarAlertas();
}


function irParaDashboard(idEstufa) {
    sessionStorage.setItem('ID_ESTUFA_FILTER', idEstufa);
    console.log("estufa clicada", idEstufa);
    window.location = "dashboard.html";
}

// Marca um alerta como resolvido
function marcarAlertaResolvido(idEstufa, ppm) {
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

function removerTodosAlertas() {

    localStorage.setItem(
        'ULTIMA_LIMPEZA_ALERTAS',
        new Date().toISOString()
    );

    atualizarAlertas();
}
function excluirAlerta(idEstufa, ppm) {

    const botao = event.currentTarget;
    const card = botao.closest('.notificacao');

    card.classList.add('removendo');

    setTimeout(() => {

        alertasExcluidos.push({
            estufa: idEstufa,
            ppm: ppm
        });

        sessionStorage.setItem(
            'ALERTAS_EXCLUIDOS',
            JSON.stringify(alertasExcluidos)
        );

        atualizarAlertas();

    }, 300);
}