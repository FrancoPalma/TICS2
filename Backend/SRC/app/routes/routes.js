const express = require('express');
const session = require('express-session');
const router = express.Router();
const producto = require('../models/producto');
const inventario = require('../models/inventario');
const pedido = require('../models/pedido');
const Venta = require('../models/venta');
const venta = require('../models/venta');
const crearVenta = require('../models/venta');
const empleado = require('../models/usuario');
const passport = require('../../config/passport');
const boleta = require('../models/boleta');

router.use(passport.initialize());
router.use(passport.session());

	// index routes
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
		venta.find({$and: [{fecha: {$gte: new Date(dia_inicio)}},{fecha: {$lt: new Date(dias)}}]}, (err, venta) => {
			if(err) {
				return 0;
			}
			else{
				return venta.length;
			}
		});
	}

	function semana(){
		let fecha = Date.now();
		let semana = 7*(24*60*60*1000);
		let dia_inicio = dias - semana;
		venta.find({$and: [{fecha: {$gte: new Date(dia_inicio)}},{fecha: {$lt: new Date(fecha)}}]}, (err, venta) => {
			if(err) {
				return 0;
			}
			else{
				return venta.length;
			}
		});
	}

	//login view
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


	// signup view
	router.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/inicio',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));




	//profile view
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

//Administrar productos
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
	let codigo = req.body.codigo.toUpperCase();
	let material = req.body.material.toUpperCase();
	let tipo = req.body.tipo.toUpperCase();
	let piedra = req.body.piedra.toUpperCase();
	let precio = req.body.precio;
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
  await producto.findByIdAndUpdate(id, {codigo: codigo, material: material, tipo: tipo, piedra: piedra, precio: precio, descripcion: descripcion, sucursal: sucursal}, function (err) {
		if(!err){
   		res.sendStatus(201);
		}
		else{
		   res.sendStatus(404);
		   console.log(err)
		}
  });
 });

 router.post('/delete_producto/:id', isLoggedIn, async function(req,res){
    let id = req.params.id;
    await producto.remove({_id: id}, (err, task) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
    });
});


//Gestionar pedidos
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
	let cliente = req.body.cliente.toUpperCase();
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
	let estado = req.body.estado;
	let total = req.body.total;
  await pedido.create({fecha: fecha, cliente: cliente, sucursal: sucursal, descripcion: descripcion, estado: estado, total: total}, (err) =>{
			if(!err){
	     res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
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
    await pedido.remove({_id: id}, (err, task) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
    });
});

router.post('/editar_pedido/:id', isLoggedIn, async function(req, res){
	let id = req.body.id
	let fecha = req.body.fecha;
	let cliente = req.body.cliente.toUpperCase();
	let sucursal = req.body.sucursal;
	let descripcion = req.body.descripcion.toUpperCase();
	let estado = req.body.estado.toUpperCase();
	let total = req.body.total;
	await pedido.findByIdAndUpdate(id,{fecha: fecha, cliente: cliente, sucursal: sucursal, descripcion: descripcion, estado: estado, total: total}, function (err) {
		if(!err){
			res.sendStatus(201)
		}
		else{
			res.sendStatus(404)
	}
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

//Realizar venta, se usa una lista para guardar los productos que desea el usuario
router.get('/lista_venta', isLoggedIn, isLoggedIn, async function(req,res){
  	await lista.find(function (err,lista) {
			if (!err){
				res.json(lista);
			}else{
				res.sendStatus(404);
			}
	});
});

router.get('/ventasdia', isLoggedIn, async function(req,res) {
	let fecha = Date.now();
	let dias = fecha/ (24*60*60*1000); //paso a dias
	let dia_actual = dias%1;
	let aux = dia_actual*(24*60*60*1000);
	dias = dias*(24*60*60*1000);// paso a milisegundos
	let dia_inicio = dias - aux;
	await venta.find({$and: [{fecha: {$gte: new Date(dia_inicio)}},{fecha: {$lt: new Date(dias)}}]}, (err, venta) => {
		if(err) {
			res.sendStatus(404);
		}
		else{
			res.json(venta);
		}
	});
});

router.post('/ventasperiodo', isLoggedIn, async function(req,res){
		const fecha1 = req.body.desde;
		const fecha2 = req.body.hasta;
		const fi = fecha1.concat("T00:00:00-04:00");
		const ff = fecha2.concat("T23:59:00-04:00");
		await venta.find({$and: [{fecha: {$gte: new Date(fi)}},{fecha: {$lt: new Date(ff)}}]}, (err, venta) => {
			if(err) {
				res.sendStatus(404);
			}
			else{
				res.json(venta);
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
	let largo = prods.length;
	let id = prods[0].id
	let empleadoLog = req.body.empleadoLog;

	await empleado.findOne({'rut': vendedor}, async function(err, empleado){
		if(!empleado){
			res.sendStatus(405);
		}else{
			await venta.find({} , async (err, venta) => {
				if( venta.length == null || venta.length == 0 ){
					crearVenta.create({numero_venta: 1, fecha: fecha, sucursal: sucursal, productos: prods}, (err) =>{
						if(!err){
							boleta.create({fecha: fecha, empleadoLog: empleadoLog, vendedor: vendedor, metodo_pago: metodo_pago, descuento: descuento, total: total, sucursal: sucursal, cliente_nombre: cliente_nombre, cliente_telefono: cliente_telefono, tipo: 'Venta', numero: numero}, (err) =>{
								if(!err){
									res.sendStatus(201);
								}else{
									res.sendStatus(404);
								}
							})
						}else{
							res.sendStatus(404);
						};
					});
				}else{
					crearVenta.create({numero_venta: venta.length + 1, fecha: fecha, metodo_pago: metodo_pago, descuento: descuento, sucursal: sucursal, vendedor: vendedor, total: total, productos: prods}, (err) =>{
						if(!err){
							res.sendStatus(201);
						}else{
							res.sendStatus(404);
						};
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

router.get('/agregar_venta/:numVenta', isLoggedIn, async function(req,res){
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
  });


//Gestionar empleados
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
