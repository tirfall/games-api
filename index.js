const app = require('express')()
const port = 8080
const req = require('express/lib/request')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json');

app.get('/games', (req, res) => {
    res.send(["Witcher 3", "Minecraft"])
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})
