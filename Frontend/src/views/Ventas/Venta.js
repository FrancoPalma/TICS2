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
      metodo_pago: 'efectivo',
      vendedor: '',
      sucursal: '0',
      total: 0,
      suma: 0,
      indexMetodo: 0,
      indexSucursal: 0,
      completado: 0,
      perfil: null,
      priv_dios: true,
      priv_descuento: 5,
      ListaVentasDia: null,
      total0: 0,
      total1: 0,
      total2: 0,
      estado:null,
      estadosucursal:null,
    }
    this.handleChange = this.handleChange.bind(this)
    this.ActualizarInventario = this.ActualizarInventario.bind(this)
    this.ActualizarVentasDia = this.ActualizarVentasDia.bind(this)
    this.CalcularTotal = this.CalcularTotal.bind(this)
    this.CalcularTotal2 = this.CalcularTotal2.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.ActualizarVentasPeriodo = this.ActualizarVentasPeriodo.bind(this)
    this.CalcularTotal3 = this.CalcularTotal3.bind(this)
  }
  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      vendedor: info.nombre,
      sucursal: info.sucursal
    })
    console.log(info.sucursal)
  }

  ActualizarVentasPeriodo() {
    fetch('/ventasperiodo', {
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
        this.CalcularTotal3()
    });
  }

  ActualizarVentasDia() {
  fetch('/ventasdia')
    .then(res => {
        return res.json()
    })
    .then(users => {
        this.setState({ListaVentasDia: users, ready: true})
        console.log(this.state.ready);
        this.CalcularTotal2()
    });
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
    this.ActualizarVentasPeriodo();
    this.Venta();
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

  CalcularTotal(){
    let tot0 = 0;
    let tot1 = 0;
    let tot2 = 0;
    for(let i = 0; i<this.state.ListaVentasPeriodo.length;i++) {
      if(this.state.ListaVentasPeriodo[i].sucursal === '0'){
        tot0 = tot0 + this.state.ListaVentasPeriodo[i].total;
        if(this.state.perfil.sucursal=== '0'){
          this.setState({estadosucursal:1})
        }
      }
      else if(this.state.ListaVentasPeriodo[i].sucursal === '1'){
        tot1 = tot1 + this.state.ListaVentasPeriodo[i].total;
        if(this.state.perfil.sucursal=== '1'){
          this.setState({estadosucursal:1})
        }
      }
      else if(this.state.ListaVentasPeriodo[i].sucursal === '2'){
        tot2 = tot2 + this.state.ListaVentasPeriodo[i].total;
        if(this.state.perfil.sucursal=== '2'){
          this.setState({estadosucursal:1})
        }
      }
    }
    if(this.state.ListaVentasPeriodo.length === 0){
      this.setState({estado: 2})
    }else{
      this.setState({estado: 1})
    }
    this.setState({totalp0:tot0})
    this.setState({totalp1:tot1})
    this.setState({totalp2:tot2})
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


  imprimir = () => {
    if(this.state.priv_descuento >= this.state.descuento && this.state.descuento >= 0){
      fetch('/crear_venta', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lista: this.state.targetKeys,
          metodo_pago: this.state.metodo_pago,
          descuento: this.state.descuento,
          sucursal: this.state.sucursal,
          vendedor: this.state.vendedor,
          total: this.state.total
        })
        })
        .then( (response) => {
            if(response.status === 201) {
                console.log("Añadido correctamente")
                this.setState({completado: 1})
                for(let i = 0; i<this.state.targetKeys.length;i++) {
                  this.EliminarProducto(this.state.targetKeys[i])
                  this.ActualizarInventario()
                }
            } else {
                console.log('Hubo un error')
                this.setState({completado: 2})
            }
        })
        .catch((error) => {
            console.log(error)
        });
    }else{
      console.log("No se mando, wena")
    }
  }
  render() {

    let mensajito;
    if(this.state.completado === 1) {
      mensajito = <Alert severity="success">Venta completada</Alert>
    } else if(this.state.completado === 2) {
      mensajito = <Alert severity="error">Hubo un error con la venta</Alert>
    }
    if(this.state.priv_descuento < this.state.descuento) {
      mensajito = <Alert severity="error">Excede el descuento maximo permitido.</Alert>
    }else if(this.state.descuento < 0){
      mensajito = <Alert severity="error">Valor invalido.</Alert>
    }

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

    if(this.state.ready === true){
      if(this.state.priv_dios === true){
        return (
          <div>
            <Card>
              <AppBar position="static" color="primary" style={styles.Barrita}>
                <Tabs value={this.state.tabIndex} onChange={this.handleChange2} aria-label="simple tabs example">
                  <Tab label="Realizar Venta" {...a11yProps(0)} />
                  <Tab label="Ventas Día" {...a11yProps(1)} />
                  <Tab label="Ventas por Periodo" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
              <CardBody>
                <TabPanel value={this.state.tabIndex} index={0}>
                  <TableTransfer
                    dataSource={this.state.filterMock}
                    showSearch

                    operations={['Incluir', 'Descartar']}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange} // codigo tipo, material, piedra, precio
                    filterOption={(inputValue, item) =>
                      item.codigo.indexOf(inputValue) !== -1 || item.tipo.indexOf(inputValue.toUpperCase()) !== -1 || item.material.indexOf(inputValue.toUpperCase()) !== -1 || item.piedra.indexOf(inputValue.toUpperCase()) !== -1 || item.precio.indexOf(inputValue) !== -1
                    }
                    leftColumns={leftTableColumns}
                    rightColumns={rightTableColumns}

                  />
                  <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={3}>
                    <Grid item xs={6}>
                      <h4>
                      Precio (sin dcto): ${this.state.suma}{"\n"} <br />
                      Precio final: ${this.state.total}
                      </h4>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      spacing={1}>
                        <Grid item xs={6}>
                          <TextField id="standard-basic" value={this.state.descuento} label="Descuento %" onChange={this.handleInputChange('descuento')}/>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            select
                            label="Metodo de pago"
                            value={this.state.metodo_pago}
                            onChange={this.handleInputChange('metodo_pago')}
                            helperText="Selecciona la forma de pagar"
                          >
                            <MenuItem key={'efectivo'} value={'efectivo'}>{'Efectivo'}</MenuItem>
                            <MenuItem key={'credito'} value={'credito'}>{'Credito'}</MenuItem>
                            <MenuItem key={'debito'} value={'debito'}>{'Debito'}</MenuItem>
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      spacing={1}>
                        <Grid item xs={6}>
                          <TextField id="standard-basic" value={this.state.vendedor} defaultvalue={this.state.perfil.nombre} label="Vendedor" onChange={this.handleInputChange('vendedor')}/>
                        </Grid>
                        <Grid item xs={6}>

                        </Grid>
                      </Grid>
                      <Button style={{ float: 'right', margin: 5 }} onClick={this.imprimir}>
                        Finalizar venta
                      </Button>
                      {mensajito}
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={this.state.tabIndex} index={1}>
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
                      </Grid>
                    </Grid>
                  </div>
                </TabPanel>
                <TabPanel value={this.state.tabIndex} index={2}>
                  <h4>Desde</h4>
                  <DatePicker onChange={this.onChange} format={"YYYY-MM-DD"} />
                  <h4>Hasta</h4>
                  <DatePicker onChange={this.onChange2} format={"YYYY-MM-DD"} />
                  <Button style={{margin: 5 }} onClick={this.ActualizarVentasPeriodo}>
                    Listo
                  </Button>
                  <MaterialTable
                      title='Tienda'
                      columns={ [{ title: 'Numero', field: 'numero_venta', type: 'numeric' },
                                { title: 'Descuento', field: 'descuento',type: 'numeric' },
                                { title: 'Fecha', field: 'fecha', type: 'date'},
                                { title: 'Pago', field: 'metodo_pago' ,type: 'numeric'},
                                { title: 'Total', field: 'total' ,type: 'numeric'},
                                { title: 'Vendedor', field: 'vendedor'} ]}
                      data={this.state.ListaVentasPeriodo.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                      editable={{
                          onRowDelete: (oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                              this.ActualizarVentasPeriodo();
                            }, 2000)
                            this.EliminarVenta(oldData)
                          }),
                        }}
                    />
                </TabPanel>
              </CardBody>
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
