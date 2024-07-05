import fs from 'node:fs/promises';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data).data || [];
            return [...this.carts];
        } catch (error) {
            console.error('Error reading carts file:', error);
            return [];
        }
    }

    async getCartById(id) {
        await this.getCarts();
        return this.carts.find(cart => cart.id === id);
    }

    async addCart() {
        await this.getCarts();
        const newCart = {
            id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async agregarProdEnCart(cid, pId) {
        await this.getCarts();
        const cart = this.carts.find(cart => cart.id === cid);
        if (cart) {
            const productIndex = cart.products.findIndex(prod => prod.id === pId);
            if (productIndex === -1) {
                cart.products.push({ id: pId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }
            await this.saveCarts();
            return cart;
        }
        return null;
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify({ data: this.carts }, null, 2));
        } catch (error) {
            console.error('Error saving carts file:', error);
        }
    }
}

export default CartManager;
