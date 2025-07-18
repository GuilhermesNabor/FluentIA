const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generatePlacementTest() {
    const prompt = `
        Crie um teste de nivelamento de inglês com 20 questões de múltipla escolha (a, b, c, d).
        As 7 primeiras questões devem ser de nível básico (A1/A2), as 8 seguintes de nível intermediário (B1/B2) e as 5 últimas de nível avançado (C1).
        A resposta DEVE ser um objeto JSON válido com UMA ÚNICA CHAVE chamada "questions". O valor dessa chave deve ser um array de objetos.
        Cada objeto no array deve ter os campos: "question" (string), "options" (array de 4 strings), e "answer" (string, sendo 'a', 'b', 'c' ou 'd').
        Exemplo de formato: { "questions": [ {"question": "I ___ from Brazil.", "options": ["is", "are", "am", "be"], "answer": "c"} ] }
        Não adicione nenhum texto ou explicação fora do objeto JSON.
    `;
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-70b-8192',
            temperature: 0.7,
            response_format: { "type": "json_object" }
        });

        const jsonResponse = JSON.parse(chatCompletion.choices[0].message.content);
        
        if (jsonResponse && Array.isArray(jsonResponse.questions)) {
            return jsonResponse.questions;
        } else {
            console.error("A resposta da IA não continha um array 'questions' válido.", jsonResponse);
            throw new Error("Formato de resposta da IA inválido.");
        }

    } catch (error) {
        console.error("Erro ao gerar teste de nivelamento na Groq:", error);
        throw new Error("Falha ao gerar o teste de nivelamento.");
    }
}

async function generateLesson(userLevel) {
    let levelInstruction = '';
    if (userLevel === 'beginner') {
        levelInstruction = `
            Para o nível BEGINNER, a aula deve ser MUITO didática. 
            A maior parte do conteúdo explicativo DEVE estar em português. 
            Apresente uma frase ou conceito em inglês e, IMEDIATAMENTE, forneça a tradução e uma explicação detalhada em português sobre a gramática, o vocabulário e o uso daquela frase. 
            O objetivo é que um iniciante total consiga entender 100% da aula.
        `;
    } else if (userLevel === 'intermediate') {
        levelInstruction = `
            Para o nível INTERMEDIATE, equilibre o conteúdo. 
            O texto principal pode ser em inglês, mas TODAS as seções de gramática e vocabulário mais complexo DEVEM ter uma explicação clara em português para consolidar o conhecimento.
        `;
    } else { 
        levelInstruction = `
            Para o nível ADVANCED, a aula pode ser majoritariamente em inglês. 
            As explicações em português devem ser usadas apenas para nuances muito específicas ou expressões idiomáticas complexas. O foco é a imersão.
        `;
    }

    const prompt = `
        Aja como um professor de inglês para um falante de português.
        Crie uma aula completa e bem estruturada para um aluno de nível ${userLevel}.
        
        ${levelInstruction}

        A resposta DEVE ser um objeto JSON válido, com a seguinte estrutura:
        {
          "title": "Um título criativo e relevante para a aula",
          "textContent": "O corpo principal da aula, com pelo menos 300 palavras, e bem estruturado em parágrafos. Use \\n para novas linhas. Siga estritamente as instruções de nível fornecidas acima.",
          "recommendations": [
            { "type": "book", "title": "Nome do Livro 1", "author": "Autor do Livro 1" },
            { "type": "book", "title": "Nome do Livro 2", "author": "Autor do Livro 2" },
            { "type": "link", "title": "Título do Artigo/Vídeo 1", "url": "https://example.com/link1" },
            { "type": "link", "title": "Título do Artigo/Vídeo 2", "url": "https://example.com/link2" }
          ]
        }
        Não adicione nenhum texto ou explicação fora deste objeto JSON.
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-70b-8192',
            temperature: 0.8,
            response_format: { "type": "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Erro na Groq ao gerar aula:", error);
        throw new Error("Falha ao gerar a aula.");
    }
}

async function generateQuizForLesson(lessonContent) {
    const prompt = `
        Baseado no seguinte conteúdo de uma aula de inglês:
        ---
        ${lessonContent}
        ---
        Crie um quiz com 10 questões de múltipla escolha para testar a compreensão do conteúdo.
        A resposta DEVE ser um objeto JSON válido com a estrutura:
        {
          "questions": [
            {
              "question_text": "Texto da pergunta 1?",
              "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
              "correct_answer": 2 
            }
          ]
        }
        O campo "correct_answer" deve ser o índice da resposta correta no array de opções (de 0 a 3).
        Não adicione nenhum texto ou explicação fora deste objeto JSON.
    `;
     try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-70b-8192',
            temperature: 0.6,
            response_format: { "type": "json_object" }
        });
        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Erro na Groq ao gerar quiz:", error);
        throw new Error("Falha ao gerar o quiz.");
    }
}

module.exports = { generatePlacementTest, generateLesson, generateQuizForLesson };