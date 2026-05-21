const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function gerarResposta(pergunta) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: pergunta
    });

    return response.text;
}

module.exports = {
    gerarResposta
};