import React from "react";
// react plugin for creating charts
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";

const styles = {
  successText: {
    color: successColor[0]
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};


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
        </Card>
      </GridItem>
    </GridContainer>
  );
  }
}
