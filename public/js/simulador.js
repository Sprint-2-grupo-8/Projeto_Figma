<<<<<<< HEAD
//Metodologia:
// Densidade de plantio por área: em média, 7 mudas mudas por m² - fonte: https://www.zanatta.com.br/sistema-certo-para-produzir-morangos/
// Área útil da estufa em m²: aproximadamente 75% - fonte: https://fyi.extension.wisc.edu/energy/greenhouses/space-utilization/
// Média do ciclo de cultivo: 70 dias - fonte: https://www.embrapa.br/agencia-de-informacao-tecnologica/cultivos/morango/producao/colheita
// Produtividade média por muda em 1 ciclo: 1kg - fonte: https://blog.epagri.sc.gov.br/morango-semi-hidroponico-sc/#:~:text=A%20produtividade%20m%C3%A9dia%20alcan%C3%A7ou%201kg,1.500kg/ciclo/ano.
// Percentual de aumento médio do peso do fruto dentro faixa ideal de CO2 (600 a 900): aproximadamente 7,50% - fonte: EFFECT OF CO2 ENRICHMENT ON GREENHOUSE GROWN STRAWBERRY F. Lieten National Research Centre for Strawberries, Proefbedrijf der Noorderkempen (IWONL), Voort 71, 2328 Meerle, Belgium
// Índice médio de produtividade dentro do aceitável (400 a 900): nivel baixo (400) => 7% | nivel médio (600) => 15% | nível alto (900) => 25% - fonte: https://ishs.org/ishs-article/439_98/


