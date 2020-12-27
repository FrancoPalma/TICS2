import React from 'react';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import {  Button,
           DatePicker } from 'antd';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
      //Periodo
      ListaVentasPeriodo: null,
      desde : "",
      hasta : "",
      totalp0: 0,
      totalp1: 0,
      totalp2: 0,
      //
      tabIndex: 0,
      tabIndexSucursal:0,
      ready: false,
      ListaProductos: "",
      descuento: 0,
      cliente_nombre: "No Definido",
      cliente_telefono: 0,
      metodo_pago: 'efectivo',
      vendedor: '',
      sucursal: '0',
      total: 0,
      suma: 0,
      indexMetodo: 0,
      indexSucursal: 0,
      completado: 0,
      perfil: null,
      priv_dios: false,
      priv_descuento: null,
      ListaVentasDia: null,
      gerente: false,
      totald: 0,
      totalp:0,
      estado:5,
      estadosucursal:null,
      t1:0,
      t2:0,
      t3:0,
      tp1:0,
      tp2:0,
      tp3:0
    }
    this.handleChange = this.handleChange.bind(this)
    this.ActualizarInventario = this.ActualizarInventario.bind(this)
    this.ActualizarVentasDia = this.ActualizarVentasDia.bind(this)
    this.CalcularTotal = this.CalcularTotal.bind(this)
    this.CalcularTotal2 = this.CalcularTotal2.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChange2 = this.onChange2.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.handleChange3 = this.handleChange3.bind(this)
    this.ActualizarVentasPeriodo = this.ActualizarVentasPeriodo.bind(this)
    this.CalcularTotal3 = this.CalcularTotal3.bind(this)
  }
  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      vendedor: info.rut,
      sucursal: info.sucursal,
      priv_descuento: info.descuento_permitido,
      gerente: info.gerente
    })
    console.log(info.sucursal)
  }

  ActualizarVentasPeriodo() {
    fetch('/boletasperiodo', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      desde : this.state.desde,
      hasta : this.state.hasta
    })
    })
    .then(res => {
        return res.json()
    })
    .then(users => {
        this.setState({ListaVentasPeriodo: users})
        this.setState({priv_dios: true})
        this.CalcularTotal3();
    });
  }

  ActualizarVentasDia() {
  fetch('/boletasdia')
    .then(res => {
        return res.json()
    })
    .then(users => {
        this.setState({ListaVentasDia: users, ready: true})
        console.log(this.state.ready)
        this.CalcularTotal2();
    });
  }

  EliminarBoleta(oldData) {
    console.log(oldData._id)
    fetch('/eliminar_boleta/' + oldData._id, {
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
            this.setState({estado: 2})
        } else {
            console.log('Hubo un error')
            this.setState({estado: 4})
        }
    })
    .catch((error) => {
        console.log(error)
    });
  }

  state = {
    mockData: [],
    filterMock: [],
    targetKeys: [],
  };

  EliminarProducto(oldData) {
    console.log(oldData._id)
    fetch('/delete_producto/' + oldData._id, {
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
    this.getUsuario();
    this.ActualizarInventario();
    this.ActualizarVentasDia();
  }

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < this.state.ListaProductos.length; i++) {
      // codigo, tipo, material, piedra, descripcion, precio
      const data = {
        key: this.state.ListaProductos[i],
        codigo: `${this.state.ListaProductos[i].codigo}`,
        tipo: `${this.state.ListaProductos[i].tipo}`,
        material: `${this.state.ListaProductos[i].material}`,
        piedra: `${this.state.ListaProductos[i].piedra}`,
        precio: `${this.state.ListaProductos[i].precio}`,
        sucursal: `${this.state.ListaProductos[i].sucursal}`,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }

    const filterMock = mockData.filter(({sucursal}) => sucursal === this.state.sucursal);
    console.log(mockData)
    console.log(filterMock)
    this.setState({ filterMock, targetKeys });
  };

  ActualizarInventario() {
    fetch('/productos')
      .then(res => {
          console.log(res);
          return res.json()
      })
      .then(users => {
        console.log(users)
        this.setState({ListaProductos: users});
        this.getMock();
      });
  }

  CalcularTotal = () => {
    let tot = 0;
    for(let i = 0; i<this.state.targetKeys.length;i++) {
      tot = tot + this.state.targetKeys[i].precio;
    }
    let resultado = Math.trunc(tot*(1-(this.state.descuento/100)));
    this.setState({total:resultado})
    this.setState({suma:tot})
  }

  CalcularTotal2(){
    let tot0 = 0;
    let tot1 = 0;
    let tot2 = 0;
    if(this.state.perfil.gerente ===  true){
      for(let i = 0; i<this.state.ListaVentasDia.length;i++) {
        if(this.state.ListaVentasDia[i].vigencia === "Vigente"){
          if(this.state.ListaVentasDia[i].sucursal === '0'){
            tot0 = tot0 + this.state.ListaVentasDia[i].total;
          }
          else if(this.state.ListaVentasDia[i].sucursal === '1'){
            tot1 = tot1 + this.state.ListaVentasDia[i].total;
          }
          else if(this.state.ListaVentasDia[i].sucursal === '2'){
            tot2 = tot2 + this.state.ListaVentasDia[i].total;
          }
        }
      }
      this.setState({t1: tot0})
      this.setState({t2: tot1})
      this.setState({t3: tot2})
    }else{
      for(let i = 0; i<this.state.ListaVentasDia.length;i++) {
        if(this.state.ListaVentasDia[i].vigencia === "Vigente"){
          if(this.state.ListaVentasDia[i].sucursal === '0'){
            tot0 = tot0 + this.state.ListaVentasDia[i].total;
            if(this.state.perfil.sucursal=== '0'){
              this.setState({totald: tot0})
            }
          }
          else if(this.state.ListaVentasDia[i].sucursal === '1'){
            tot1 = tot1 + this.state.ListaVentasDia[i].total;
            if(this.state.perfil.sucursal=== '1'){
              this.setState({totald: tot1})
            }
          }
          else if(this.state.ListaVentasDia[i].sucursal === '2'){
            tot2 = tot2 + this.state.ListaVentasDia[i].total;
            if(this.state.perfil.sucursal=== '2'){
              this.setState({totald: tot2})
            }
          }
        }
      }
    }
    if(this.state.ListaVentasDia.length === 0){
      this.setState({estado: 3})
    }else{
      this.setState({estado: null})
    }
  }

  handleChange = targetKeys => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        this.CalcularTotal();
      }, 100)
      this.setState({ targetKeys });
    })
  };

  handleSelectChange(property) {
    return e => {
      new Promise((resolve) => {
        setTimeout(() => { this.getMock()}, 500)
        this.setState({[property]: e.target.value});
      })
    };
  }
  handleInputChange(property) {
    return e => {
      new Promise((resolve) => {
        setTimeout(() => {
          this.CalcularTotal();
        }, 100)
        this.setState({[property]: e.target.value});
      })
    };
  }
  onChange(date, dateString) {
    this.setState({desde: dateString});
    console.log(dateString)
  }
  onChange2(date, dateString) {
    this.setState({hasta: dateString});
    console.log(dateString)
  }
  handleChange2(event, newValue) {
    this.setState({tabIndex: newValue, estado:null, estadosucursal:null, completado:null, descuento:null});
  }
  handleChange3(event, newValue) {
    this.setState({tabIndexSucursal: newValue, estado:null, estadosucursal:null, completado:null, descuento:null, priv_dios: false});
  }
  CalcularTotal3(){
    let tot0 = 0;
    let tot1 = 0;
    let tot2 = 0;
    if(this.state.perfil.gerente ===  true){
      for(let i = 0; i<this.state.ListaVentasPeriodo.length;i++) {
        if(this.state.ListaVentasPeriodo[i].vigencia === "Vigente"){
          if(this.state.ListaVentasPeriodo[i].sucursal === '0'){
            tot0 = tot0 + this.state.ListaVentasPeriodo[i].total;
          }
          else if(this.state.ListaVentasPeriodo[i].sucursal === '1'){
            tot1 = tot1 + this.state.ListaVentasPeriodo[i].total;
          }
          else if(this.state.ListaVentasPeriodo[i].sucursal === '2'){
            tot2 = tot2 + this.state.ListaVentasPeriodo[i].total;
          }
        }
      }
      this.setState({tp1: tot0})
      this.setState({tp2: tot1})
      this.setState({tp3: tot2})
    }else{
      for(let i = 0; i<this.state.ListaVentasPeriodo.length;i++) {
        if(this.state.ListaVentasPeriodo[i].vigencia === "Vigente"){
          if(this.state.ListaVentasPeriodo[i].sucursal === '0'){
            tot0 = tot0 + this.state.ListaVentasPeriodo[i].total;
            if(this.state.perfil.sucursal=== '0'){
              this.setState({totalp: tot0})
            }
          }
          else if(this.state.ListaVentasPeriodo[i].sucursal === '1'){
            tot1 = tot1 + this.state.ListaVentasPeriodo[i].total;
            if(this.state.perfil.sucursal=== '1'){
              this.setState({totalp: tot1})
            }
          }
          else if(this.state.ListaVentasPeriodo[i].sucursal === '2'){
            tot2 = tot2 + this.state.ListaVentasPeriodo[i].total;
            if(this.state.perfil.sucursal=== '2'){
              this.setState({totalp: tot2})
            }
          }
        }
      }
    }
    if(this.state.ListaVentasPeriodo.length === 0){
      this.setState({estado: 4})
    }else{
      this.setState({estado: null})
    }
  }

  renderFooter = () => (
    <TextField
        select
        value={this.state.sucursal}
        onChange={this.handleSelectChange('sucursal')}
        color='secondary'
        variant='outlined'
        size='small'
      >
      <MenuItem key={'0'} value={'0'}>{'Lo Castillo'}</MenuItem>
      <MenuItem key={'1'} value={'1'}>{'Apumanque'}</MenuItem>
      <MenuItem key={'2'} value={'2'}>{'Vitacura'}</MenuItem>
    </TextField>
  );

  render() {
    let mensaje;
    if(this.state.estado === 4) {
      mensaje = <Alert severity="warning">No se encontraron boletas.</Alert>
    }else if (this.state.estado === 2) {
      mensaje = <Alert severity="success">Boleta anulada exitosamente.</Alert>
    }

    let aviso = <Alert severity="info">¡Para anular una boleta haz click en el basurero!</Alert>
    if(this.state.ready === true){
      let nombresucursal;
      if(this.state.perfil.sucursal === '0') { nombresucursal = 'Lo Castillo'}
      if(this.state.perfil.sucursal === '1') { nombresucursal = 'Apumanque'}
      if(this.state.perfil.sucursal === '2') { nombresucursal = 'Vitacura'}

      if(this.state.gerente === true){
        if(this.state.priv_dios === false){
            return (
              <div>
                <Card>
                  <AppBar position="static" color="primary" style={styles.Barrita}>
                    <Tabs value={this.state.tabIndexSucursal} onChange={this.handleChange3} aria-label="simple tabs example">
                      <Tab label="Lo Castillo" {...a11yProps('0')} />
                      <Tab label="Apumanque" {...a11yProps('1')} />
                      <Tab label="Vitacura" {...a11yProps('2')} />
                    </Tabs>
                  </AppBar>
                  <AppBar position="static" color="primary" style={styles.Barrita}>
                    <Tabs value={this.state.tabIndex} onChange={this.handleChange2} aria-label="simple tabs example">
                      <Tab label="Boletas Día" {...a11yProps(0)} />
                      <Tab label="Boletas por Periodo" {...a11yProps(1)} />
                    </Tabs>
                  </AppBar>
                    <TabPanel value={this.state.tabIndexSucursal} index={'0'}>
                    <TabPanel value={this.state.tabIndex} index={0}>
                    {aviso}
                      <div style={styles.root}>
                              <MaterialTable
                                  title={'Lo Castillo'}
                                  options={{filtering: true}}
                                  columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                            {title: 'Tipo', field: 'tipo'},
                                            { title: 'Fecha', field: 'fecha', type: 'date'},
                                            {title: 'Vendedor', field: 'vendedor'},
                                            { title: 'Cliente', field: 'cliente_nombre'},
                                            { title: 'Telefono', field: 'cliente_telefono'},
                                            { title: 'Descuento', field: 'descuento'},
                                            { title: 'Vigencia', field: 'vigencia' },
                                            {title: 'Total', field:'total'}]}
                                  data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '0')}
                                  editable={{
                                      onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                          setTimeout(() => {
                                            resolve();
                                            this.ActualizarVentasDia();
                                          }, 2000)
                                          this.EliminarBoleta(oldData)
                                        }),
                                  }}
                                />
                                <h4>
                                {"\n"} <br />
                                Total recaudado: ${this.state.t1}
                                </h4>
                      </div>
                      {mensaje}
                    </TabPanel>
                    <TabPanel value={this.state.tabIndex} index={1}>
                      <h4>Desde</h4>
                      <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                      <h4>Hasta</h4>
                      <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                      <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                        Listo
                      </Button>
                    </TabPanel>
                    </TabPanel>
                    <TabPanel value={this.state.tabIndexSucursal} index={'1'}>
                    <TabPanel value={this.state.tabIndex} index={0}>
                    {aviso}
                      <div style={styles.root}>
                              <MaterialTable
                                  title={'Apumanque'}
                                  options={{filtering: true}}
                                  columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                            {title: 'Tipo', field: 'tipo'},
                                            { title: 'Fecha', field: 'fecha', type: 'date'},
                                            {title: 'Vendedor', field: 'vendedor'},
                                            { title: 'Cliente', field: 'cliente_nombre'},
                                            { title: 'Telefono', field: 'cliente_telefono'},
                                            { title: 'Descuento', field: 'descuento'},
                                            { title: 'Vigencia', field: 'vigencia' },
                                            {title: 'Total', field:'total'}]}
                                  data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '1')}
                                  editable={{
                                      onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                          setTimeout(() => {
                                            resolve();
                                            this.ActualizarVentasDia();
                                          }, 2000)
                                          this.EliminarBoleta(oldData)
                                        }),
                                  }}
                                />
                                <h4>
                                {"\n"} <br />
                                Total recaudado: ${this.state.t2}
                                </h4>
                      </div>
                      {mensaje}
                    </TabPanel>
                    <TabPanel value={this.state.tabIndex} index={1}>
                      <h4>Desde</h4>
                      <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                      <h4>Hasta</h4>
                      <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                      <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                        Listo
                      </Button>
                    </TabPanel>
                    </TabPanel>
                    <TabPanel value={this.state.tabIndexSucursal} index={'2'}>
                    <TabPanel value={this.state.tabIndex} index={0}>
                    {aviso}
                      <div style={styles.root}>
                              <MaterialTable
                                  title={'Vitacura'}
                                  options={{filtering: true}}
                                  columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                            {title: 'Tipo', field: 'tipo'},
                                            { title: 'Fecha', field: 'fecha', type: 'date'},
                                            {title: 'Vendedor', field: 'vendedor'},
                                            { title: 'Cliente', field: 'cliente_nombre'},
                                            { title: 'Telefono', field: 'cliente_telefono'},
                                            { title: 'Descuento', field: 'descuento'},
                                            { title: 'Vigencia', field: 'vigencia' },
                                            {title: 'Total', field:'total'}]}
                                  data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '2')}
                                  editable={{
                                      onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                          setTimeout(() => {
                                            resolve();
                                            this.ActualizarVentasDia();
                                          }, 2000)
                                          this.EliminarBoleta(oldData)
                                        }),
                                  }}
                                />
                                <h4>
                                {"\n"} <br />
                                Total recaudado: ${this.state.t3}
                                </h4>
                      </div>
                      {mensaje}
                    </TabPanel>
                    <TabPanel value={this.state.tabIndex} index={1}>
                      <h4>Desde</h4>
                      <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                      <h4>Hasta</h4>
                      <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                      <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                        Listo
                      </Button>
                    </TabPanel>
                    </TabPanel>
                    <Copyright/>
                </Card>
              </div>
            );
        }else{
          return (
            <div>
              <Card>
                <AppBar position="static" color="primary" style={styles.Barrita}>
                  <Tabs value={this.state.tabIndexSucursal} onChange={this.handleChange3} aria-label="simple tabs example">
                    <Tab label="Lo Castillo" {...a11yProps('0')} />
                    <Tab label="Apumanque" {...a11yProps('1')} />
                    <Tab label="Vitacura" {...a11yProps('2')} />
                  </Tabs>
                </AppBar>
                <AppBar position="static" color="primary" style={styles.Barrita}>
                  <Tabs value={this.state.tabIndex} onChange={this.handleChange2} aria-label="simple tabs example">
                    <Tab label="Boletas Día" {...a11yProps(0)} />
                    <Tab label="Boletas por Periodo" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                  <TabPanel value={this.state.tabIndexSucursal} index={'0'}
                  <TabPanel value={this.state.tabIndex} index={0}>
                  {aviso}
                    <div style={styles.root}>
                            <MaterialTable
                                title={'Lo Castillo'}
                                options={{filtering: true}}
                                columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                          {title: 'Tipo', field: 'tipo'},
                                          { title: 'Fecha', field: 'fecha', type: 'date'},
                                          {title: 'Vendedor', field: 'vendedor'},
                                          { title: 'Cliente', field: 'cliente_nombre'},
                                          { title: 'Telefono', field: 'cliente_telefono'},
                                          { title: 'Descuento', field: 'descuento'},
                                          { title: 'Vigencia', field: 'vigencia' },
                                          {title: 'Total', field:'total'}]}
                                data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '0')}
                                editable={{
                                    onRowDelete: (oldData) =>
                                      new Promise((resolve) => {
                                        setTimeout(() => {
                                          resolve();
                                          this.ActualizarVentasDia();
                                        }, 2000)
                                        this.EliminarBoleta(oldData)
                                      }),
                                }}
                              />
                              <h4>
                              {"\n"} <br />
                              Total recaudado: ${this.state.t1}
                              </h4>
                    </div>
                    {mensaje}
                  </TabPanel>
                  <TabPanel value={this.state.tabIndex} index={1}>
                    <h4>Desde</h4>
                    <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                    <h4>Hasta</h4>
                    <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                    <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                      Listo
                    </Button>
                    {aviso}
                    <MaterialTable
                        title={'Lo Castillo'}
                        options={{filtering: true}}
                        columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                  {title: 'Tipo', field: 'tipo'},
                                  { title: 'Fecha', field: 'fecha', type: 'date'},
                                  {title: 'Vendedor', field: 'vendedor'},
                                  { title: 'Cliente', field: 'cliente_nombre'},
                                  { title: 'Telefono', field: 'cliente_telefono'},
                                  { title: 'Descuento', field: 'descuento'},
                                  { title: 'Vigencia', field: 'vigencia' },
                                  {title: 'Total', field:'total'}]}
                        data={this.state.ListaVentasPeriodo.filter(({sucursal}) => sucursal === '0')}
                        editable={{
                            onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                              setTimeout(() => {
                                resolve();
                                this.ActualizarVentasPeriodo();
                              }, 2000)
                              this.EliminarBoleta(oldData)
                            }),
                          }}
                      />
                      <h4>
                      {"\n"} <br />
                      Total recaudado: ${this.state.tp1}
                      </h4>
                      {mensaje}
                  </TabPanel>
                  </TabPanel>
                  <TabPanel value={this.state.tabIndexSucursal} index={'1'}
                  <TabPanel value={this.state.tabIndex} index={0}>
                  {aviso}
                    <div style={styles.root}>
                            <MaterialTable
                                title={'Apumanque'}
                                options={{filtering: true}}
                                columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                          {title: 'Tipo', field: 'tipo'},
                                          { title: 'Fecha', field: 'fecha', type: 'date'},
                                          {title: 'Vendedor', field: 'vendedor'},
                                          { title: 'Cliente', field: 'cliente_nombre'},
                                          { title: 'Telefono', field: 'cliente_telefono'},
                                          { title: 'Descuento', field: 'descuento'},
                                          { title: 'Vigencia', field: 'vigencia' },
                                          {title: 'Total', field:'total'}]}
                                data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '1')}
                                editable={{
                                    onRowDelete: (oldData) =>
                                      new Promise((resolve) => {
                                        setTimeout(() => {
                                          resolve();
                                          this.ActualizarVentasDia();
                                        }, 2000)
                                        this.EliminarBoleta(oldData)
                                      }),
                                }}
                              />
                              <h4>
                              {"\n"} <br />
                              Total recaudado: ${this.state.t2}
                              </h4>
                    </div>
                    {mensaje}
                  </TabPanel>
                  <TabPanel value={this.state.tabIndex} index={1}>
                    <h4>Desde</h4>
                    <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                    <h4>Hasta</h4>
                    <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                    <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                      Listo
                    </Button>
                    {aviso}
                    <MaterialTable
                        title={'Apumanque'}
                        options={{filtering: true}}
                        columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                  {title: 'Tipo', field: 'tipo'},
                                  { title: 'Fecha', field: 'fecha', type: 'date'},
                                  {title: 'Vendedor', field: 'vendedor'},
                                  { title: 'Cliente', field: 'cliente_nombre'},
                                  { title: 'Telefono', field: 'cliente_telefono'},
                                  { title: 'Descuento', field: 'descuento'},
                                  { title: 'Vigencia', field: 'vigencia' },
                                  {title: 'Total', field:'total'}]}
                        data={this.state.ListaVentasPeriodo.filter(({sucursal}) => sucursal === '1')}
                        editable={{
                            onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                              setTimeout(() => {
                                resolve();
                                this.ActualizarVentasPeriodo();
                              }, 2000)
                              this.EliminarBoleta(oldData)
                            }),
                          }}
                      />
                      <h4>
                      {"\n"} <br />
                      Total recaudado: ${this.state.tp2}
                      </h4>
                      {mensaje}
                  </TabPanel>
                  </TabPanel>
                  <TabPanel value={this.state.tabIndexSucursal} index={'0'}
                  <TabPanel value={this.state.tabIndex} index={0}>
                  {aviso}
                    <div style={styles.root}>
                            <MaterialTable
                                title={'Vitacura'}
                                options={{filtering: true}}
                                columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                          {title: 'Tipo', field: 'tipo'},
                                          { title: 'Fecha', field: 'fecha', type: 'date'},
                                          {title: 'Vendedor', field: 'vendedor'},
                                          { title: 'Cliente', field: 'cliente_nombre'},
                                          { title: 'Telefono', field: 'cliente_telefono'},
                                          { title: 'Descuento', field: 'descuento'},
                                          { title: 'Vigencia', field: 'vigencia' },
                                          {title: 'Total', field:'total'}]}
                                data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === '2')}
                                editable={{
                                    onRowDelete: (oldData) =>
                                      new Promise((resolve) => {
                                        setTimeout(() => {
                                          resolve();
                                          this.ActualizarVentasDia();
                                        }, 2000)
                                        this.EliminarBoleta(oldData)
                                      }),
                                }}
                              />
                              <h4>
                              {"\n"} <br />
                              Total recaudado: ${this.state.t3}
                              </h4>
                    </div>
                    {mensaje}
                  </TabPanel>
                  <TabPanel value={this.state.tabIndex} index={1}>
                    <h4>Desde</h4>
                    <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                    <h4>Hasta</h4>
                    <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                    <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                      Listo
                    </Button>
                    {aviso}
                    <MaterialTable
                        title={'Vitacura'}
                        options={{filtering: true}}
                        columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                  {title: 'Tipo', field: 'tipo'},
                                  { title: 'Fecha', field: 'fecha', type: 'date'},
                                  {title: 'Vendedor', field: 'vendedor'},
                                  { title: 'Cliente', field: 'cliente_nombre'},
                                  { title: 'Telefono', field: 'cliente_telefono'},
                                  { title: 'Descuento', field: 'descuento'},
                                  { title: 'Vigencia', field: 'vigencia' },
                                  {title: 'Total', field:'total'}]}
                        data={this.state.ListaVentasPeriodo.filter(({sucursal}) => sucursal === '2')}
                        editable={{
                            onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                              setTimeout(() => {
                                resolve();
                                this.ActualizarVentasPeriodo();
                              }, 2000)
                              this.EliminarBoleta(oldData)
                            }),
                          }}
                      />
                      <h4>
                      {"\n"} <br />
                      Total recaudado: ${this.state.tp3}
                      </h4>
                      {mensaje}
                  </TabPanel>
                  </TabPanel>
                <Copyright/>
              </Card>
            </div>
          );
      }
      }else{
        if(this.state.priv_dios === false){

            return (
              <div>
                <Card>
                  <AppBar position="static" color="primary" style={styles.Barrita}>
                    <Tabs value={this.state.tabIndex} onChange={this.handleChange2} aria-label="simple tabs example">
                      <Tab label="Boletas Día" {...a11yProps(0)} />
                      <Tab label="Boletas por Periodo" {...a11yProps(1)} />
                    </Tabs>
                  </AppBar>
                    <TabPanel value={this.state.tabIndex} index={0}>
                    {aviso}
                      <div style={styles.root}>
                              <MaterialTable
                                  title={nombresucursal}
                                  options={{filtering: true}}
                                  columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                            {title: 'Tipo', field: 'tipo'},
                                            { title: 'Fecha', field: 'fecha', type: 'date'},
                                            {title: 'Vendedor', field: 'vendedor'},
                                            { title: 'Cliente', field: 'cliente_nombre'},
                                            { title: 'Telefono', field: 'cliente_telefono'},
                                            { title: 'Descuento', field: 'descuento'},
                                            { title: 'Vigencia', field: 'vigencia' },
                                            {title: 'Total', field:'total'}]}
                                  data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                                  editable={{
                                      onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                          setTimeout(() => {
                                            resolve();
                                            this.ActualizarVentasDia();
                                          }, 2000)
                                          this.EliminarBoleta(oldData)
                                        }),
                                  }}
                                />
                                <h4>
                                {"\n"} <br />
                                Total recaudado: ${this.state.totald}
                                </h4>
                      </div>
                      {mensaje}
                    </TabPanel>
                    <TabPanel value={this.state.tabIndex} index={1}>
                      <h4>Desde</h4>
                      <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                      <h4>Hasta</h4>
                      <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                      <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                        Listo
                      </Button>
                    </TabPanel>
                    <Copyright/>
                </Card>
              </div>
            );
        }else{
          return (
            <div>
              <Card>
                <AppBar position="static" color="primary" style={styles.Barrita}>
                  <Tabs value={this.state.tabIndex} onChange={this.handleChange2} aria-label="simple tabs example">
                    <Tab label="Boletas Día" {...a11yProps(0)} />
                    <Tab label="Boletas por Periodo" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                  <TabPanel value={this.state.tabIndex} index={0}>
                  {aviso}
                    <div style={styles.root}>
                            <MaterialTable
                                title={nombresucursal}
                                options={{filtering: true}}
                                columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                          {title: 'Tipo', field: 'tipo'},
                                          { title: 'Fecha', field: 'fecha', type: 'date'},
                                          {title: 'Vendedor', field: 'vendedor'},
                                          { title: 'Cliente', field: 'cliente_nombre'},
                                          { title: 'Telefono', field: 'cliente_telefono'},
                                          { title: 'Descuento', field: 'descuento'},
                                          { title: 'Vigencia', field: 'vigencia' },
                                          {title: 'Total', field:'total'}]}
                                data={this.state.ListaVentasDia.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                                editable={{
                                    onRowDelete: (oldData) =>
                                      new Promise((resolve) => {
                                        setTimeout(() => {
                                          resolve();
                                          this.ActualizarVentasDia();
                                        }, 2000)
                                        this.EliminarBoleta(oldData)
                                      }),
                                }}
                              />
                              <h4>
                              {"\n"} <br />
                              Total recaudado: ${this.state.totald}
                              </h4>
                    </div>
                    {mensaje}
                  </TabPanel>
                  <TabPanel value={this.state.tabIndex} index={1}>
                    <h4>Desde</h4>
                    <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                    <h4>Hasta</h4>
                    <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                    <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                      Listo
                    </Button>
                    {aviso}
                    <MaterialTable
                        title={nombresucursal}
                        options={{filtering: true}}
                        columns={ [{ title: 'Numero', field: 'numero', type: 'numeric'},
                                  {title: 'Tipo', field: 'tipo'},
                                  { title: 'Fecha', field: 'fecha', type: 'date'},
                                  {title: 'Vendedor', field: 'vendedor'},
                                  { title: 'Cliente', field: 'cliente_nombre'},
                                  { title: 'Telefono', field: 'cliente_telefono'},
                                  { title: 'Descuento', field: 'descuento'},
                                  { title: 'Vigencia', field: 'vigencia' },
                                  {title: 'Total', field:'total'}]}
                        data={this.state.ListaVentasPeriodo.filter(({sucursal}) => sucursal === this.state.sucursal)}
                        editable={{
                            onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                              setTimeout(() => {
                                resolve();
                                this.ActualizarVentasPeriodo();
                              }, 2000)
                              this.EliminarBoleta(oldData)
                            }),
                          }}
                      />
                      <h4>
                      {"\n"} <br />
                      Total recaudado: ${this.state.totalp}
                      </h4>
                      {mensaje}
                  </TabPanel>
                <Copyright/>
              </Card>
            </div>
          );
      }
      }
    }else if(this.state.ready === false) {
    return (
      <div>
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
