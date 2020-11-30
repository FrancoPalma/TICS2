import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Alert from '@material-ui/lab/Alert';

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
      ListaEmpleados: null,
      ListaDescuentos: null,
      ready: false,
      nombre : null,
      rut : null,
      sucursal : null,
      edad: null,
      priv_emple: null,
      priv_priv : null,
      telefono: null,
      salario: null,
      tabIndex: 0,
      mensaje: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.MostrarNuevoMenu = this.MostrarNuevoMenu.bind(this)
    this.AgregarEmpleado = this.AgregarEmpleado.bind(this)
  }

  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      priv_emple: info.gestion_empleado,
      priv_priv: info.gestion_privilegios,
      isReady: true
    })
  }

  ActualizarEmpleados() {
    fetch('/empleados')
      .then(res => {
          return res.json()
      })
      .then(users => {
          this.setState({ListaEmpleados: users, ready: true})
          console.log(this.state.ListaEmpleados);
      });
    }

  ActualizarDescuentos() {
    fetch('/empleados_descuentos')
      .then(res => {
          return res.json()
      })
      .then(users => {
          this.setState({ListaDescuentos: users})
      });
    }

  AgregarEmpleado(newData) {
    let regex = new RegExp("^[a-z A-Z]+$");
    let regex2 = new RegExp("^[0-9 k]+$");
    let regex3 = new RegExp("^[0-9]+$");


    if(regex.test(newData.nombre) && regex2.test(newData.rut) && newData.telefono.length === 9 && regex3.test(newData.telefono)){
      fetch('/crear_empleado', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: newData.nombre,
        password: "Joyeria",
        rut: newData.rut,
        telefono: newData.telefono,
        sucursal: newData.sucursal,
        gestion_empleado: false,
        gestion_inventario: false,
        gestion_privilegios: false,
        descuento_permitido: 0
      })
      })
      .then( (response) => {
          if(response.status === 201) {
              console.log("Añadido correctamente")
              this.setState({mensaje: 1});

          } else {
              console.log('Hubo un error')
              this.setState({mensaje: 4});
          }
      })
      .catch((error) => {
          console.log(error)
      });
    }else{
      this.setState({mensaje: 5})
    }
  }

  EditarEmpleado(newData) {
    let regex = new RegExp("^[a-z A-Z]+$");
    let regex3 = new RegExp("^[0-9]+$");
    if(regex.test(newData.nombre) && (newData.telefono).toString().length === 9 && regex3.test(newData.telefono)){
      console.log(newData._id)
      fetch('/editar_empleado/' + newData._id, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newData._id,
        nombre: newData.nombre,
        telefono: newData.telefono,
        sucursal: newData.sucursal
      })
      })
      .then( (response) => {
          if(response.status === 201) {
              console.log("Editado correctamente")
              this.setState({mensaje: 2});
          } else {
              console.log('Hubo un error')
              this.setState({mensaje: 4});
              console.log(response.status)
          }
      })
      .catch((error) => {
          console.log(error)
      });
    }else{
      this.setState({mensaje: 5})
    }
  }

  EliminarEmpleado(oldData) {
    console.log(oldData._id)
    fetch('/delete_empleado/' + oldData._id, {
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
            this.setState({mensaje: 3});
        } else {
            console.log('Hubo un error')
            this.setState({mensaje: 4});
        }
    })
    .catch((error) => {
        console.log(error)
    });
  }

  componentDidMount() {
    this.getUsuario()
    this.ActualizarEmpleados()
  }

  EditarPrivilegios(newData) {
    if(newData.descuento_permitido <= 100 && newData.descuento_permitido >= 0){
      console.log(newData._id)
      fetch('/editar_privilegios/' + newData._id, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newData._id,
        gestion_empleado: newData.gestion_empleado,
        gestion_inventario: newData.gestion_inventario,
        gestion_privilegios: newData.gestion_privilegios,
        descuento_permitido: newData.descuento_permitido
      })
      })
      .then( (response) => {
          if(response.status === 201) {
              console.log("Editado correctamente")
              this.setState({mensaje: 2});
          } else {
              console.log('Hubo un error')
              this.setState({mensaje: 4});
          }
      })
      .catch((error) => {
          console.log(error)
      });
    }else{
      this.setState({mensaje: 6})
    }
  }

  handleChange(event, newValue) {
    this.setState({tabIndex: newValue});
  }

  actualizarTexto(event, id, value) {
    this.setState({id: value});
  }

  MostrarNuevoMenu() {
    if(this.state.estado === 0) this.setState({estado: 1})
    if(this.state.estado === 1) this.setState({estado: 0})
  }

  render() {
    let mensajito;

    if(this.state.mensaje === 1) {
      mensajito = <Alert severity="success">¡Empleado agregado correctamente!</Alert>
    }else if(this.state.mensaje === 2) {
      mensajito = <Alert severity="success">¡Empleado editado correctamente! Por favor reinicie la cuenta.</Alert>
    }else if(this.state.mensaje === 3) {
      mensajito = <Alert severity="success">¡Empleado eliminado correctamente!</Alert>
    }else if(this.state.mensaje === 4) {
      mensajito = <Alert severity="error">Lo sentimos, hubo un error, vuelva a intentarlo nuevamente.</Alert>
    }else if(this.state.mensaje === 5) {
      mensajito = <Alert severity="error">Los datos ingresados son erróneos, por favor reviselos y no utilice tildes.</Alert>
    }else if(this.state.mensaje === 6) {
      mensajito = <Alert severity="error">El descuento permitido solo puede estar en el rango de 0 a 100.</Alert>
    }

    if(this.state.ready === true) {
      if(this.state.priv_emple && this.state.priv_priv) {
        return (
          <div style={styles.root}>
              <Card>
                <AppBar position="static" color="primary" >
                  <Tabs value={this.state.tabIndex} onChange={this.handleChange} aria-label="Sucursales" >
                    <Tab label="Datos" {...a11yProps(0)}/>
                    <Tab label="Privilegios" {...a11yProps(1)}/>
                  </Tabs>
                </AppBar>
                <CardBody>

                  <TabPanel value={this.state.tabIndex} index={0}>
                  <MaterialTable
                      title=''
                      columns={ [{ title: 'Nombre', field: 'nombre', editable: 'onAdd'},
                                {title: 'Rut', field: 'rut', editable: 'onAdd'},
                                { title: 'Telefono', field: 'telefono'},
                                { title: 'Sucursal', field: 'sucursal', lookup: { 0: 'Lo Castillo', 1: 'Apumanque' ,2: 'Vitacura'}}]}
                      data={this.state.ListaEmpleados}
                      editable={{
                        onRowAdd: newData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                            this.AgregarEmpleado(newData);

                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                            this.EditarEmpleado(newData)
                          }),
                        onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                            this.EliminarEmpleado(oldData)
                          }),
                      }}
                    />
                    {mensajito}
                    <Copyright />
                  </TabPanel>
                  <TabPanel value={this.state.tabIndex} index={1}>
                  <MaterialTable
                      title='Privilegios'
                      columns={ [{ title: 'Nombre', field: 'nombre'},
                                {title: 'Gestión Empleados', field: 'gestion_empleado', type:'boolean'},
                                { title: 'Gestión Invetario', field: 'gestion_inventario', type:'boolean'},
                                { title: 'Gestión Privilegios', field: 'gestion_privilegios', type:'boolean'},
                                { title: 'Descuento Permitido', field: 'descuento_permitido', type:'numeric'}]}
                      data={this.state.ListaEmpleados}
                      editable={{
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                              this.EditarPrivilegios(newData)
                          })
                      }}
                    />
                    {mensajito}
                    <Copyright />
                  </TabPanel>
                </CardBody>
              </Card>
          </div>
        )
      }else if(this.state.priv_emple === false && this.state.priv_priv){
        return (
          <div style={styles.root}>
              <Card>
                <CardBody>
                  <MaterialTable
                      title='Privilegios'
                      columns={ [{ title: 'Nombre', field: 'nombre'},
                                {title: 'Gestión Empleados', field: 'gestion_empleado', type:'boolean'},
                                { title: 'Gestión Invetario', field: 'gestion_inventario', type:'boolean'},
                                { title: 'Gestión Privilegios', field: 'gestion_privilegios', type:'boolean'},
                                { title: 'Descuento Permitido', field: 'descuento_permitido', type:'numeric'}]}
                      data={this.state.ListaEmpleados}
                      editable={{
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                              this.EditarPrivilegios(newData)
                          })
                      }}
                    />
                </CardBody>
                <Copyright />
              </Card>
          </div>
        )
      } else if(this.state.priv_emple  && this.state.priv_priv === false){
        return (
          <div style={styles.root}>
              <Card>
                <CardBody>
                  <MaterialTable
                      title=''
                      columns={ [{ title: 'Nombre', field: 'nombre', editable: 'onAdd'},
                                {title: 'Rut', field: 'rut', editable: 'onAdd'},
                                { title: 'Telefono', field: 'telefono'},
                                { title: 'Sucursal', field: 'sucursal', lookup: { 0: 'Lo Castillo', 1: 'Apumanque' ,2: 'Vitacura'}}]}
                      data={this.state.ListaEmpleados}
                      editable={{
                        onRowAdd: newData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                            this.AgregarEmpleado(newData);

                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                            this.EditarEmpleado(newData)
                          }),
                        onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000)
                            this.EliminarEmpleado(oldData)
                          }),
                      }}
                    />
                </CardBody>
                <Copyright />
              </Card>
          </div>
        )
      }else{
        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} style={{display: 'flex',  justifyContent:'center', height: '100vh'}}>
              <Card profile style = {{width: 580, height: 400}}>
                <CardBody profile>
                  <div style={{textAlign: 'center'}}>
                    <h1>No tienes autorización para acceder a este sitio.</h1>
                  </div>
                </CardBody>
                <Copyright />
              </Card>
            </GridItem>
          </GridContainer>
        );
      }
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
