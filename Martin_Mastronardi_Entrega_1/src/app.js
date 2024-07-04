import express from 'express'
import ProManager from './Class/ProdManager.js'
import { __dirname } from './utils.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const proManager = new ProManager(__dirname + '/data/products.json')

app.post('/', async (req, res) => {
    console.log('Entra al POST')

    const nuevoProd = req.body
    await proManager.addPord(nuevoProd)
    console.log('se creo el archivo')
    res.status(201).json({ message: 'Se agrego el producto' })
})

app.get('/', async (req, res) => {
    const prodList = await NavigationPreloadManager.getProdList()
    res.status(201).json({resultado:prodList})
})

app.listen(8080, () => 
    console.log('Servidor levantado'))
