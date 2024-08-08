import { Router } from "express";
import ProdManager from "../Class/ProdManager.js";
import { __dirname } from '../utils.js';

const productsRoute = Router();
const prodManager = new ProdManager(__dirname + '/data/products.json');

productsRoute.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await prodManager.getProdList();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

productsRoute.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await prodManager.getProdById(Number(pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});

productsRoute.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        const missingFields = requiredFields.filter(field => !newProduct[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Faltan los campos obligatorios: ${missingFields.join(', ')}` });
        }
        const product = await prodManager.addProd(newProduct);
        res.status(201).json({ message: 'Producto agregado', product });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto', error });
    }
});

productsRoute.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        const product = await prodManager.updateProd(Number(pid), updatedProduct);
        if (product) {
            res.json({ message: 'Producto actuazado', product });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
    }
    } catch (error) {
        res.status(500).json({ message: 'Eror al actualizar el producto', error });
    }
});

productsRoute.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await prodManager.deleteProd(Number(pid));
        if (product) {
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});

export default productsRoute;
