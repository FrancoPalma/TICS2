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
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Centro Comercial Plaza Lo Castillo</h4>
            <p className={classes.cardCategoryWhite}>
              Para acceder al mapa haz click{" "}
              <a
                href="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6661.681712593749!2d-70.5933666!3d-33.4013159!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf36c2bbc915%3A0x91ccfad3b405c76a!2sCentro%20Comercial%20Lo%20Castillo!5e0!3m2!1ses!2scl!4v1589416978616!5m2!1ses!2scl"
                target="_blank"
              >
                aquí.
              </a>
            </p>
          </CardHeader>
          <CardBody>
            <Hidden only={["sm", "xs"]}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6661.681712593749!2d-70.5933666!3d-33.4013159!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf36c2bbc915%3A0x91ccfad3b405c76a!2sCentro%20Comercial%20Lo%20Castillo!5e0!3m2!1ses!2scl!4v1589416978616!5m2!1ses!2scl"
                title="Icons iframe"
                width="100%"
                height="326.25"
                frameborder="0"
              >
                <p>Su buscador no es compatible con el mapa.</p>
              </iframe>
            </Hidden>
           <Hidden only={["lg", "md"]}>
           <iframe
             src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6661.681712593749!2d-70.5933666!3d-33.4013159!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf36c2bbc915%3A0x91ccfad3b405c76a!2sCentro%20Comercial%20Lo%20Castillo!5e0!3m2!1ses!2scl!4v1589416978616!5m2!1ses!2scl"
             title="Icons iframe"
             width="100%"
             height="200"
             frameborder="0"
           >
             <p>Su buscador no es compatible con el mapa.</p>
           </iframe>
            </Hidden>
            <h4>Candelaria Goyenechea N° 3820</h4>
            <h4>Locales N° 30 – 31</h4>
            <h4>Fono: 222 445 621 – Vitacura</h4>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Pueblo Del Ingles</h4>
            <p className={classes.cardCategoryWhite}>
              Para acceder al mapa haz click{" "}
              <a
                href="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3331.212540306897!2d-70.5721996!3d-33.3916188!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x954f8372e94db863!2sCentro%20Comercial%20Pueblo%20del%20Ingl%C3%A9s!5e0!3m2!1ses!2scl!4v1589666931623!5m2!1ses!2scl"
                target="_blank"
              >
                aquí.
              </a>
            </p>
          </CardHeader>
          <CardBody>
            <Hidden only={["sm", "xs"]}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3331.212540306897!2d-70.5721996!3d-33.3916188!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x954f8372e94db863!2sCentro%20Comercial%20Pueblo%20del%20Ingl%C3%A9s!5e0!3m2!1ses!2scl!4v1589666931623!5m2!1ses!2scl"
                title="Icons iframe"
                width="100%"
                height="326.25"
                frameborder="0"
              >
                <p>Su buscador no es compatible con el mapa.</p>
              </iframe>
            </Hidden>
           <Hidden only={["lg", "md"]}>
           <iframe
             src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3331.212540306897!2d-70.5721996!3d-33.3916188!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x954f8372e94db863!2sCentro%20Comercial%20Pueblo%20del%20Ingl%C3%A9s!5e0!3m2!1ses!2scl!4v1589666931623!5m2!1ses!2scl"
             title="Icons iframe"
             width="100%"
             height="200"
             frameborder="0"
           >
             <p>Su buscador no es compatible con el mapa.</p>
           </iframe>
            </Hidden>
            <h4>Av. Vitacura 6255</h4>
            <h4>Local 89</h4>
            <h4>Teléfono: +56 9 9545 8353</h4>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Centro Comercial Apumanque</h4>
            <p className={classes.cardCategoryWhite}>
              Para acceder al mapa haz click{" "}
              <a
                href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.5063744951135!2d-70.56976098480176!3d-33.41004028078553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cedde4485d87%3A0x7ce640d67d70fa10!2sApumanque!5e0!3m2!1ses!2scl!4v1589667519610!5m2!1ses!2scl"
                target="_blank"
              >
                aquí.
              </a>
            </p>
          </CardHeader>
          <CardBody>
            <Hidden only={["sm", "xs"]}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.5063744951135!2d-70.56976098480176!3d-33.41004028078553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cedde4485d87%3A0x7ce640d67d70fa10!2sApumanque!5e0!3m2!1ses!2scl!4v1589667519610!5m2!1ses!2scl"
                title="Icons iframe"
                width="100%"
                height="326.25"
                frameborder="0"
              >
                <p>Su buscador no es compatible con el mapa.</p>
              </iframe>
            </Hidden>
           <Hidden only={["lg", "md"]}>
           <iframe
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.5063744951135!2d-70.56976098480176!3d-33.41004028078553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cedde4485d87%3A0x7ce640d67d70fa10!2sApumanque!5e0!3m2!1ses!2scl!4v1589667519610!5m2!1ses!2scl"
             title="Icons iframe"
             width="100%"
             height="200"
             frameborder="0"
           >
             <p>Su buscador no es compatible con el mapa.</p>
           </iframe>
            </Hidden>
            <h4>Av. Manquehue Sur  N° 31, Las Condes</h4>
            <h4>Local N° 464</h4>
            <h4>Celular: +56 9 7869 8470</h4>
          </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}
/*<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6661.681712593749!2d-70.5933666!3d-33.4013159!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf36c2bbc915%3A0x91ccfad3b405c76a!2sCentro%20Comercial%20Lo%20Castillo!5e0!3m2!1ses!2scl!4v1589416978616!5m2!1ses!2scl" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>*/
