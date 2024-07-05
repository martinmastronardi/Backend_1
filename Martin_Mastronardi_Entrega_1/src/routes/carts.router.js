import { Router } from "express";
import CartManager from "../Class/cartManager.js";
import { __dirname } from '../utils.js';

const cartsRoute = Router();
const cartManager = new CartManager(__dirname + '/data/carts.json');

cartsRoute.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito', error });
    }
});

cartsRoute.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(Number(cid));
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
});

cartsRoute.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.agregarProdEnCart(Number(cid), Number(pid));
        if (updatedCart) {
            res.status(201).json({ message: 'Producto agregado al carrito', cart: updatedCart });
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
    }
});

export default cartsRoute;
