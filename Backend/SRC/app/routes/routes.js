const express = require('express');
const session = require('express-session');
const router = express.Router();
const producto = require('../models/producto');
const inventario = require('../models/inventario');
const pedido = require('../models/pedido');
const registro = require('../models/registro')
const eliminarPedido = require('../models/pedido');
const crearPedido = require('../models/pedido');
const Venta = require('../models/venta');
const venta = require('../models/venta');
const crearVenta = require('../models/venta');
const empleado = require('../models/usuario');
const passport = require('../../config/passport');
const boleta = require('../models/boleta');

router.use(passport.initialize());
router.use(passport.session());

router.get('/inicio', isLoggedIn, (req, res) => {
	let dia = dia()
	let semana = semama();
	res.json({
		dia: dia,
		semana: semana
	})
});



	function dia(){
		let fecha = Date.now();
		let dias = fecha/ (24*60*60*1000); //paso a dias
		let dia_actual = dias%1;
		let aux = dia_actual*(24*60*60*1000);
		dias = dias*(24*60*60*1000);// paso a milisegundos
		let dia_inicio = dias - aux;
		boleta.find({$and: [{fecha: {$gte: new Date(dia_inicio)}},{fecha: {$lt: new Date(dias)}}]}, (err, boleta) => {
			if(err) {
				return 0;
			}
			else{
				return boleta.length;
			}
		});
	}

	function semana(){
		let fecha = Date.now();
		let semana = 7*(24*60*60*1000);
		let dia_inicio = dias - semana;
		boleta.find({$and: [{fecha: {$gte: new Date(dia_inicio)}},{fecha: {$lt: new Date(fecha)}}]}, (err, boleta) => {
			if(err) {
				return 0;
			}
			else{
				return boleta.length;
			}
		});
	}

function descuento_vendedor(){

}

	////----------------------------------------------LOG IN----------------------------------------------
	router.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});


	router.post('/login', function (req,res) {
				passport.authenticate('local-login', function(err, user) {
				if (err) { return res.sendStatus(404); }
				if (!user) { return res.sendStatus(404); }
				console.log("Usuario recibido")

				req.logIn(user, function(err) {
					if (err) { return next(err); }
						return res.json(user)
					});
			}) (req, res);
	});


//----------------------------------------------GESTIONAR PERFIL----------------------------------------------
	router.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user
		});
	});

	// logout
	router.get('/logout', (req, res) => {
		req.logout();
		res.sendStatus(201);
	});



function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

////----------------------------------------------GESTIONAR PRODUCTOS----------------------------------------------
router.get('/productos', isLoggedIn,async function(req, res){  //lista de productos, tiene buscador
		await producto.find(function(err, producto){
	      if(err){
	         res.sendStatus(404);
	      } else {
					res.json(producto);
				}
		});
});

router.post('/agregar_prod', isLoggedIn, async function(req,res){
	let codigo = req.body.codigo.toUpperCase();
	let material = req.body.material.toUpperCase();
	let tipo = req.body.tipo.toUpperCase();
	let piedra = req.body.piedra.toUpperCase();
	let precio = req.body.precio;
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
	let cantidad = req.body.cantidad;
  await producto.create({codigo: codigo, material: material, tipo: tipo, piedra: piedra, precio: precio, descripcion: descripcion, sucursal: sucursal, cantidad: cantidad}, (err) =>{
		if(!err){
     	res.sendStatus(201);
	}else{
     	res.sendStatus(404);
	}
  });
});

router.post('/editar_prod/:id', isLoggedIn, async function(req, res){
	let id = req.params.id;
	let material = req.body.material.toUpperCase();
	let tipo = req.body.tipo.toUpperCase();
	let piedra = req.body.piedra.toUpperCase();
	let precio = req.body.precio;
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
	await producto.findById(id, async function(err, producto){
		let codigo = producto.codigo
	  await producto.findByIdAndUpdate(id, {material: material, tipo: tipo, piedra: piedra, precio: precio, descripcion: descripcion, sucursal: sucursal}, async function (err) {
			await registro.create({tipo: 'Producto', numero: codigo, detalle: 'Se editó un producto', empleadoLog: req.user.rut, sucursal: req.user.sucursal}, function (err){
				if(!err){
					res.sendStatus(201);
				}
				else{
					 res.sendStatus(404);
				}
			})
	  });
	});
 });

