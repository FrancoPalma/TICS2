import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
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

export default class Ventas extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      ready: false,
      total0: 0,
      total1: 0,
      perfil: null,
      estado:null,
      estadosucursal:2,
      total2: 0,
      ListaVentasDia: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.ActualizarVentasDia = this.ActualizarVentasDia.bind(this)
    this.CalcularTotal = this.CalcularTotal.bind(this)

  }

  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      isReady: true,
      tabIndex: Number(info.sucursal)
    })
  }

  ActualizarVentasDia() {
    fetch('/ventasdia')
      .then(res => {
          return res.json()
      })
      .then(users => {
          this.setState({ListaVentasDia: users, ready: true})
          console.log(this.state.ListaVentasDia);
          this.CalcularTotal()
      });
    }
  CalcularTotal(){
    let tot0 = 0;
    let tot1 = 0;
    let tot2 = 0;
    for(let i = 0; i<this.state.ListaVentasDia.length;i++) {
      if(this.state.ListaVentasDia[i].sucursal === '0'){
        tot0 = tot0 + this.state.ListaVentasDia[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1})
          this.setState({estado:1})
        }
      }
      else if(this.state.ListaVentasDia[i].sucursal === '1'){
        tot1 = tot1 + this.state.ListaVentasDia[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1})
          this.setState({estado:1})
        }
      }
      else if(this.state.ListaVentasDia[i].sucursal === '2'){
        tot2 = tot2 + this.state.ListaVentasDia[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1})
          this.setState({estado:1})
        }
      }
    }
    if(this.state.ListaVentasDia.length === 0){
      this.setState({estado: 2})
    }else{
      this.setState({estado: 1})
    }
    this.setState({total0:tot0})
    this.setState({total1:tot1})
    this.setState({total2:tot2})
  }

  EliminarVenta(oldData) {
    console.log(oldData._id)
    fetch('/eliminar_venta/' + oldData._id, {
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
            this.setState({estado: 3})
            this.setState({estado: 3})
        } else {
            console.log('Hubo un error')
            this.setState({estadosucursal: 4})
            this.setState({estadosucursal: 4})
        }
    })
    .catch((error) => {
        console.log(error)
    });
  }

  handleChange(event, newValue) {
    this.setState({tabIndex: newValue});
  }

  componentDidMount() {
    this.getUsuario();
    this.ActualizarVentasDia()
  }

  render() {
    let mensajito;

    if(this.state.estado === 1) {
      mensajito = <Alert severity="success">Hay ventas!</Alert>
    } else if(this.state.estado === 2) {
      mensajito = <Alert severity="error">No se encontraron ventas :(</Alert>
    }else if(this.state.estado === 3) {
      mensajito = <Alert severity="success">La venta se eliminó correctamente</Alert>
    }else if(this.state.estado === 4) {
      mensajito = <Alert severity="error">Lo sentimos, hubo un error, vuelva a intentarlo</Alert>
    }

    let mensajitosucursal;

    if(this.state.estadosucursal === 1) {
      mensajitosucursal = <Alert severity="success">Hay ventas!</Alert>
    } else if(this.state.estadosucursal === 2) {
      mensajitosucursal = <Alert severity="error">No se encontraron ventas :(</Alert>
    }else if(this.state.estadosucursal === 3) {
      mensajito = <Alert severity="success">La venta se eliminó correctamente</Alert>
    }else if(this.state.estadosucursal === 4) {
      mensajito = <Alert severity="error">Lo sentimos, hubo un error, vuelva a intentarlo</Alert>
    }


    if(this.state.ready === true) {
      if(this.state.perfil.rol === 'duena'){
        console.log(this.state.ListaVentasDia)
        return (
          <div style={styles.root}>
            <Card>
              <AppBar position="static" color="primary" style={styles.Barrita}>
                <Tabs value={this.state.tabIndex} onChange={this.handleChange} aria-label="simple tabs example">
                  <Tab label="Lo Castillo" {...a11yProps(0)} />
                  <Tab label="Apumanque" {...a11yProps(1)} />
                  <Tab label="Vitacura" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
                <CardBody>
                <TabPanel value={this.state.tabIndex} index={0}>
                  <MaterialTable
                      title='Lo Castillo'
                      columns={ [{ title: 'Numero', field: 'numero_venta', type: 'numeric' },
                                { title: 'Descuento', field: 'descuento',type: 'numeric' },
                                { title: 'Fecha', field: 'fecha', type: 'date'},
                                { title: 'Pago', field: 'metodo_pago', type :'numeric'},
                                { title: 'Total', field: 'total' ,type: 'numeric'},
                                { title: 'Vendedor', field: 'vendedor'} ]}
                      data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '0')}
                      editable={{
                          onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                              setTimeout(() => {
                                resolve();
                                this.ActualizarVentasDia();
                              }, 2000)
                              this.EliminarVenta(oldData)
                            }),
                      }}
                    />
                  </TabPanel>

                  <TabPanel value={this.state.tabIndex} index={1}>
                  <MaterialTable
                      title='Apumanque'
                      columns={ [{ title: 'Numero', field: 'numero_venta', type: 'numeric' },
                                { title: 'Descuento', field: 'descuento',type: 'numeric' },
                                { title: 'Fecha', field: 'fecha', type: 'date'},
                                { title: 'Pago', field: 'metodo_pago' ,type: 'numeric'},
                                { title: 'Total', field: 'total' ,type: 'numeric'},
                                { title: 'Vendedor', field: 'vendedor'} ]}
                      data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '1')}
                      editable={{
                          onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarVentasDia();
                            }, 2000)
                            this.EliminarVenta(oldData)
                          }),
                        }}
                    />
                  </TabPanel>

                  <TabPanel value={this.state.tabIndex} index={2}>
                  <MaterialTable
                      title='Vitacura'
                      columns={ [{ title: 'Numero', field: 'numero_venta', type: 'numeric' },
                                { title: 'Descuento', field: 'descuento',type: 'numeric' },
                                { title: 'Fecha', field: 'fecha', type: 'date'},
                                { title: 'Pago', field: 'metodo_pago' ,type: 'numeric'},
                                { title: 'Total', field: 'total' ,type: 'numeric'},
                                { title: 'Vendedor', field: 'vendedor'} ]}
                      data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '2')}
                      editable={{
                        onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                          setTimeout(() => {
                            resolve();
                            this.ActualizarVentasDia();
                          }, 2000)
                          this.EliminarVenta(oldData)
                        }),
                      }}
                    />
                  </TabPanel>
                  {mensajito}
                </CardBody>
            </Card>
            <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}>
              <Grid item xs={6} text-align= "center">
              <h4>
              -Total en Lo Castillo: ${this.state.total0} <br/> -Total en Apumanque: ${this.state.total1} <br/> -Total en Vitacura: ${this.state.total2}
              </h4>
              <Box mt={8}>
                <Copyright />
              </Box>
              </Grid>
            </Grid>

          </div>
        );
      } else if(this.state.perfil.rol === 'jefe'){
        return (
          <div style={styles.root}>
            <Card>
                <CardBody>
                  <MaterialTable
                      title='Tu sucursal'
                      columns={ [{ title: 'Numero', field: 'numero_venta', type: 'numeric' },
                                { title: 'Descuento', field: 'descuento',type: 'numeric' },
                                { title: 'Fecha', field: 'fecha', type: 'date'},
                                { title: 'Pago', field: 'metodo_pago' },
                                { title: 'Total', field: 'total' ,type: 'numeric'},
                                { title: 'Vendedor', field: 'vendedor'} ]}
                      data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                      editable={{
                          onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                              setTimeout(() => {
                                resolve();
                                this.ActualizarVentasDia();
                              }, 2000)
                              this.EliminarVenta(oldData)
                            }),
                      }}
                    />
                </CardBody>
            </Card>
            <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}>
              <Grid item xs={6} text-align= "center">
              {this.state.perfil.sucursal === '0' &&
              <h4>
              -Total en Ventas: ${this.state.total0}
              </h4>
              }
              {this.state.perfil.sucursal === '1' &&
              <h4>
              -Total en Ventas: ${this.state.total1}
              </h4>
              }
              {this.state.perfil.sucursal === '2' &&
              <h4>
              -Total en Ventas: ${this.state.total2}
              </h4>
              }
              <Box mt={8}>
                {mensajitosucursal}

                <Copyright />
              </Box>
              </Grid>
            </Grid>
          </div>
        );
      } else if(this.state.perfil.rol === 'vendedor'){
        return (
          <div style={styles.root}>
            <Card>
                <CardBody>
                  <MaterialTable
                      title='Tu sucursal'
                      columns={ [{ title: 'Numero', field: 'numero_venta', type: 'numeric' },
                                { title: 'Descuento', field: 'descuento',type: 'numeric' },
                                { title: 'Fecha', field: 'fecha', type: 'date'},
                                { title: 'Pago', field: 'metodo_pago' },
                                { title: 'Total', field: 'total' ,type: 'numeric'},
                                { title: 'Vendedor', field: 'vendedor'} ]}
                      data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                      editable={{ }}
                    />
                </CardBody>
            </Card>
            <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}>
              <Grid item xs={6} text-align= "center">
              {this.state.perfil.sucursal === '0' &&
              <h4>
              -Total en Ventas: ${this.state.total0}
              </h4>
              }
              {this.state.perfil.sucursal === '1' &&
              <h4>
              -Total en Ventas: ${this.state.total1}
              </h4>
              }
              {this.state.perfil.sucursal === '2' &&
              <h4>
              -Total en Ventas: ${this.state.total2}
              </h4>
              }
              <Box mt={8}>
                {mensajitosucursal}

                <Copyright />
              </Box>
              </Grid>
            </Grid>
          </div>
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
