const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY não está definida no arquivo .env");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.sendMessage = async (req, res) => {
    const { message } = req.body;
    
    console.log(`Mensagem recebida para processar: "${message}"`); 

    if (!message) {
        return res.status(400).json({ message: "A mensagem não pode estar vazia." });
    }
    
    const prompt = `
        Aja como um tutor de inglês conversacional e amigável para um falante de português.
        Responda à mensagem do usuário em inglês de forma natural para continuar a conversa.

        Se o usuário cometer um erro gramatical ou de vocabulário, sua resposta deve ter duas partes:
        1. A resposta normal em inglês, que incorpora a correção de forma sutil.
        2. Em uma nova linha, adicione uma seção chamada "💡 Correção:", onde você explica em PORTUGUÊS o que estava errado e como melhorar.

        Mantenha a conversa fluida.

        Mensagem do usuário: "${message}"
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-70b-8192',
            temperature: 0.7,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui pensar em uma resposta.";

        res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error("ERRO DETALHADO DA API GROQ:", error); 
        res.status(500).json({ message: "Erro ao se comunicar com a IA." });
    }
};