/*await registro.create({tipo: 'Producto', numero: codigo, detalle: 'Se editó un producto', empleadoLog: req.user.rut, , sucursal: req.user.sucursal}, function (err){
	if(!err){
		res.sendStatus(201);
	}
	else{
		 res.sendStatus(404);
	}
})*/

 router.post('/delete_producto/:id', isLoggedIn, async function(req,res){
    let id = req.params.id;
		await producto.findById(id, async function(err, producto){
			let codigo = producto.codigo
			await producto.remove({_id: id}, async function(err, task){
				await registro.create({tipo: 'Producto', numero: codigo, detalle: 'Se eliminó un producto', empleadoLog: req.user.rut, sucursal: req.user.sucursal}, function (err){
					if(!err){
						res.sendStatus(201);
					}
					else{
						 res.sendStatus(404);
					}
				})
			});
		});
});


//----------------------------------------------GESTIONAR PEDIDOS----------------------------------------------
router.get('/pedidos', isLoggedIn, async function(req, res){  //lista de productos, tiene buscador
	 await pedido.find(function(err, pedido){
     if(err){
       res.sendStatus(404)
     } else {
				res.json(pedido)
		 }
  });
});

router.post('/agregar_pedido', isLoggedIn, async function(req,res){
	let fecha = req.body.fecha;
	let cliente_nombre = req.body.cliente_nombre.toUpperCase();
	let cliente_telefono = req.body.cliente_telefono.toUpperCase()
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
	let estado = req.body.estado;
	let abono = req.body.abono;
	let total = req.body.total;
	let empleadoLog = req.body.empleadoLog;
	let vendedor = req.body.vendedor;
	let metodo_pago = req.body.metodo_pago;
	let descuento = req.body.descuento;
	await pedido.find({}, async function(err, pedido){
		let nuevo_numero_pedido = 1
		if( pedido.length == null || pedido.length == 0 ){
	  	await crearPedido.create({numero_pedido: nuevo_numero_pedido,fecha: fecha, sucursal: sucursal, descripcion: descripcion, cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, estado: estado, abono:abono}, (err) =>{
				boleta.create({fecha: fecha, empleadoLog: empleadoLog, vendedor: vendedor, metodo_pago: metodo_pago, descuento: descuento, total: total, sucursal: sucursal, cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, tipo: 'Pedido', numero: 1}, (err) =>{
					if(!err){
						res.sendStatus(201)
					}else{
						res.sendStatus(404)
					}
				});
			});
		}else{
			let nuevo_numero_pedido = pedido.length + 1
			await crearPedido.create({fecha: fecha, sucursal: sucursal, descripcion: descripcion, cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, estado: estado, abono:abono}, (err) =>{
				if(!err){
					boleta.create({numero_pedido: nuevo_numero_pedido, fecha: fecha, empleadoLog: empleadoLog, vendedor: vendedor, metodo_pago: metodo_pago, descuento: descuento, total: total, sucursal: sucursal, cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, tipo: 'Pedido', numero: venta.length + 1}, (err) =>{
						if(!err){
							res.sendStatus(201)
						}else{
							res.sendStatus(404)
						}
					});
				}else{
					res.sendStatus(404)
				}
			});
	}
	});
});



router.get('/delete_pedido/:id', isLoggedIn, async function(req,res){

    let id = req.params.id;
    await pedido.remove({_id: id}, (err, task) =>{
			if(!err){
				res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
			}
    });
});


router.post('/eliminar_pedido/:id', isLoggedIn, async function(req,res){
    let id = req.params.id;
		await pedido.findById(id, async function(err, pedido){
			let numero_pedido = pedido.numero_pedido;
	    await eliminarPedido.remove({_id: id}, async function(err){
				await registro.create({tipo: 'Pedido', numero: numero_pedido, detalle: 'Se eliminó un pedido', empleadoLog: req.user.rut, sucursal: req.user.sucursal}, function (err){
					if(!err){
						res.sendStatus(201);
					}
					else{
						 res.sendStatus(404);
					}
				});
	    });
	});
});

