const express = require('express');
const cors = require('cors')
const app = express();
const port = 8080
const mongoose = require('mongoose');
app.use(cors());
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

app.use(express.json())

const uri = 'mongodb+srv://aleks:45123321veronika@cluster0.2pwvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

const games = [
    {id: 1, name:"Witcher 3", price: 29.99},
    {id: 2, name:"Minecraft", price: 24.99},
    {id: 3, name:"CS:GO", price: 0},
    {id: 4, name:"Roblox", price: 0},
    {id: 5, name:"GTA V", price: 29.99},
    {id: 6, name:"Valorant", price: 0},
    {id: 7, name:"Forza Horizon 5", price: 59.99},
    {id: 8, name:"Cyberpunk 2077", price: 59.99}
]

app.get('/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/games/:id', (req, res) => {

    if (typeof games[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Game not found"})
    }

    res.send(games[req.params.id - 1])
})

app.post('/games', async (req, res) => {
    try {
        const lastGame = await Game.findOne().sort({ id: -1 });
        const newId = lastGame ? lastGame.id + 1 : 1;

        const game = new Game({
            id: newId,
            name: req.body.name,
            price: req.body.price
        });

        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/games/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ id: req.params.id });
        if (!game) return res.status(404).json({ message: 'Game not found' });

        game.name = req.body.name || game.name;
        game.price = req.body.price || game.price;

        const updatedGame = await game.save();
        res.json(updatedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/games/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ id: req.params.id });
        if (!game) return res.status(404).json({ message: 'Game not found' });

        await game.remove();
        res.json({ message: 'Game deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + `://${req.headers.host}`;
}

