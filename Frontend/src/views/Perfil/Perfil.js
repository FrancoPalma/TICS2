import React from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import Alert from '@material-ui/lab/Alert';
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import avatar from "assets/img/faces/user.png";

export default class UserProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      perfil: null,
      estado : null,
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
   const {  value } = evento.target;
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
     fetch('/editar_password/'+this.state.perfil._id, {
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
             this.setState({estado: 1, new_pass: "", conf_pass:"",pass:""})
         } else {
             console.log('Hubo un error')
             this.setState({estado: 2})
         }
     })
     .catch((error) => {
         console.log(error)
     });
   }else{
     console.log("Las pss no son iguales")
     this.setState({estado: 3})
   }
 }

  render() {
    let mensaje;

    if(this.state.estado === 1) {
      mensaje = <Alert severity="success">Contraseña cambiada.</Alert>
    }else if(this.state.estado === 2){
      mensaje = <Alert severity="error">Hubo un error.</Alert>
    }else if(this.state.estado === 3){
      mensaje = <Alert severity="error">Confirmación de contraseña invalida.</Alert>
    }
    if(this.state.isReady === true) {
      return (
        <GridContainer>
          <GridItem xs={6} sm={6} md={6} style={{display: 'flex', margin:'100', justifyContent:'center', height: '65vh'}}>
            <Card profile style = {{width: 450, height: 350}}>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile >
                <h1 style={{fontWeight: 'bold'}}>{this.state.perfil.nombre}</h1>
                <div style={{textAlign: 'left'}}>
                  <p>RUT: {this.state.perfil.rut}</p>
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
            </GridItem>
            <GridItem xs={6} sm={6} md={6} style={{display: 'flex', margin:'100', justifyContent:'center', height: '65vh'}}>
            <Card profile style = {{width: 450, height:300 ,margin: "10", fontSize: "14px", marginTop: "",}}>
              <Typography component="h1" variant="h5">
                Cambio de Contraseña
              </Typography>
              <TextField id="standard-basic" value={this.state.pass} type ="password" label="  Contraseña actual" onChange={this.handleInputChange('pass')}/>
              {"\n"} <br />
              <TextField id="standard-basic" value={this.state.new_pass} type ="password" label="  Contraseña nueva" onChange={this.handleInputChange('new_pass')}/>
              {"\n"} <br />
              <TextField id="standard-basic" value={this.state.conf_pass} type ="password" label="  Confirmar contraseña" onChange={this.handleInputChange('conf_pass')}/>
              {"\n"} <br />
                <Button
                  halfWidth
                  variant="contained"
                  color="primary"
                  onClick={this.CambioPassword}
                >
                  Cambiar Contraseña
                </Button>
                {mensaje}
            </Card>
          </GridItem>
        </GridContainer>
      );
    } else if(this.state.isReady === false) {
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
