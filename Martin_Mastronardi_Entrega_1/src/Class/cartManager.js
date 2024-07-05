import fs from 'node:fs/promises';

export class CartManager {
constructor(path){
        this.path = path
        this.carts = []
    }


    async agregarProdEnCart(cid, pId){
        this.carts = await this.getCarts();
        const cardsUpdated = this.carts.map((cart)=>{
            if(cart.id !== cid) return cart
            
            const indexProd = cart.prod.findIndex(prod => prod.id === pId);
            if(indexProd === -1){
                cart.products.push({ id: pId, quantity: 1 })
                return cart;
            }
            cart.prod[indexProd] = { ...cart.prod[indexProd], quantity: cart.prod[indexProd].quantity + 1 }
            return cart;
            
        })
        this.carts = [...cardsUpdated]
        await fs.writeFile(this.path,JSON.stringify({ data: this.carts }))
    }

}

export default CartManager