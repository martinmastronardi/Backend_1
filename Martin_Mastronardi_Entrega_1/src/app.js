import express from 'express';
import productsRoute from './routes/products.router.js';
import cartsRoute from './routes/carts.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
