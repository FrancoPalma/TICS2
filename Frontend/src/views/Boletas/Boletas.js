import React from 'react';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import {  Transfer,
          Button,
          Tag,
          Table, DatePicker } from 'antd';
import difference from 'lodash/difference';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const leftTableColumns = [
  {
    dataIndex: 'codigo',
    title: 'Codigo',
    render: codigo => <Tag>{codigo}</Tag>,
  },
  {
    dataIndex: 'tipo',
    title: 'Tipo',
  },
  {
    dataIndex: 'material',
    title: 'Material',
    render: material => <Tag color="purple">{material}</Tag>,
  },
  {
    dataIndex: 'piedra',
    title: 'Piedra',
    render: piedra => <Tag color="green">{piedra}</Tag>,
  },
  {
    dataIndex: 'precio',
    title: 'Precio',
    render: precio => <Tag color="red">{precio}</Tag>,
  },

];

const rightTableColumns = [
  {
    dataIndex: 'codigo',
    title: 'Codigo',
    render: codigo => <Tag>{codigo}</Tag>,
  },
  {
    dataIndex: 'tipo',
    title: 'Tipo',
  },
  {
    dataIndex: 'material',
    title: 'Material',
    render: material => <Tag color="purple">{material}</Tag>,
  },
  {
    dataIndex: 'piedra',
    title: 'Piedra',
    render: piedra => <Tag color="green">{piedra}</Tag>,
  },
  {
    dataIndex: 'precio',
    title: 'Precio',
    render: precio => <Tag color="red">{precio}</Tag>,
  },
];

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
      totald: 0,
      totalp:0,
      estado:null,
      estadosucursal:null,
    }
    this.handleChange = this.handleChange.bind(this)
    this.ActualizarInventario = this.ActualizarInventario.bind(this)
    this.ActualizarVentasDia = this.ActualizarVentasDia.bind(this)
    this.CalcularTotal = this.CalcularTotal.bind(this)
    this.CalcularTotal2 = this.CalcularTotal2.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChange2 = this.onChange2.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.ActualizarVentasPeriodo = this.ActualizarVentasPeriodo.bind(this)
    this.CalcularTotal3 = this.CalcularTotal3.bind(this)
  }
  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      vendedor: info.rut,
      sucursal: info.sucursal,
      priv_descuento: info.descuento_permitido
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
            this.setState({estado: 3})
        } else {
            console.log('Hubo un error')
            this.setState({estado: 9})
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
    for(let i = 0; i<this.state.ListaVentasDia.length;i++) {
      if(this.state.ListaVentasDia[i].sucursal === '0'){
        tot0 = tot0 + this.state.ListaVentasDia[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1})
          this.setState({estado:1, totald: tot0})
        }
      }
      else if(this.state.ListaVentasDia[i].sucursal === '1'){
        tot1 = tot1 + this.state.ListaVentasDia[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1})
          this.setState({estado:1, totald: tot1})
        }
      }
      else if(this.state.ListaVentasDia[i].sucursal === '2'){
        tot2 = tot2 + this.state.ListaVentasDia[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1})
          this.setState({estado:1, totald: tot2})
        }
      }
    }
    if(this.state.ListaVentasDia.length === 0){
      this.setState({estado: 2})
    }else{
      this.setState({estado: 1})
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

  CalcularTotal3(){
    let tot0 = 0;
    let tot1 = 0;
    let tot2 = 0;
    for(let i = 0; i<this.state.ListaVentasPeriodo.length;i++) {
      if(this.state.ListaVentasPeriodo[i].sucursal === '0'){
        tot0 = tot0 + this.state.ListaVentasPeriodo[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1, totalp: tot0})
        }
      }
      else if(this.state.ListaVentasPeriodo[i].sucursal === '1'){
        tot1 = tot1 + this.state.ListaVentasPeriodo[i].total;
        if(this.state.perfil.sucursal=== '1'){
          this.setState({estadosucursal:1, totalp: tot1})
        }
      }
      else if(this.state.ListaVentasPeriodo[i].sucursal === '2'){
        tot2 = tot2 + this.state.ListaVentasPeriodo[i].total;
        if(this.state.perfil.sucursal=== '2'){
          this.setState({estadosucursal:1, totalp: tot2})
        }
      }
    }
    if(this.state.ListaVentasPeriodo.length === 0){
      this.setState({estado: 2})
    }else{
      this.setState({estado: 1})
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

    let mensajeventa;
    let mensajeventadia;
    if(this.state.completado === 1) {
      mensajeventa = <Alert severity="success">Venta completada</Alert>
    } else if(this.state.completado === 2) {
      mensajeventa = <Alert severity="error">Hubo un error con la venta.</Alert>
    }else if(this.state.completado === 8) {
      mensajeventa = <Alert severity="error">Rut de vendedor invalido.</Alert>
    }
    if(this.state.priv_descuento < this.state.descuento) {
      mensajeventa = <Alert severity="error">Excede el descuento maximo permitido.</Alert>
    }else if(this.state.descuento < 0){
      mensajeventa = <Alert severity="error">Valor invalido.</Alert>
    }

    if(this.state.estado === 1) {
      mensajeventadia = <Alert severity="success">Hay ventas!</Alert>
    } else if(this.state.estado === 2) {
      mensajeventadia = <Alert severity="error">No se encontraron ventas :(</Alert>
    }else if(this.state.estado === 3) {
      mensajeventadia = <Alert severity="success">La venta se eliminó correctamente</Alert>
    }else if(this.state.estado === 4) {
      mensajeventadia = <Alert severity="error">Lo sentimos, hubo un error, vuelva a intentarlo</Alert>
    }

    if(this.state.ready === true){
      let nombresucursal;
        if(this.state.perfil.sucursal === '0') { nombresucursal = 'Lo Castillo'}
        if(this.state.perfil.sucursal === '1') { nombresucursal = 'Apumanque'}
        if(this.state.perfil.sucursal === '2') { nombresucursal = 'Vitacura'}
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
                                        { title: 'Vigencia', field: 'anular' , lookup: { true: 'Anulada', false: 'Vigente'}},
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
                                      { title: 'Vigencia', field: 'anular' , lookup: { true: 'Anulada', false: 'Vigente'}},
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
              </TabPanel>
              <TabPanel value={this.state.tabIndex} index={1}>
                <h4>Desde</h4>
                <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                <h4>Hasta</h4>
                <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                  Listo
                </Button>
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
                              { title: 'Vigencia', field: 'anular' , lookup: { true: 'Anulada', false: 'Vigente'}},
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
              </TabPanel>
            <Copyright/>
          </Card>
        </div>
      );
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
