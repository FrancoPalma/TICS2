/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";

const useStyles = makeStyles(styles);

export default function Icons() {
  const classes = useStyles();
  return (
    <GridContainer>

      <GridItem xs={12} sm={12} md={4}>
        <Card chart>
          <CardHeader color="success">
            <ChartistGraph
              className="ct-chart"
              data={dailySalesChart.data}
              type="Line"
              options={dailySalesChart.options}
              listener={dailySalesChart.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>Ventas semanales</h4>
            <p className={classes.cardCategory}>
              <span className={classes.successText}>
                <ArrowUpward className={classes.upArrowCardCategory} /> 55%
              </span>{" "}
              Incremento de hoy.
            </p>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              <AccessTime /> Actualizado hace 17 minutos
            </div>
          </CardFooter>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={12} md={4}>
        <Card chart>
          <CardHeader color="warning">
            <ChartistGraph
              className="ct-chart"
              data={emailsSubscriptionChart.data}
              type="Bar"
              options={emailsSubscriptionChart.options}
              responsiveOptions={emailsSubscriptionChart.responsiveOptions}
              listener={emailsSubscriptionChart.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>Ventas mensuales</h4>
            <p className={classes.cardCategory}>asd</p>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              <AccessTime /> Actualizado hace 2 dias
            </div>
          </CardFooter>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={12} md={4}>
        <Card chart>
          <CardHeader color="danger">
            <ChartistGraph
              className="ct-chart"
              data={completedTasksChart.data}
              type="Line"
              options={completedTasksChart.options}
              listener={completedTasksChart.animation}
            />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>Ventas diarias</h4>
            <p className={classes.cardCategory}>asd</p>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              <AccessTime />Actualizado hace 5 minutos
            </div>
          </CardFooter>
        </Card>
      </GridItem>

    </GridContainer>

  );
}
/*<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6661.681712593749!2d-70.5933666!3d-33.4013159!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf36c2bbc915%3A0x91ccfad3b405c76a!2sCentro%20Comercial%20Lo%20Castillo!5e0!3m2!1ses!2scl!4v1589416978616!5m2!1ses!2scl" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>*/
