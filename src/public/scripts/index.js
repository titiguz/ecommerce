let divProductos = document.getElementById('productos');
let cartId = DEFAUL_CART_ID;
let isAdmin = ADMIN;

fetch('/api/productos')
	.then(response => response.json())
	.then(data => {
		let productos = "";
		let divButton = "";
		data.forEach(producto => {
			if(isAdmin){
				divButton = `
					<div class="card-footer bg-transparent border">
						<a href="updateProduct.html?id=${producto.id}" class="btn btn-sm btn-dark" name="editButton" data-id="${producto.id}">Actualizar</a>
						<a href="#" class="btn btn-sm btn-dark" onclick="deleteAction(this)" name="deleteButton" data-id="${producto.id}" data-name="${producto.nombre}">Eliminar</a>
						<a href="#" class="btn btn-dark" onclick="addToCartAction(this)" name="addToCartButton" data-id="${producto.id}" data-name="${producto.nombre}"> Agregar al carrito</a>
					</div>
				`;
			}else{
				divButton = `
					<div class="card-footer bg-transparent border">
						<a href="#" class="btn btn-dark" onclick="addToCartAction(this)" name="addToCartButton" data-id="${producto.id}" data-name="${producto.nombre}"> Agregar al carrito</a>
					</div>
				`;
			}

			productos = productos + `
				<div class="card mt-2 bg-light border">
					<div class="card-header">
						<h5 class="card-title">${producto.nombre}</h5>
					</div>
					<div class="card-body">
						<h6 class="card-subtitle mb-2 text-muted">${producto.descripcion}</h6>
						<p class="card-text"><img src=${producto.foto} style="height:28rem;" /><br>
							Código: ${producto.codigo}<br>
							Stock: ${producto.stock}	
						
						</p>
						<p class="card-text"><small class="text-muted"> ${producto.precio}</small></p>
					</div>
					${divButton}
				</div>
			`;
		});
		divProductos.innerHTML = productos;
	}
);

const deleteAction = (btn) => {
	let productId = btn.getAttribute('data-id');
	let productName = btn.getAttribute('data-name');

	Swal.fire({
		title: "¿Estás segura?",
		text: `Estás por eliminar el producto: ${productName} :()`,
		type: "warning",
		showCancelButton: true,
		allowOutsideClick: false,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Aceptar',
		cancelButtonText: "Cancelar"
	}).then((result) => {
		if(result.dismiss === 'cancel') return false;

		fetch(`/api/productos/${productId}`, {
			method: 'DELETE'
		})
		.then(response => response.json())
		.then(data => location.reload());
	});
};

const addToCartAction = (btn) => {
	let productId = btn.getAttribute('data-id');
	let productName = btn.getAttribute('data-name');

	Swal.fire({
		title: "¿Querés agregar el producto al carrito?",
		text: `Estás por agregar el producto: ${productName} a tu carrito de compras :).`,
		type: "warning",
		showCancelButton: true,
		allowOutsideClick: false,
		confirmButtonColor: '#000',
		confirmButtonText: 'Aceptar',
		cancelButtonText: "Cancelar"
	}).then((result) => {
		if(result.dismiss === 'cancel') return false;

		let obj = {"productos": [productId]};

		fetch(`/api/carrito/${cartId}/productos`, {
			method: 'POST',
			body: JSON.stringify(obj),
			headers: {
				"Content-Type": "application/json"
			} 
		})
		.then(response => response.json())
		.then(data => {
			Swal.fire(
				'¡Listo!',
				'El producto fue agregado a tu carrito wujuu.',
				'success'
			);
		});
	});
};