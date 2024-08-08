import { Router } from 'express';
import ProdManager from '../Class/ProdManager.js';
import { __dirname } from '../utils.js';

const viewsRouter = Router();
const prodManager = new ProdManager(__dirname + '/data/products.json');

viewsRouter.get('/', async (req, res) => {
    const products = await prodManager.getProdList();
    res.render('home', { products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await prodManager.getProdList();
    res.render('realTimeProducts', { products });
});

export default viewsRouter;
