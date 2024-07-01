import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Esto fue enviado desde el servidor')
})

// guarda querys
app.get('/usuarios', (req, res) => {
    console.log(req.query)
    res.send('usuarios')
})

// guarda parametros
app.get('/usuarios/:id', (req, res) => {
    console.log(req.params.id)
    res.send('params')})

app.get('/productos', (req, res) => {
    res.send('productos')
})

app.listen(8080, () => 
    console.log('Servidor levantado'))
