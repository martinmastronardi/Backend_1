import fs from 'node:fs'

class ProManager { 
constructor(path) {
this.path = path
this.prodList = []
}
   
async getProdList() {
const data = await fs.promises.readFile(this.path, 'utf-8')
this.prodList = JSON.parse(data).data
return this.prodList
}
async addPord(prod) {
    await this.getProdList()
    this.prodList.push(prod)
await fs.promises.writeFile(this.path, JSON.stringify({data:this.prodList}))
}
}

export default ProManager