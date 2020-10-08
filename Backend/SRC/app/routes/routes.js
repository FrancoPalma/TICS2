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
					return res.json(user) //res.sendStatus(201) para mandar 201 y res.json(user) para mandar usuario
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
router.get('/productos', async function(req, res){  //lista de productos, tiene buscador
	producto.find(function(err, producto){
      if(err){
         res.sendStatus(404);
      } else {
				res.json(producto);
			}
	});
});

router.post('/agregar_prod', (req,res) => {
	let codigo = req.body.codigo.toUpperCase();
	let material = req.body.material.toUpperCase();
	let tipo = req.body.tipo.toUpperCase();
	let piedra = req.body.piedra.toUpperCase();
	let precio = req.body.precio;
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
  producto.create({codigo: codigo, material: material, tipo: tipo, piedra: piedra, precio: precio, descripcion: descripcion, sucursal: sucursal}, (err) =>{
		if(!err){
     	res.sendStatus(201);
	}else{
     	res.sendStatus(404);
	}
  });
});

router.post('/editar_prod/:id', function(req, res) {
	let id = req.params.id;
	let codigo = req.body.codigo.toUpperCase();
	let material = req.body.material.toUpperCase();
	let tipo = req.body.tipo.toUpperCase();
	let piedra = req.body.piedra.toUpperCase();
	let precio = req.body.precio;
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
  producto.findByIdAndUpdate(id, {codigo: codigo, material: material, tipo: tipo, piedra: piedra, precio: precio, descripcion: descripcion, sucursal: sucursal}, function (err) {
		if(!err){
   		res.sendStatus(201);
		}
		else{
		   res.sendStatus(404);
		   console.log(err)
		}
  });
 });

 router.post('/delete_producto/:id', (req,res) =>{
    let id = req.params.id;
    producto.remove({_id: id}, (err, task) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
    });
});


//Gestionar pedidos
router.get('/pedidos', async function(req, res){  //lista de productos, tiene buscador
	 pedido.find(function(err, pedido){
     if(err){
       res.sendStatus(404)
     } else {
				res.json(pedido)
		 }
  });
});

router.post('/agregar_pedido', (req,res) => {
	let fecha = req.body.fecha;
	let cliente = req.body.cliente.toUpperCase();
	let descripcion = req.body.descripcion.toUpperCase();
	let sucursal = req.body.sucursal;
	let estado = req.body.estado;
	let total = req.body.total;
    pedido.create({fecha: fecha, cliente: cliente, sucursal: sucursal, descripcion: descripcion, estado: estado, total: total}, (err) =>{
			if(!err){
	     res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
			}
    });
});

router.get('/delete_pedido/:id', (req,res) =>{
    let id = req.params.id;
    pedido.remove({_id: id}, (err, task) =>{
			if(!err){
				res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
			}
    });
});


router.post('/eliminar_pedido/:id', (req,res) =>{
    let id = req.params.id;
    pedido.remove({_id: id}, (err, task) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
    });
});

router.post('/editar_pedido/:id', function(req, res) {
	let id = req.body.id
	let fecha = req.body.fecha;
	let cliente = req.body.cliente.toUpperCase();
	let sucursal = req.body.sucursal;
	let descripcion = req.body.descripcion.toUpperCase();
	let estado = req.body.estado.toUpperCase();
	let total = req.body.total;
	pedido.findByIdAndUpdate(id,{fecha: fecha, cliente: cliente, sucursal: sucursal, descripcion: descripcion, estado: estado, total: total}, function (err) {
		if(!err){
			res.sendStatus(201)
		}
		else{
			res.sendStatus(404)
	}
});
});

router.post('/editar_descripcion_pedido/:id', function(req, res) {
		let fecha = req.body.fecha;
		let cliente = req.body.cliente.toUpperCase();
		let sucursal = req.body.sucursal.toUpperCase();
		let descripcion = req.body.descripcion.toUpperCase();
		let estado = req.body.estado.toUpperCase();
		let total = req.body.total;
    pedido.findByIdAndUpdate(req.parmas.id,{cliente: cliente, sucursal: sucursal, descripción: descripcion, total: total}, function (err) {
			if(!err){
				res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
		}
  });
});

