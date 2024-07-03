import express from 'express'
import ProManager from './Class/ProdManager.js'
import { __dirname } from './data/utils.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const proManager = new ProManager(__dirname + '/data/products.json')

app.post('/', (req, res) => {
    proManager.addPord()
    res.json({menssage: 'ok'})
})

app.listen(8080, () => 
    console.log('Servidor levantado'))
