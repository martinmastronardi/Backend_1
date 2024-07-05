import fs from 'node:fs';

class ProdManager {
    constructor(path) {
        this.path = path;
        this.prodList = [];
    }

    async getProdList() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.prodList = JSON.parse(data).data || [];
            return [...this.prodList];
        } catch (error) {
            console.error('Error reading products file:', error);
            return [];
        }
    }

    async getProdById(id) {
        await this.getProdList();
        return this.prodList.find(prod => prod.id === id);
    }

    async addProd(prod) {
        await this.getProdList();
        const newProduct = {
            id: this.prodList.length ? this.prodList[this.prodList.length - 1].id + 1 : 1,
            title: prod.title,
            description: prod.description,
            code: prod.code,
            price: prod.price,
            status: true,
            stock: prod.stock,
            category: prod.category,
            thumbnails: prod.thumbnails || []
        };
        this.prodList.push(newProduct);
        await this.saveProdList();
        return newProduct;
    }

    async updateProd(id, updatedProduct) {
        await this.getProdList();
        const index = this.prodList.findIndex(prod => prod.id === id);
        if (index !== -1) {
            this.prodList[index] = { ...this.prodList[index], ...updatedProduct, id };
            await this.saveProdList();
            return this.prodList[index];
        }
        return null;
    }

    async deleteProd(id) {
        await this.getProdList();
        const initialLength = this.prodList.length;
        this.prodList = this.prodList.filter(prod => prod.id !== id);
        if (this.prodList.length < initialLength) {
            await this.saveProdList();
            return true;
        }
        return false;
    }

    async saveProdList() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.prodList }, null, 2));
        } catch (error) {
            console.error('Error saving products file:', error);
        }
    }
}

export default ProdManager;
