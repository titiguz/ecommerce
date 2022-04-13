import express from "express";
import Carritos from "../services/carritos.js";
import Productos from "../services/productos.js";

const router = express.Router();
const cartsService = new Carritos();
const productsService = new Productos();

router.post('/', async(req, res) => {
	let id = Math.floor(Math.random() * 1000000 + 1);
	let timestamp = Date.now();
	let productos = [];
	await cartsService.save({id, timestamp, productos});
	res.send({message: `El Carrito ${id} fue creado con éxito`});
});

router.delete('/:id', async(req, res) => {
	let {id} = req.params;
	let resDelete = await cartsService.delete(id);
	if(!resDelete) return res.send({message: "El carrito no existe"});
	res.send({message: "El Carrito fue eliminado :("});
});

router.get('/:id/productos', async(req, res) => {
	let {id} = req.params;
	let carrito = await cartsService.getCartById(id);	
	if (!carrito) return res.send({error: "El carrito no existe"});
	if(!carrito.productos) res.send({message: "El carrito está vacío"});
	res.send(carrito.productos);
});

router.post('/:id/productos', async(req, res) => {
	let {id} = req.params;
	let {productos} = req.body;
	let carrito = await cartsService.getCartById(id);
	if (!carrito) return res.send({error: "El carrito no existe"});
	productos.forEach(async(productId) => {
		let product = await productsService.getProductById(productId);
		if(product) carrito.productos.push(product);
	});
	let resUpdate = await cartsService.update(carrito);
	if(!resUpdate) return res.send({message: "El carrito no existe"});
	res.send({message: "Se agregaron los productos al carrito"});
});

router.delete('/:id/productos/:id_prod', async(req, res) => {
	let {id, id_prod} = req.params;
	let carrito = await cartsService.getCartById(id);
	if (!carrito) return res.send({error: "El carrito no existe"});
	let resDelete = await cartsService.deleteProduct(id, id_prod);
	if(!resDelete) return res.send({message: "El producto no está en el carrito"});
	res.send({message: "El producto fue eliminado del carrito"});
});

export default router;