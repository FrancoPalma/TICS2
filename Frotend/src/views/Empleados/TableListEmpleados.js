import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

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
      estado: 0,
      ListaEmpleados: null,
      ready: false,
      nombre : null,
      rut : null,
      sucursal : null,
      edad: null,
      rol: null,
      telefono: null,
      salario: null,

    }
    this.handleChange = this.handleChange.bind(this)
    this.MostrarNuevoMenu = this.MostrarNuevoMenu.bind(this)
    this.AgregarEmpleado = this.AgregarEmpleado.bind(this)
  }

  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      isReady: true,
      tabIndex: Number(info.sucursal)
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

  AgregarEmpleado(newData) {
    let estados = null;
    if(newData.estado === true) {
      estados = 1;
    } else {
      estados = 0;
    }

    fetch('/crear_empleado', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre: newData.nombre,
      nacimiento: newData.nacimiento,
      telefono: newData.telefono,
      rol: newData.rol,
      sucursal: this.state.tabIndex.toString()
    })
    })
    .then( (response) => {
        if(response.status === 201) {
            console.log("Añadido correctamente")

        } else {
            console.log('Hubo un error')
        }
    })
    .catch((error) => {
        console.log(error)
    });
  }

  EditarEmpleado(newData) {
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
      nacimiento: newData.nacimiento,
      telefono: newData.telefono,
      rol: newData.rol,
      sucursal: this.state.tabIndex.toString()
    })
    })
    .then( (response) => {
        if(response.status === 201) {
            console.log("Editado correctamente")
        } else {
            console.log('Hubo un error')
        }
    })
    .catch((error) => {
        console.log(error)
    });
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
        } else {
            console.log('Hubo un error')
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

  AgregarEmpleado() {
    console.log(this.state.tabIndex)
    fetch('/agregar_empleado', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre : this.state.nombre,
      rut : this.state.rut,
      sucursal : this.state.sucursal,
      edad: this.state.edad,
      rol: this.state.rol,
      telefono: this.state.telefono,
      salario: this.state.salio,
    })
    })
    .then( (response) => {
        if(response.status === 201) {
            console.log("Añadido correctamente")
        } else {
            console.log('Hubo un error')
        }
    })
    .catch((error) => {
        console.log(error)
    });
  }

  render() {

    if(this.state.ready === true) {

      let nombresucursal;
      if(this.state.tabIndex === '0') { nombresucursal = 'Lo Castillo'}
      if(this.state.tabIndex === '1') { nombresucursal = 'Apumanque'}
      if(this.state.tabIndex === '2') { nombresucursal = 'Vitacura'}


      if(this.state.perfil.rol === 'duena') {

        return (
          <div style={styles.root}>
              <Card>
                <AppBar position="static" color="primary" >
                  <Tabs value={this.state.tabIndex} onChange={this.handleChange} aria-label="simple tabs example" >
                    <Tab label="Lo Castillo" {...a11yProps(0)}/>
                    <Tab label="Apumanque" {...a11yProps(1)}/>
                    <Tab label="Vitacura" {...a11yProps(2)}/>
                  </Tabs>
                </AppBar>

                <CardBody>
                  <TabPanel value={this.state.tabIndex} index={0}>
                  <MaterialTable
                      title='Lo Castillo'
                      columns={ [{ title: 'Nombre', field: 'nombre'},
                                { title: 'Fecha', field: 'nacimiento'},
                                { title: 'Telefono', field: 'telefono'},
                                { title: 'Rol', field: 'rol', lookup: { 'duena': 'DUEÑA', 'jefe': 'JEFE' ,'vendedor': 'VENDEDOR'}}]}
                      data={this.state.ListaEmpleados.filter(({sucursal}) => sucursal === '0')}
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
                  </TabPanel>

                  <TabPanel value={this.state.tabIndex} index={1}>
                  <MaterialTable
                      title='Apumanque'
                      columns={ [{ title: 'Nombre', field: 'nombre'},
                                { title: 'Fecha', field: 'nacimiento'},
                                { title: 'Telefono', field: 'telefono'},
                                { title: 'Rol', field: 'rol', lookup: { 'duena': 'DUEÑA', 'jefe': 'JEFE' ,'vendedor': 'VENDEDOR'}}]}
                      data={this.state.ListaEmpleados.filter(({sucursal}) => sucursal === '1')}
                      editable={{
                        onRowAdd: (newData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000);
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
                  </TabPanel>

                  <TabPanel value={this.state.tabIndex} index={2}>
                  <MaterialTable
                      title='Vitacura'
                      columns={ [{ title: 'Nombre', field: 'nombre'},
                                { title: 'Fecha', field: 'nacimiento'},
                                { title: 'Telefono', field: 'telefono'},
                                { title: 'Rol', field: 'rol', lookup: { 'duena': 'DUEÑA', 'jefe': 'JEFE' ,'vendedor': 'VENDEDOR'}}]}
                      data={this.state.ListaEmpleados.filter(({sucursal}) => sucursal === '2')}
                      editable={{
                        onRowAdd: (newData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarEmpleados();
                            }, 2000);
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
                  </TabPanel>
                </CardBody>
              </Card>
          </div>
        )
      } else if(this.state.perfil.rol === 'jefe') {
        return (
          <div style={styles.root}>
              <Card>
                <CardBody>
                  <MaterialTable
                      title= {nombresucursal}
                      columns={ [{ title: 'Nombre', field: 'nombre'},
                                { title: 'Fecha', field: 'nacimiento', type:'date'},
                                { title: 'Telefono', field: 'telefono'},
                                { title: 'Rol', field: 'rol', lookup: { 'duena': 'DUEÑA', 'jefe': 'JEFE' ,'vendedor': 'VENDEDOR'}}]}
                      data={this.state.ListaEmpleados.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                      editable={{}}
                      />
                </CardBody>
              </Card>
          </div>
        )
      } else{
        return (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} style={{display: 'flex',  justifyContent:'center', height: '100vh'}}>
              <Card profile style = {{width: 580, height: 400}}>
                <CardBody profile>
                  <div style={{textAlign: 'center'}}>
                    <h1>No tienes autorización para acceder a este sitio.</h1>
                  </div>
                </CardBody>
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