router.post('/editar_pedido/:id', isLoggedIn, async function(req, res){
	let id = req.body.id
	let fecha = req.body.fecha;
	let cliente_nombre = req.body.cliente_nombre.toUpperCase();
	let cliente_telefono = req.body.cliente_telefono;
	let sucursal = req.body.sucursal;
	let descripcion = req.body.descripcion.toUpperCase();
	let estado = req.body.estado.toUpperCase();
	let total = req.body.total;
	await pedido.findById(id, async function(err, pedido){
		let numero_pedido = pedido.numero_pedido;
		await crearPedido.findByIdAndUpdate(req.params.id,{cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, sucursal: sucursal, descripción: descripcion, estado: estado, total: total}, async function (err) {
			await registro.create({tipo: 'Pedido', numero: numero_pedido, detalle: 'Se editó un pedido', empleadoLog: req.user.rut, sucursal: req.user.sucursal}, function (err){
				if(!err){
					res.sendStatus(201);
				}
				else{
					 res.sendStatus(404);
				}
			});
		})
	});
});

router.post('/editar_descripcion_pedido/:id', isLoggedIn, async function(req, res){
		let fecha = req.body.fecha;
		let cliente = req.body.cliente.toUpperCase();
		let sucursal = req.body.sucursal.toUpperCase();
		let descripcion = req.body.descripcion.toUpperCase();
		let estado = req.body.estado.toUpperCase();
		let total = req.body.total;
    await pedido.findByIdAndUpdate(req.parmas.id,{cliente: cliente, sucursal: sucursal, descripción: descripcion, total: total}, function (err) {
			if(!err){
				res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
		}
  });
});

router.post('/editar_estado_pedido/:id', isLoggedIn, async function(req, res){
		let fecha = req.body.fecha;
		let cliente = req.body.cliente.toUpperCase();
		let sucursal = req.body.sucursal.toUpperCase();
		let descripcion = req.body.descripcion.toUpperCase();
		let estado = req.body.estado.toUpperCase();
		let total = req.body.total;
    await pedido.findByIdAndUpdate(req.params.id,{estado: estado}, function (err) {
			if(!err){
				res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
		}
  });
});

//----------------------------------------------GESTIONAR VENTAS----------------------------------------------
router.get('/lista_venta', isLoggedIn, isLoggedIn, async function(req,res){
  	await lista.find(function (err,lista) {
			if (!err){
				res.json(lista);
			}else{
				res.sendStatus(404);
			}
	});
});

router.get('/boletasdia', isLoggedIn, async function(req,res) {
	let fecha = Date.now();
	let dias = fecha/ (24*60*60*1000); //paso a dias
	let dia_actual = dias%1;
	let aux = dia_actual*(24*60*60*1000);
	dias = dias*(24*60*60*1000);// paso a milisegundos
	let dia_inicio = dias - aux;
	await boleta.find({$and: [{fecha: {$gte: new Date(dia_inicio)}},{fecha: {$lt: new Date(dias)}}]}, (err, boleta) => {
		if(err) {
			res.sendStatus(404);
		}
		else{
			res.json(boleta);
		}
	});
});

router.post('/boletasperiodo', isLoggedIn, async function(req,res){
		const fecha1 = req.body.desde;
		const fecha2 = req.body.hasta;
		const fi = fecha1.concat("T00:00:00-04:00");
		const ff = fecha2.concat("T23:59:00-04:00");
		await boleta.find({$and: [{fecha: {$gte: new Date(fi)}},{fecha: {$lt: new Date(ff)}}]}, (err, boleta) => {
			if(err) {
				res.sendStatus(404);
			}
			else{
				res.json(boleta);
			}
		});

});

