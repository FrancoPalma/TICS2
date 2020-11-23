import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Box from '@material-ui/core/Box';
import Card from "components/Card/Card.js";
import difference from 'lodash/difference';
import CardBody from "components/Card/CardBody.js";
import { Grid } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {  Transfer,
          Button,
          Tag,
          Table, DatePicker } from 'antd';

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
    dataIndex: 'numero_pedido',
    title: 'N° Pedido',
    render: numero_pedido => <Tag>{numero_pedido}</Tag>,
  },
  {
    dataIndex: 'cliente_nombre',
    title: 'Cliente',
  },
  {
    dataIndex: 'abono',
    title: 'Abono',
    render: abono => <Tag color="purple">{abono}</Tag>,
  },
  {
    dataIndex: 'total',
    title: 'Total',
    render: total => <Tag color="green">{total}</Tag>,
  },

];

const rightTableColumns = [
  {
    dataIndex: 'numero_pedido',
    title: 'N° Pedido',
    render: numero_pedido => <Tag>{numero_pedido}</Tag>,
  },
  {
    dataIndex: 'cliente_nombre',
    title: 'Cliente',
  },
  {
    dataIndex: 'abono',
    title: 'Abono',
    render: abono => <Tag color="purple">{abono}</Tag>,
  },
  {
    dataIndex: 'total',
    title: 'Total',
    render: total => <Tag color="green">{total}</Tag>,
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
      ListaPedidos: "",
      mensaje: null,
      numero_pedido: "",
      fecha: "",
      sucursal: null,
      descripcion: "",
      vendedor: "",
      cliente_nombre: "",
      cliente_telefono: "",
      estado: 0,
      suma: 0,
      abono: null,
      total:null,
      abono2:0,
      metodo_pago: null,
      priv_descuento :0,

    }
    this.handleChange = this.handleChange.bind(this)
    this.AgregarPedido = this.AgregarPedido.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.ActualizarPedidos = this.ActualizarPedidos.bind(this)
    this.onChange = this.onChange.bind(this)
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

  ActualizarPedidos() {
    fetch('/pedidos')
      .then(res => {
          return res.json()
      })
      .then(users => {
          this.setState({ListaPedidos: users, ready: true})
          this.getMock();
          console.log(this.state.ListaPedidos);
      });
    }

  AgregarPedido() {
    let regex = new RegExp("^[a-z A-Z]+$");
    if(regex.test(this.state.cliente)){
      fetch('/agregar_pedido', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cliente_nombre: this.state.cliente_nombre,
        cliente_telefono: this.state.cliente_telefono,
        descripcion: this.state.descripcion,
        estado: this.state.estado,
        total: this.state.total,
        sucursal: this.state.perfil.sucursal
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
      this.setState({mensaje: 2})
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
        cliente_nombre: newData.cliente,
        cliente_telefono: 1234,
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
      vendedor: info.rut,
      sucursal: info.sucursal,
      priv_descuento: info.descuento_permitido
    })
  }

  state = {
    mockData: [],
    filterMock: [],
    targetKeys: [],
  };

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < this.state.ListaPedidos.length; i++) {
      // codigo, tipo, material, piedra, descripcion, precio
      if (this.state.ListaPedidos[i].abono < this.state.ListaPedidos[i].total){
        const data = {
          key: this.state.ListaPedidos[i],
          numero_pedido: `${this.state.ListaPedidos[i].numero_pedido}`,
          cliente_nombre: `${this.state.ListaPedidos[i].cliente_nombre}`,
          abono: `${this.state.ListaPedidos[i].abono}`,
          total: `${this.state.ListaPedidos[i].total}`,
        };
        if (data.chosen) {
          targetKeys.push(data.key);
        }
        mockData.push(data);
      }
    }

    const filterMock = mockData;
    console.log(mockData)
    console.log("Este es")
    console.log(filterMock)
    this.setState({ filterMock, targetKeys });
  };

  componentDidMount() {
    this.getUsuario()
    this.ActualizarPedidos()
    console.log(this.state.ListaPedidos)
  }

  CalcularTotal = () => {
    let tot = 0;
    for(let i = 0; i<this.state.targetKeys.length;i++) {
      tot = tot + this.state.targetKeys[i].total - this.state.targetKeys[i].abono ;
    }
    let resultado = Math.trunc(tot*(1-(this.state.descuento/100)));
    this.setState({total:resultado})
    this.setState({suma:tot})
  }

  imprimir = () => {
      fetch('/pagar_pedido', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedido: this.state.targetKeys[0],
          metodo_pago: this.state.metodo_pago,
          vendedor: this.state.vendedor,
          abono: this.state.abono2,
          empleadolog: this.state.perfil.rut,
        })
        })
        .then( (response) => {
            if(response.status === 201) {
                console.log("Añadido correctamente")
                this.setState({mensaje: 7})
                this.ActualizarInventario()

            } else if(response.status === 405){
              this.setState({mensaje: 2})
            }else {
                console.log('Hubo un error')
                this.setState({mensaje: 2})
            }
        })
        .catch((error) => {
            console.log(error)
        });
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

  actualizarTexto(event, id, value) {
    this.setState({id: value});
  }

  handleChange2(event, newValue) {
    this.setState({tabIndex: newValue, mensaje:null});
    this.ActualizarPedidos();

  }
  onChange(date, dateString) {
    this.setState({fecha: dateString});
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
    }else if(this.state.mensaje === 99){
      mensajito = <Alert severity="success">agregando</Alert>
    }else if(this.state.mensaje === 7) {
      mensajito = <Alert severity="success">Ha abonado!</Alert>
    }

    if(this.state.ready === true) {
      let nombresucursal;
        if(this.state.perfil.sucursal === '0') { nombresucursal = 'Lo Castillo'}
        if(this.state.perfil.sucursal === '1') { nombresucursal = 'Apumanque'}
        if(this.state.perfil.sucursal === '2') { nombresucursal = 'Vitacura'}
      return (
        <div style={styles.root}>
          <Card>
            <AppBar position="static" color="primary" style={styles.Barrita}>
              <Tabs value={this.state.tabIndex} onChange={this.handleChange2} aria-label="simple tabs example">
                <Tab label="Realizar Pedido" {...a11yProps(0)} />
                <Tab label="Pago de Pedido" {...a11yProps(1)} />
                <Tab label="Lista de Pedidos" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={this.state.tabIndex} index={0}>
              <Grid
              container
              direction="row"
              justify="left"
              alignItems="baseline"
              spacing={1}>
                <Grid item xs={4}>
                  <TextField id="standard-basic" value={this.state.descripcion} label="Descripción" onChange={this.handleInputChange('descripcion')}/>
                </Grid>
                <Grid item xs={4}>
                  <TextField id="standard-basic" value={this.state.cliente_nombre} label="Cliente" onChange={this.handleInputChange('cliente_nombre')}/>
                </Grid>
                <Grid item xs={4}>
                  <TextField id="standard-basic" value={this.state.vendedor} defaultvalue={this.state.perfil.rut} label="Rut del vendedor" onChange={this.handleInputChange('vendedor')}/>
                </Grid>

                <Grid item xs={4}>
                  <TextField id="standard-basic" value={this.state.cliente_telefono} label="Telefono de Cliente" onChange={this.handleInputChange('cliente_telefono')}/>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  label="Estado"
                  value={this.state.estado}
                  onChange={this.handleInputChange('estado')}
                  helperText="Selecciona el estado del pedido"
                >
                  <MenuItem key={0} value={0}>{'EN PROCESO'}</MenuItem>
                  <MenuItem key={1} value={1}>{'LISTO PARA RETIRO'}</MenuItem>
                  <MenuItem key={2} value={2}>{'ENTREGADO'}</MenuItem>
                </TextField>
              </Grid>
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
              <Button style={{ float: 'right', margin: 15 }} onClick={this.AgregarPedido}>
                Finalizar pedido
              </Button>

            </TabPanel>
            <TabPanel value={this.state.tabIndex} index={1}>
              <TableTransfer
                dataSource={this.state.filterMock}
                showSearch

                operations={['Incluir', 'Descartar']}
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange} // codigo tipo, material, piedra, precio
                filterOption={(inputValue, item) =>
                  item.numero_pedido.indexOf(inputValue) !== -1 || item.cliente_nombre.indexOf(inputValue.toUpperCase()) !== -1 || item.abono.indexOf(inputValue.toUpperCase()) !== -1 || item.total.indexOf(inputValue.toUpperCase()) !== -1
                }
                leftColumns={leftTableColumns}
                rightColumns={rightTableColumns}
              />
              <Grid
              container
              direction="row"
              justify="center"
              alignItems="baseline"
              spacing={1}>
                <Grid item xs={6}>
                  <h4>
                  Total a pagar: ${this.state.suma}{"\n"} <br />
                  </h4>
                </Grid>
                <Grid item xs={6}>
                  <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="baseline"
                  spacing={1}>
                    <Grid item xs={6}>
                      <TextField id="standard-basic" value={this.state.abono2} type="number" label="Abono" onChange={this.handleInputChange('abono2')}/>
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
                    <Grid item xs={6}>
                      <TextField id="standard-basic" value={this.state.vendedor} defaultvalue={this.state.perfil.rut} label="Rut del vendedor" onChange={this.handleInputChange('vendedor')}/>
                    </Grid>
                  </Grid>
                  <Button style={{ float: 'right', margin: 5 }} onClick={this.imprimir}>
                    Abonar
                  </Button>
                  {mensajito}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={this.state.tabIndex} index={2}>
              <CardBody>
                <MaterialTable
                  title= {nombresucursal}
                  columns={ [{ title: 'N° Pedido', field: 'numero_pedido' ,type: 'numeric'},
                            { title: 'Fecha', field: 'fecha', type: 'date' },
                            { title: 'Cliente', field: 'cliente_nombre' },
                            { title: 'Telefono Cliente', field: 'cliente_telefono' },
                            { title: 'Descripcion', field: 'descripcion'},
                            { title: 'Estado', field: 'estado', lookup: { 0: 'EN PROCESO', 1: 'LISTO PARA RETIRO' ,2: 'ENTREGADO'}},
                            { title: 'Abono', field: 'abono' ,type: 'numeric'},
                            { title: 'Total', field: 'total' ,type: 'numeric'}]}
                  data={this.state.ListaPedidos.filter(({sucursal}) => sucursal === this.state.perfil.sucursal)}
                  editable={{
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
                </TabPanel>
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
