import { Router } from 'express';
import Product from '../models/product.model.js';

const productsRoute = Router();

productsRoute.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const sortOptions = sort ? { [sort]: 1 } : {}; 
        const products = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { code: { $regex: query, $options: 'i' } }
            ]
        })
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
        
        const totalProducts = await Product.countDocuments();
        res.json({ payload: products, totalProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

export default productsRoute;
