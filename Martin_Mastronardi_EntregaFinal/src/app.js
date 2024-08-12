import express from 'express';
import { Server as SocketIO } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import productsRoute from './routes/products.router.js';
import cartsRoute from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import mongoose from 'mongoose';
import Product from './models/product.model.js';
import Cart from './models/cart.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Coderhouse', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado exitosamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

connectDB();

const app = express();
const server = createServer(app);
const io = new SocketIO(server);

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
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
            const newProduct = new Product(product);
            await newProduct.save();
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    socket.on('createCart', async (quantity) => {
        try {
            const newCart = await Cart.create({
                products: []
            });
            const products = await Product.find();
            const cartProducts = products.map(product => ({
                productId: product._id,
                quantity: quantity
            }));
    
            await Cart.findByIdAndUpdate(newCart._id, { products: cartProducts });
    
            socket.emit('cartCreated', newCart._id);
        } catch (error) {
            console.error('Error creating cart:', error);
            socket.emit('error', 'Failed to create cart');
        }
    });
    socket.on('deleteProduct', async (id) => {
        try {
            await Product.findByIdAndDelete(id);
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });
    socket.on('updateProduct', async (id, updatedProduct) => {
        try {
            await Product.findByIdAndUpdate(id, updatedProduct);
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    });

});


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
