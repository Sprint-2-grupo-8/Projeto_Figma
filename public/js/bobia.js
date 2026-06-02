// async function perguntarIA() {
//     let pergunta = ipt_pergunta.value;

//     const resposta = await fetch("/bob/perguntar", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ pergunta })
//     });

//     const dados = await resposta.json();

//     div_resposta.innerHTML =
//         dados.resposta || dados.erro;
// }