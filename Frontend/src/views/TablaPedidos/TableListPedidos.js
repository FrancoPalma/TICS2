import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Grid } from '@material-ui/core';
import Link from '@material-ui/core/Link';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  picker: {
    height: 50
  },
  formControl: {
    marginHorizontal: 10,
    minWidth: 160,
  },
  selectEmpty: {
    marginTop: 20,
  },
  root: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  botonera: {
    marginRight: "auto",
    marginLeft: 20,
    marginBottom: 10
  },
  botonañadir: {
    width: 150,
  },
  añadirestilo: {
    margin: 'auto',
    marginBottom:20,
  },
  formañadir: {
    marginLeft: 5,
    marginRight: 5
  }
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" target="_blank" href="https://cadisjoyas.cl/">
        Joyeía Cadis
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default class InventarioTableList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      ready: false,
      ListaPedidos: null,
      mensaje: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.AgregarPedido = this.AgregarPedido.bind(this)
    this.ActualizarPedidos = this.ActualizarPedidos.bind(this)
  }

  ActualizarPedidos() {
    fetch('/pedidos')
      .then(res => {
          return res.json()
      })
      .then(users => {
          this.setState({ListaPedidos: users, ready: true})
          console.log(this.state.ListaPedidos);
      });
    }

  AgregarPedido(newData) {
    let regex = new RegExp("^[a-z A-Z]+$");

    if(regex.test(newData.cliente)){

      let estados = null;
      if(newData.estado === true) {
        estados = 1;
      } else {
        estados = 0;
      }

      fetch('/agregar_pedido', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: newData.fecha,
        cliente: newData.cliente,
        descripcion: newData.descripcion,
        estado: estados,
        total: newData.total,
        sucursal: this.state.tabIndex.toString()
      })
      })
      .then( (response) => {
          if(response.status === 201) {
              console.log("Añadido correctamente")
              this.setState({mensaje: 1})
          } else {
              console.log('Hubo un error')
              this.setState({mensaje: 2})
          }
      })
      .catch((error) => {
          console.log(error)
      });

    }else{
      this.setState({mensaje: 6})
    }
  }

  EditarPedido(newData) {
    let regex = new RegExp("^[a-z A-Z]+$");
    if(regex.test(newData.cliente)){
      fetch('/editar_pedido/' + newData._id, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newData._id,
        fecha: newData.fecha,
        cliente: newData.cliente,
        descripcion: newData.descripcion,
        estado: newData.estado,
        total: newData.total,
        sucursal: this.state.tabIndex.toString()
      })
      })
      .then( (response) => {
          if(response.status === 201) {
              console.log("Editado correctamente")
              this.setState({mensaje: 3})
          } else {
              console.log('Hubo un error')
              this.setState({mensaje: 2})
          }
      })
      .catch((error) => {
          console.log(error)
      });
    }else{
      this.setState({mensaje: 6})
    }
  }

  EliminarPedido(oldData) {
    console.log(oldData._id)
    fetch('/eliminar_pedido/' + oldData._id, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: oldData._id,
    })
    })
    .then( (response) => {
        if(response.status === 201) {
            console.log("Eliminado correctamente")
            this.setState({mensaje: 4})
        } else {
            console.log('Hubo un error')
            this.setState({mensaje: 2})
        }
    })
    .catch((error) => {
        console.log(error)
    });
  }

  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      isReady: true,
      tabIndex: Number(info.sucursal)
    })
  }

  componentDidMount() {
    this.getUsuario()
    this.ActualizarPedidos()
    console.log(this.state.ListaPedidos)
  }

  handleChange(event, newValue) {
    this.setState({tabIndex: newValue});
  }

  actualizarTexto(event, id, value) {
    this.setState({id: value});
  }

  render() {
    let mensajito;
    if(this.state.mensaje === 1) {
      mensajito = <Alert severity="success">Pedido agregado correctamente</Alert>
    }else if(this.state.mensaje === 2) {
      mensajito = <Alert severity="error">Lo sentimos, hubo un error, vuelva a intentarlo nuevamente</Alert>
    }else if(this.state.mensaje === 3) {
      mensajito = <Alert severity="success">El pedido se editó correctamente</Alert>
    }else if(this.state.mensaje === 4) {
      mensajito = <Alert severity="success">El pedido se eliminó correctamente</Alert>
    }else if(this.state.mensaje === 5) {
      mensajito = <Alert severity="error">Usted solo puede editar el estado y descripción</Alert>
    }else if(this.state.mensaje === 6){
      mensajito = <Alert severity="error">No se permiten números en los campos de cliente o descripción</Alert>
    }

    if(this.state.ready === true) {
      let nombresucursal;
        if(this.state.perfil.sucursal === '0') { nombresucursal = 'Lo Castillo'}
        if(this.state.perfil.sucursal === '1') { nombresucursal = 'Apumanque'}
        if(this.state.perfil.sucursal === '2') { nombresucursal = 'Vitacura'}
      return (
        <div style={styles.root}>
          <Card>
            <CardBody>
              <MaterialTable
                title= {nombresucursal}
                columns={ [{ title: 'Fecha', field: 'fecha', type: 'date' },
                          { title: 'Cliente', field: 'cliente' },
                          { title: 'Descripcion', field: 'descripcion'},
                          { title: 'Estado', field: 'estado', lookup: { 0: 'EN PROCESO', 1: 'LISTO PARA RETIRO' ,2: 'ENTREGADO'}},
                          { title: 'Total', field: 'total' ,type: 'numeric'}]}
                data={this.state.ListaPedidos.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        resolve();
                        this.ActualizarPedidos();
                      }, 2000)
                      this.AgregarPedido(newData);

                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        this.ActualizarPedidos();
                      }, 2000)
                      this.EditarPedido(newData)
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        this.ActualizarPedidos();
                      }, 2000)
                      this.EliminarPedido(oldData)
                    }),
                }}  />
                <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}>
                  <Grid item xs={6} text-align= "center">
                  <Box mt={8}>
                    {mensajito}
                    <Copyright />
                  </Box>
                  </Grid>
                </Grid>
                </CardBody>
              </Card>
          </div>
        )
    } else if(this.state.ready === false) {
      return(
        <div style={styles.root}>
        <Card>
          <CardBody>
            <p> Espera por favor.</p>
          </CardBody>
        </Card>
        </div>
      )
    }
  }
}
