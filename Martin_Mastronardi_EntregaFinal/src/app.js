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
    socket.on('addToCart', async ({ productId, quantity }) => {
        try {
            let cart = await Cart.findOne({ status: 'active' });
    
            if (!cart) {
                cart = new Cart({
                    products: [],
                    status: 'active'
                });
            }
    
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
    
            const product = await Product.findById(productId);
            if (product.stock < quantity) {
                socket.emit('error', 'Stock insuficiente');
                return;
            }
            product.stock -= quantity;
            await product.save();
            await cart.save();
    
            socket.emit('cartUpdated', cart);
            io.emit('updateProducts', await Product.find());
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            socket.emit('error', 'Error al agregar al carrito');
        }
    });    
               

});


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
