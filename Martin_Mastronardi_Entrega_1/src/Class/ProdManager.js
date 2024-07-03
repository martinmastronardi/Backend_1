import fs from 'node:fs'

class ProManager { 
constructor(path) {
this.path = path
}
    
async addPord(prod) {
await fs.promises.writeFile(this.path, JSON.stringify({data:[]}))
}
}

export default ProManager