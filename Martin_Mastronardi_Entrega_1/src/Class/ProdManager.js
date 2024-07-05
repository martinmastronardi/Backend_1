import { time } from 'node:console'
import fs from 'node:fs'

class ProdManager { 
constructor(path) {
this.path = path
this.prodList = []
}
   
async getProdById(id) {
    await this.getProdList()
    return this.prodList.find(prod => prod.id === id)
}

async getProdList() {
const data = await fs.promises.readFile(this.path, 'utf-8')
this.prodList = [JSON.parse(data).data]
return [...this.prodList]
}
async addPord(prod) {
    await this.getProdList()
    const newProduct = {
        title: 'azucar'
    }
    this.prodList.push(newProduct)
await fs.promises.writeFile(this.path, JSON.stringify({data:this.prodList}))
}
}

export default ProdManager