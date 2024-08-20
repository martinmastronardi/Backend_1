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

        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId: pid, quantity });
        }

        product.stock -= quantity;
        await product.save();
        await cart.save();

        res.json({ status: 'success', message: 'Producto añadido al carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
router.post('/finalize', async (req, res) => {
    try {
        const cart = await Cart.findOne({ status: 'active' });

        if (!cart) {
            return res.status(404).json({ message: 'No hay un carrito activo para finalizar' });
        }

        cart.status = 'purchased';
        await cart.save();

        res.json({ message: 'Compra finalizada con éxito' });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ message: 'Error al finalizar la compra' });
    }
});
export default router;
