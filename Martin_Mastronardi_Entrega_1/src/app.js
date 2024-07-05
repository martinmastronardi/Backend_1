import express from 'express'
import ProdManager from './Class/ProdManager.js'
import CartManager from './Class/cartManager.js'
import cartsRoute from './routes/carts.router.js'
import productsRoute from './routes/products.router.js'
import { __dirname } from './utils.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/products', productsRoute)
app.use('/api/carts', cartsRoute)

const prodManager = new ProdManager(__dirname + '/data/products.json')

app.post('/', async (req, res) => {
    console.log('Entra al POST')

    const nuevoProd = req.body
    // agregar validacion en caso de que un producto no tenga todos los campos
    await prodManager.addPord(nuevoProd)
    console.log('se creo el archivo')
    res.status(201).json({ message: 'Se agrego el producto' })
})

app.put('/:id', async (req, res) => {
    const { id } = req.params
    const actualizarProd = req.body
    // en la clase prodManager crear un metodo que reciba el id y actualice el archivo
    res.status(203).json({ message: 'Se actualizo el archivo' })
})

app.get('/', async (req, res) => {
    const prodList = await prodManager.getProdList();

    res.status(201).json({ resultado: prodList })
})

app.get('/:id', async (req, res) => {
    const { id } = req.params
    const prodFind = await prodManager.getProdById(id)
    res.status(201).json({ resultado: prodFind })
})

app.post('/:cid/prod/:pid', async (req, res) => {
    const { cid, pid } = req.params
    await CartManager.agregarProdEnCart(cid, pid)
    res.status(201).json({ message: 'Se agrego el producto al carrito' })

})

app.listen(8080, () =>
    console.log('Servidor levantado'))
