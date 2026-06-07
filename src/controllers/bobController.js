 var bobModel = require("../models/bobModel");

 async function perguntar(req, res) {
     var pergunta = req.body.pergunta;

     if (pergunta == undefined || pergunta.trim() == "") {
         return res.status(400).send("A pergunta está vazia.");
     }

     try {
         var resposta = await bobModel.gerarResposta(pergunta);

         res.json({
             resposta: resposta
         });
     } catch (erro) {
         console.error("Erro no Bob IA:", erro);

         // Mensagem tratada de erro
         let mensagem = "Ocorreu um erro ao processar sua pergunta. Tente novamente mais tarde.";

         if (erro.message && (erro.message.includes("429") || erro.message.includes("Quota") || erro.message.includes("quota"))) {
             mensagem = "Ops! O limite de perguntas ao Bob IA foi atingido por hoje.";
         } else if (erro.message && (erro.message.includes("API key") || erro.message.includes("credentials"))) {
             mensagem = "Ops! Ocorreu um problema de configuração na chave de API da IA. Contate o administrador.";
         }

         res.status(500).json({
             erro: mensagem
         });
     }
 }

 module.exports = {
     perguntar
 };