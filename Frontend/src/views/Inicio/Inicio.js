import React from "react";
// react plugin for creating charts
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";



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

export default class Inicio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre : null
    }
  }

  componentDidMount() {
    this.getUsuario()
  }

  getUsuario = () => {
    let info = JSON.parse(localStorage.getItem('usuario'));
    this.setState({
      nombre : info.nombre
    })
  }

  render() {return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12} style={{display: 'flex',  justifyContent:'center', height: '100vh'}}>
        <Card profile style = {{width: 580, height: 400}}>
          <CardBody profile>
            <div style={{textAlign: 'center'}}>
              <h1>¡Bienvenido {this.state.nombre}!</h1>
              <h2>Ten un excelente día</h2>
              <h3>Recuerda entregar un buen servicio</h3>
            </div>
          </CardBody>
          <Copyright />
        </Card>
      </GridItem>
    </GridContainer>
  );
  }
}
