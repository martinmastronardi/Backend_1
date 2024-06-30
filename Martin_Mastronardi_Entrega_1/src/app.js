import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Esto fue enviado desde el servidor')
})


app.listen(8080, () => 
    console.log('Servidor levantado'))
