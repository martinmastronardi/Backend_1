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
          const cart = await Cart.findOne({});
    
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
