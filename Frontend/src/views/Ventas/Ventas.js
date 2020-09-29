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
          Table } from 'antd';
import difference from 'lodash/difference';
import { Grid } from '@material-ui/core';

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

export default class Ventas extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      ListaProductos: "",
      descuento: '',
      metodo_pago: 'efectivo',
      vendedor: '',
      sucursal: '0',
      total: 0,
      suma: 0,
      indexMetodo: 0,
      indexSucursal: 0,
      completado: 0,
      perfil: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.ActualizarInventario = this.ActualizarInventario.bind(this)
  }
  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      perfil: info,
      vendedor: info.nombre,
      sucursal: info.sucursal
    })
  }

  ActualizarInventario() {
    fetch('/productos')
      .then(res => {
          console.log(res);
          return res.json()
      })
      .then(users => {
        console.log(users)
          this.setState({ListaProductos: users, ready: true})
          this.getMock();
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

  CalcularTotal = () => {
    let tot = 0;
    for(let i = 0; i<this.state.targetKeys.length;i++) {
      tot = tot + this.state.targetKeys[i].precio;
    }
    let resultado = Math.trunc(tot*(1-(this.state.descuento/100)));
    this.setState({total:resultado})
    this.setState({suma:tot})
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


  }
  render() {

    let mensajito;
    if(this.state.completado === 1) {
      mensajito = <Alert severity="success">Venta completada</Alert>
    } else if(this.state.completado === 2) {
      mensajito = <Alert severity="error">Hubo un error con la venta</Alert>
    }
    if(this.state.ready === true){
      if(this.state.perfil.rol === 'duena'){
        return (
          <div>
            <Card>
              <CardHeader color="primary">
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  spacing={1}>
                  <Grid item xs={2}>
                    <h4 style={{ color: "#FFFFFF",marginTop: "0px",minHeight: "auto",fontWeight: "300",fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",marginBottom: "3px",textDecoration: "none"}}>Seleccione los articulos</h4>
                  </Grid>
                  <Grid item xs={2}>

                  </Grid>
                </Grid>
              </CardHeader>
              <CardBody>
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
                  footer={this.renderFooter}

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
                        <TextField id="standard-basic" value={this.state.vendedor} label="Vendedor" defaultValue={this.state.perfil.nombre} onChange={this.handleInputChange('vendedor')}/>
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
              </CardBody>
            </Card>
          </div>
        );
      }else{
        return (
          <div>
            <Card>
              <CardHeader color="primary">
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  spacing={1}>
                  <Grid item xs={2}>
                    <h4 style={{ color: "#FFFFFF",marginTop: "0px",minHeight: "auto",fontWeight: "300",fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",marginBottom: "3px",textDecoration: "none"}}>Seleccione los articulos</h4>
                  </Grid>
                  <Grid item xs={2}>

                  </Grid>
                </Grid>
              </CardHeader>
              <CardBody>
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
