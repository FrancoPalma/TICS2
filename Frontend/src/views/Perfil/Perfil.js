import React from "react";
// @material-ui/core components
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import avatar from "assets/img/faces/user.png";
import { makeStyles } from '@material-ui/core/styles';
const styles = makeStyles((theme) => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  form: {
    width: '75%', // Fix IE 11 issue.
    marginTop: theme.spacing(5),
    margin: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default class UserProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      perfil: null,
      isReady: false,
      pass: "",
      new_pass:"",
      conf_pass:""

    }
    this.CambioPassword = this.CambioPassword.bind(this)
  }

  getUsuario = () => {
    this.setState({
      perfil: JSON.parse(localStorage.getItem('usuario')),
      isReady: true
    })
  }

  componentDidMount() {
    this.getUsuario();

  }

  handleChangeInput(evento, newValue) {
   //destructurin de los valores enviados por el metodo onchange de cada input
   const { name, value } = evento.target;
   let regex = new RegExp("^[0-9 k]+$");

   if (regex.test(value) && value.length <10 && value.length >= 8 && (value.indexOf('k') === -1 || value.indexOf('k') === 8 || value.indexOf('k') === 9)) {
     this.setState({usuario: value});
     this.setState({estado: null})
   } else if(value.length <10 && regex.test(value)){
     this.setState({usuario: value});
     this.setState({estadorut: null})
     this.setState({estado: 3})
   }else if(value.length <10){
     this.setState({usuario: value});
   }
 }
 handleInputChange(property) {
   return e => {
     new Promise((resolve) => {
       this.setState({[property]: e.target.value});
     })
   };
 }

 CambioPassword(){
   if(this.state.new_pass === this.state.conf_pass){
     fetch('/editar_password', {
     method: 'POST',
     headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       rut: this.state.perfil.rut,
       new_pass: this.state.new_pass,
     })
     })
     .then( (response) => {
         if(response.status === 201) {
             console.log("Editado correctamente")
         } else {
             console.log('Hubo un error')
         }
     })
     .catch((error) => {
         console.log(error)
     });
   }else{
     console.log("Las pss no son iguales")
   }
 }

  render() {
    if(this.state.isReady === true) {
      return (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} style={{display: 'flex', margin:'100', justifyContent:'center', height: '65vh'}}>
            <Card profile style = {{width: 580, height: 400}}>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h1 style={{fontWeight: 'bold'}}>{this.state.perfil.nombre}</h1>
                <div style={{textAlign: 'left'}}>
                  <p>RUT: {this.state.perfil.rut}</p>
                  <p>Fecha nacimiento: {this.state.perfil.nacimiento}</p>
                  <p>Telefono: {this.state.perfil.telefono}</p>
                  {this.state.perfil.sucursal === '0' &&
                    <p>Sucursal: Lo Castillo</p>
                  }
                  {this.state.perfil.sucursal === '1' &&
                    <p>Sucursal: Apumanque</p>
                  }
                  {this.state.perfil.sucursal === '2' &&
                    <p>Sucursal: Vitacura</p>
                  }
                </div>
              </CardBody>
            </Card>
            <Card profile style = {{width: 400, height:250 ,margin: "0", fontSize: "14px", marginTop: "",}}>
              <Typography component="h1" variant="h5">
                Cambio de Contraseña
              </Typography>
              <TextField id="standard-basic" value={this.state.pass} type ="password" label="Contraseña actual" onChange={this.handleInputChange('pass')}/>
              <TextField id="standard-basic" value={this.state.new_pass} type ="password" label="Contraseña nueva" onChange={this.handleInputChange('new_pass')}/>
              <TextField id="standard-basic" value={this.state.conf_pass} type ="password" label="confirmar contraseña" onChange={this.handleInputChange('conf_pass')}/>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.CambioPassword}
                >
                  Cambiar Contraseña
                </Button>
            </Card>
          </GridItem>
        </GridContainer>
      );
    } else if(this.state.isReady == false) {
      return (
        <Card>
          <CardBody>
            <p> Espera por favor.</p>
          </CardBody>
        </Card>
      )
    }
  }
}
