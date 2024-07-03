import express from 'express'
import ProManager from './Class/ProdManager.js'
import { __dirname } from './utils.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const proManager = new ProManager(__dirname + '/data/products.json')

app.post('/', async (req, res) => {
    console.log('Entra al POST')
    await proManager.addPord()
    console.log('se creo el archivo')
    res.json({menssage: 'Post ok'})
})

app.listen(8080, () => 
    console.log('Servidor levantado'))
