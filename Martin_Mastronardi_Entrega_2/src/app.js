import express from 'express';
import { Server as SocketIO } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import productsRoute from './routes/products.router.js';
import cartsRoute from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProdManager from './Class/ProdManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new SocketIO(server);

const prodManager = new ProdManager(path.join(__dirname, 'data', 'products.json'));

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/', viewsRouter);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (product) => {
        try {
            const newProduct = await prodManager.addProd(product);
            const products = await prodManager.getProdList();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            const success = await prodManager.deleteProd(id);
            if (success) {
                const products = await prodManager.getProdList();
                io.emit('updateProducts', products);
            } else {
                console.error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
