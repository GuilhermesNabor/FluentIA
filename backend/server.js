const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const authRoutes = require('./routes/auth.routes');
const placementRoutes = require('./routes/placement.routes');

const lessonsRoutes = require('./routes/lessons.routes');
const quizRoutes = require('./routes/quiz.routes');   

const chatRoutes = require('./routes/chat.routes');

const app = express();
const server = http.createServer(app);

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api/lessons', lessonsRoutes); 
app.use('/api/quiz', quizRoutes); 
app.use('/api/chat', chatRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API do FluentIA rodando!' });
});

app.use('/api/auth', authRoutes); 
app.use('/api/placement-test', placementRoutes);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Um usuário se conectou ao chat:', socket.id);

    socket.on('sendMessage', (message) => {
        console.log('Mensagem recebida:', message);
        const userMessage = message.text.toLowerCase();
        let response = { text: "That's interesting! What else can you tell me?" };

        if (userMessage.includes("i have") && userMessage.includes("years")) {
            response.correction = '💡 Correção: Em inglês, usamos o verbo "to be" para falar de idade. A forma correta seria: "I am [age] years old" ou simplesmente "I\'m [age]."'
        }
        
        socket.emit('receiveMessage', response);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});