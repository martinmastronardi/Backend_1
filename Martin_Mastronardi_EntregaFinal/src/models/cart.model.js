import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true, min: 1 },
        }
    ],
    status: { type: String, enum: ['active', 'purchased'], default: 'active' }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