function calc() {
    let area_estufa = Number(document.getElementById('ipt_area_estufa').value);
    let qtd_estufa = Number(document.getElementById('ipt_qtd_estufas').value);
    let preco_kg = Number(document.getElementById('ipt_preco_venda').value);
    let nivel_co2 = Number(document.getElementById('ipt_nivel_co2').value);
    let indice_produtividade = 0;

    if (!area_estufa || !qtd_estufa || !preco_kg) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    if (nivel_co2 == 400) {
        indice_produtividade = 0.07;
    } else if (nivel_co2 == 600) {
        indice_produtividade = 0.15;
    } else if (nivel_co2 == 900) {
        indice_produtividade = 0.25;
    }

    let area_total = qtd_estufa * area_estufa;
    let area_util_total = area_total * 0.75;

    //A produtividade média por muda não foi acrescentada para evitar redundância, visto que foi estimado 1kg
    let produtividade_total = area_util_total * 7;
    let receita = produtividade_total * preco_kg;
    let aumento = produtividade_total * indice_produtividade;

    let produtividade_acrescida = produtividade_total + aumento;
    let receita_acrescida = produtividade_acrescida * preco_kg;
    let percentual_aumento_receita = indice_produtividade * 100;

    let ciclos_por_ano = 365 / 70;
    let producao_anual = produtividade_total * ciclos_por_ano;
    let producao_anual_acrescida = produtividade_acrescida * ciclos_por_ano;
    let percentual_aumento_producao = indice_produtividade * 100;

    // Atualizar no DOM (Tela)
    let div_container_negativo = document.getElementById("div_retorno_negativo");
    let div_container_positivo = document.querySelector(".retorno-positivo");
    let div_negativo = document.querySelector(".retorno-negativo .retorno");
    let div_positivo = document.querySelector(".retorno-positivo .retorno");

    div_negativo.innerHTML = `
            <p>Produtividade (ciclo): <b>${produtividade_total.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b></p>
            <p>Receita (ciclo): <b>R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></p>
            <p>Produção anual (estimada): <b>${producao_anual.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b></p>
        `;

    div_positivo.innerHTML = `
            <p>Produtividade (ciclo): <b>${produtividade_acrescida.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b></p>
            <p>Receita (ciclo): <b>R$ ${receita_acrescida.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> <span style="color: #16a34a; font-weight: bold;">(+${percentual_aumento_receita.toFixed(0)}%)</span></p>
            <p>Produção anual (estimada): <b>${producao_anual_acrescida.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b> <span style="color: #16a34a; font-weight: bold;">(+${percentual_aumento_producao.toFixed(0)}%)</span></p>
        `;

    // Exibir as divs que estavam escondidas e esconder placeholder
    let placeholder = document.getElementById("placeholder_resultados");
    if (placeholder) placeholder.style.display = "none";

    div_container_negativo.style.display = "block";
    div_container_positivo.style.display = "block";

    // Rolagem suave até o resultado (mobile)
    if (window.innerWidth <= 768) {
        document.querySelector(".resultados-panel").scrollIntoView({ behavior: 'smooth' });
    }
=======
//Metodologia:
// Densidade de plantio por área: em média, 7 mudas mudas por m² - fonte: https://www.zanatta.com.br/sistema-certo-para-produzir-morangos/
// Área útil da estufa em m²: aproximadamente 75% - fonte: https://fyi.extension.wisc.edu/energy/greenhouses/space-utilization/
// Média do ciclo de cultivo: 70 dias - fonte: https://www.embrapa.br/agencia-de-informacao-tecnologica/cultivos/morango/producao/colheita
// Produtividade média por muda em 1 ciclo: 1kg - fonte: https://blog.epagri.sc.gov.br/morango-semi-hidroponico-sc/#:~:text=A%20produtividade%20m%C3%A9dia%20alcan%C3%A7ou%201kg,1.500kg/ciclo/ano.
// Percentual de aumento médio do peso do fruto dentro faixa ideal de CO2 (600 a 900): aproximadamente 7,50% - fonte: EFFECT OF CO2 ENRICHMENT ON GREENHOUSE GROWN STRAWBERRY F. Lieten National Research Centre for Strawberries, Proefbedrijf der Noorderkempen (IWONL), Voort 71, 2328 Meerle, Belgium
// Índice médio de produtividade dentro do aceitável (400 a 900): nivel baixo (400) => 7% | nivel médio (600) => 15% | nível alto (900) => 25% - fonte: https://ishs.org/ishs-article/439_98/


function calc() {
    let area_estufa = Number(document.getElementById('ipt_area_estufa').value);
    let qtd_estufa = Number(document.getElementById('ipt_qtd_estufas').value);
    let preco_kg = Number(document.getElementById('ipt_preco_venda').value);
    let nivel_co2 = Number(document.getElementById('ipt_nivel_co2').value);
    let indice_produtividade = 0;

    if (!area_estufa || !qtd_estufa || !preco_kg) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    if (nivel_co2 == 400) {
        indice_produtividade = 0.07;
    } else if (nivel_co2 == 600) {
        indice_produtividade = 0.15;
    } else if (nivel_co2 == 900) {
        indice_produtividade = 0.25;
    }

    let area_total = qtd_estufa * area_estufa;
    let area_util_total = area_total * 0.75;

    //A produtividade média por muda não foi acrescentada para evitar redundância, visto que foi estimado 1kg
    let produtividade_total = area_util_total * 7;
    let receita = produtividade_total * preco_kg;
    let aumento = produtividade_total * indice_produtividade;

    let produtividade_acrescida = produtividade_total + aumento;
    let receita_acrescida = produtividade_acrescida * preco_kg;
    let percentual_aumento_receita = indice_produtividade * 100;

    let ciclos_por_ano = 365 / 70;
    let producao_anual = produtividade_total * ciclos_por_ano;
    let producao_anual_acrescida = produtividade_acrescida * ciclos_por_ano;
    let percentual_aumento_producao = indice_produtividade * 100;

    // Atualizar no DOM (Tela)
    let div_container_negativo = document.getElementById("div_retorno_negativo");
    let div_container_positivo = document.querySelector(".retorno-positivo");
    let div_negativo = document.querySelector(".retorno-negativo .retorno");
    let div_positivo = document.querySelector(".retorno-positivo .retorno");

    div_negativo.innerHTML = `
            <p>Produtividade (ciclo): <b>${produtividade_total.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b></p>
            <p>Receita (ciclo): <b>R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></p>
            <p>Produção anual (estimada): <b>${producao_anual.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b></p>
        `;

    div_positivo.innerHTML = `
            <p>Produtividade (ciclo): <b>${produtividade_acrescida.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b></p>
            <p>Receita (ciclo): <b>R$ ${receita_acrescida.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> <span style="color: #16a34a; font-weight: bold;">(+${percentual_aumento_receita.toFixed(0)}%)</span></p>
            <p>Produção anual (estimada): <b>${producao_anual_acrescida.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg</b> <span style="color: #16a34a; font-weight: bold;">(+${percentual_aumento_producao.toFixed(0)}%)</span></p>
        `;

    // Exibir as divs que estavam escondidas e esconder placeholder
    let placeholder = document.getElementById("placeholder_resultados");
    if (placeholder) placeholder.style.display = "none";

    div_container_negativo.style.display = "block";
    div_container_positivo.style.display = "block";

    // Rolagem suave até o resultado (mobile)
    if (window.innerWidth <= 768) {
        document.querySelector(".resultados-panel").scrollIntoView({ behavior: 'smooth' });
    }
>>>>>>> 6d47a2c86e73857e8eca49466fecbad9a141a9de
}