router.post('/crear_venta', isLoggedIn, async function(req,res){
	let prods = req.body.lista;
	let fecha = Date.now();
	let metodo_pago = req.body.metodo_pago.toUpperCase();
	let descuento = req.body.descuento;
	let sucursal = req.body.sucursal.toString();
	let vendedor = req.body.vendedor.toUpperCase();
	let total = req.body.total;
	let empleadoLog = req.body.empleadoLog;
	let cliente_nombre = req.body.cliente_nombre.toUpperCase();
	let cliente_telefono = req.body.cliente_telefono;

	await empleado.findOne({'rut': vendedor}, async function(err, empleado){
		if(!empleado){
			res.sendStatus(405);
		}else{
			await venta.find({} , async (err, venta) => {
				if( venta.length == null || venta.length == 0 ){
					let nuevo_numero_venta = 1
					crearVenta.create({numero_venta: nuevo_numero_venta, fecha: fecha, sucursal: sucursal, productos: prods}, (err, crearVenta) =>{
						if(!err){
							for(i = 0; i < prods.length; i++){
								boleta.create({fecha: fecha, empleadoLog: empleadoLog, vendedor: vendedor, metodo_pago: metodo_pago, descuento: descuento, total_venta: total, valor_prod: prods[i].precio, sucursal: sucursal, cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, tipo: 'Venta', cod_prod: prods[i], numero: nuevo_numero_venta}, (err) => {
									if(err){
										res.sendStatus(404)
									}
								});
							}
							res.sendStatus(201)
						}else{
							res.sendStatus(404)
						}
					});
				}else{
					let nuevo_numero_venta = venta.length + 1
					crearVenta.create({numero_venta: nuevo_numero_venta, fecha: fecha, sucursal: sucursal, productos: prods}, (err) =>{
						if(!err){
							for(i = 0; i < prods.length; i++){
								boleta.create({fecha: fecha, empleadoLog: empleadoLog, vendedor: vendedor, metodo_pago: metodo_pago, descuento: descuento, total: total, sucursal: sucursal, cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, tipo: 'Venta', cod_prod: prods[i].codigo, numero: nuevo_numero_venta}, (err) => {
									if(err){
										res.sendStatus(404)
									}
								});
								}
							res.sendStatus(201)
						}else{
							res.sendStatus(404)
						}
					});
				};
			});
		};
});
});



router.post('/eliminar_venta/:id', isLoggedIn, async function(req,res){
    let id = req.params.id;
    await venta.remove({_id: id}, (err, task) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
    });
});

/*router.get('/agregar_venta/:numVenta', isLoggedIn, async function(req,res){
		await venta.findOne({numero_venta: req.params.numVenta}, (err, venta) =>{
			res.render('agregar_venta', {
				user: req.user,
				venta: venta
			});
		});
});

router.post('/agregar_venta/:id', isLoggedIn, async function(req, res){
    await venta.findByIdAndUpdate(req.params.id, req.body, function (err) {
      if(err){
        res.sendStatus(404);
    } else {
      res.redirect('../venta');
    }
    });
  });*/


//----------------------------------------------GESTIONAR EMPLEADOS----------------------------------------------
router.get('/empleados', isLoggedIn, async function(req,res){
    await empleado.find(function (err, empleado) {
			if (!err){
				res.json(empleado);
			}else{
				res.sendStatus(404);
			}
    });
});

router.post('/crear_empleado', async function(req, res){
			await passport.authenticate('local-signup', function(err, user) {
			if (err) { return res.sendStatus(404); }
			if (!user) { return res.sendStatus(404); }
			return res.sendStatus(201); //res.sendStatus(201) para mandar 201 y res.json(user) para mandar usuari
		}) (req, res);
});

router.post('/delete_empleado/:id', isLoggedIn, async function(req,res){
    let id = req.params.id;
    await empleado.remove({_id: id}, (err) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
	});
});


router.post('/editar_empleado/:id', async function(req, res){
	let telefono= req.body.telefono;

	let sucursal = req.body.sucursal.toUpperCase();
	await empleado.findByIdAndUpdate(req.params.id,{telefono: telefono, sucursal: sucursal}, function (err) {
		if(!err){
			res.sendStatus(201)
		}
		else{
			res.sendStatus(404)
	}
});
  });

	router.post('/editar_password', async function(req, res){
			let new_pass = req.body.new_pass;
	    await empleado.findByIdAndUpdate(req.params.rut,{password: empleado.generateHash(new_pass)}, function (err) {
				if(!err){
					res.sendStatus(201)
				}
				else{
					res.sendStatus(404)
			}
	  });
	});

	router.post('/editar_privilegios/:id',async function(req,res){
		let gestion_e = req.body.gestion_empleado;
		let gestion_i = req.body.gestion_inventario;
		let gestion_p = req.body.gestion_privilegios;
		let descuento_permitido = req.body.descuento_permitido;
		await empleado.findByIdAndUpdate(req.params.id,{gestion_empleado:gestion_e, gestion_inventario:gestion_i, gestion_privilegios:gestion_p, descuento_permitido:descuento_permitido},function(err){
			if (!err){
				res.sendStatus(201);
			}else{
				res.sendStatus(404);
			}
		});
	});

module.exports = router;