router.post('/editar_estado_pedido/:id', function(req, res) {
		let fecha = req.body.fecha;
		let cliente = req.body.cliente.toUpperCase();
		let sucursal = req.body.sucursal.toUpperCase();
		let descripcion = req.body.descripcion.toUpperCase();
		let estado = req.body.estado.toUpperCase();
		let total = req.body.total;
    pedido.findByIdAndUpdate(req.params.id,{estado: estado}, function (err) {
			if(!err){
				res.sendStatus(201)
			}
			else{
				res.sendStatus(404)
		}
  });
});

//Realizar venta, se usa una lista para guardar los productos que desea el usuario
router.get('/lista_venta', isLoggedIn, (req,res) =>{
  	lista.find(function (err,lista) {
			if (!err){
				if(lista.length != null){
					res.json(lista);
				}
			}else{
				res.sendStatus(404);
			}
	});
});

router.get('/ventasdia', async function(req,res) {
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

router.post('/ventasperiodo', async function(req,res) {
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

router.post('/crear_venta', async (req,res) => {
	let prods = req.body.lista;
	let fecha = Date.now();
	let metodo_pago = req.body.metodo_pago.toUpperCase();
	let descuento = req.body.descuento;
	let sucursal = req.body.sucursal.toString();
	let vendedor = req.body.vendedor.toUpperCase();
	let total = req.body.total;

	await venta.find({} , async (err, venta) => {
		if( venta.length == null || venta.length == 0 ){
			crearVenta.create({numero_venta: 1, fecha: fecha, metodo_pago: metodo_pago, descuento: descuento, sucursal: sucursal, vendedor: vendedor, total: total, productos: prods}, (err) =>{
				if(!err){
					res.sendStatus(201);
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
});

router.post('/eliminar_venta/:id', (req,res) =>{
    let id = req.params.id;
    venta.remove({_id: id}, (err, task) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
    });
});

router.get('/agregar_venta/:numVenta', isLoggedIn, (req,res) => {
		venta.findOne({numero_venta: req.params.numVenta}, (err, venta) =>{
			res.render('agregar_venta', {
				user: req.user,
				venta: venta
			});
		});
});

router.post('/agregar_venta/:id', function(req, res) {
    venta.findByIdAndUpdate(req.params.id, req.body, function (err) {
      if(err){
        res.sendStatus(404);
    } else {
      res.redirect('../venta');
    }
    });
  });


//Gestionar empleados
router.get('/empleados', isLoggedIn, (req,res) =>{
    empleado.find(function (err,empleado) {
			if (!err){
				res.json(empleado);
			}else{
				res.sendStatus(404);
			}
    });
});

router.post('/crear_empleado', function (req, res) {
			passport.authenticate('local-signup', function(err, user) {
			if (err) { return res.sendStatus(404); }
			if (!user) { return res.sendStatus(404); }
			return res.sendStatus(201); //res.sendStatus(201) para mandar 201 y res.json(user) para mandar usuari
		}) (req, res);
});

router.post('/delete_empleado/:id', isLoggedIn, (req,res) =>{
    let id = req.params.id;
    empleado.remove({_id: id}, (err) =>{
			if(!err){
     		res.sendStatus(201);
			}
			else{
     		res.sendStatus(404);
			}
	});
});


router.post('/editar_empleado/:id', function(req, res) {
	let telefono= req.body.telefonotoUpperCase();
	let rol = req.body.rol.toUpperCase();
	let sucursal = req.body.sucursal.toUpperCase();
	empleado.findByIdAndUpdate(req.parmas.id,{telefono: telefono, rol: rol, sucursal: sucursal}, function (err) {
		if(!err){
			res.sendStatus(201)
		}
		else{
			res.sendStatus(404)
	}
});
  });

	router.post('/editar_password/', function(req, res) {
			let new_pass = req.body.new_pass;
	    empleado.findByIdAndUpdate(req.params.rut,{password: new_pass}, function (err) {
				if(!err){
					res.sendStatus(201)
				}
				else{
					res.sendStatus(404)
			}
	  });
	});

module.exports = router;
