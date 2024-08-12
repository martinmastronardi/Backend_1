import { Router } from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

viewsRouter.get('/cart', async (req, res) => {
    try {
        // Supongamos que solo tienes un carrito para el usuario actual
        const cart = await Cart.findOne({ /* condición para encontrar el carrito */ });
        
        // Renderiza la vista del carrito y pasa los productos
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

export default viewsRouter;
