const app = require('express')()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

const games = [
    {id: 1, name:"Witcher 3", price: 29.99},
    {id: 2, name:"Minecraft", price: 24.99},
    {id: 3, name:"CS:GO", price: 0},
    {id: 4, name:"Roblox", price: 0},
    {id: 5, name:"GTA V", price: 29.99},
    {id: 6, name:"Valorant", price: 0},
    {id: 7, name:"Forza Horizon 5", price: 59.99},
    {id: 8, name:"Cyberpnk 2077", price: 59.99}
]

app.get('/games', (req, res) => {
    res.send(games)
})

app.get('/games/:id', (req, res) => {

    if (typeof games[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Game not found"})
    }

    res.send(games[req.params.id - 1])
})

app.post('/games', (req, res) => {
    games.push({
        id: games.length + 1,
        price: req.body.price,
        name: req.body.name
    })

    res.end()
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})
