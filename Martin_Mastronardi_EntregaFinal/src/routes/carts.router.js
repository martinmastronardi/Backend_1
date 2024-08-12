import express from 'express';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const router = express.Router();

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);

        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        if (product.stock < quantity) return res.status(400).json({ status: 'error', message: 'Stock insuficiente' });

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        product.stock -= quantity;
        await product.save();
        await cart.save();

        res.json({ status: 'success', message: 'Producto añadido al carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/:cid/checkout', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'Compra finalizada con éxito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


export default router;
