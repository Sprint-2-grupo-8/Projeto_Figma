    //Metodologia:
    // Densidade de plantio por área: em média, 7 mudas mudas por m² - fonte: https://www.zanatta.com.br/sistema-certo-para-produzir-morangos/
    // Área útil da estufa em m²: aproximadamente 75% - fonte: https://fyi.extension.wisc.edu/energy/greenhouses/space-utilization/
    // Média do ciclo de cultivo: 70 dias - fonte: https://www.embrapa.br/agencia-de-informacao-tecnologica/cultivos/morango/producao/colheita
    // Produtividade média por muda em 1 ciclo: 1kg - fonte: https://blog.epagri.sc.gov.br/morango-semi-hidroponico-sc/#:~:text=A%20produtividade%20m%C3%A9dia%20alcan%C3%A7ou%201kg,1.500kg/ciclo/ano.
    // Percentual de aumento médio do peso do fruto dentro faixa ideal de CO2 (600 a 900): aproximadamente 7,50% - fonte: EFFECT OF CO2 ENRICHMENT ON GREENHOUSE GROWN STRAWBERRY F. Lieten National Research Centre for Strawberries, Proefbedrijf der Noorderkempen (IWONL), Voort 71, 2328 Meerle, Belgium
    // Índice médio de produtividade dentro do aceitável (400 a 900): nivel baixo (400) => 7% | nivel médio (600) 15% | nível alto (900) => 25% - fonte: https://ishs.org/ishs-article/439_98/


    function calc() {
        let area_estufa = Number(ipt_area_estufa.value);
        let qtd_estufa = Number(ipt_qtd_estufas.value);
        let preco_kg = Number(ipt_preco_venda.value);
        let nivel_co2 = Number(ipt_nivel_co2.value);
        let indice_produtividade = 0;

        if(nivel_co2 == 400){
            indice_produtividade = 0.07;
        } else if(nivel_co2 == 600){
            indice_produtividade = 0.15
        } else{
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

        //sem solucao
        'produtividade em kg: ', produtividade_total;
        //com solucao
        'produtividade em kg: ', produtividade_acrescida;

        //sem solucao
        'receita: R$', receita.toFixed(2);
        //com solucao
        'receita acrescida: R$', receita_acrescida.toFixed(2);
        'percentual aumento de receita:', percentual_aumento_receita,'%';

        //sem solucao
        'producao anual:', producao_anual, 'kg';

        //com solucao
        'producao anual com gestao:', producao_anual_acrescida.toFixed(2), 'kg';
        'percentual de aumento da producao por ciclos:', percentual_aumento_producao,'%';
    }