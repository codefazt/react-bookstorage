import React, { Component } from 'react';
import '../css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import logo from '../LoginBook.jpg';

const baseUrl="http://localhost:3001/usuarios";
const cookies = new Cookies();

class Login extends Component {
    
    state={
        form:{
            username: '',
            password: ''
        }
    }

    handleChange=async e=>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    iniciarSesion=async()=>{
        await axios.get(baseUrl, {params: {username: this.state.form.username, password: md5(this.state.form.password)}})
        .then(response=>{
            return response.data;
        })
        .then(response=>{
            if(response.length>0){
                var respuesta=response[0];
                cookies.set('id', respuesta.id, {path: "/"});
                cookies.set('apellido_paterno', respuesta.apellido_paterno, {path: "/"});
                cookies.set('apellido_materno', respuesta.apellido_materno, {path: "/"});
                cookies.set('nombre', respuesta.nombre, {path: "/"});
                cookies.set('username', respuesta.username, {path: "/"});
                alert(`Bienvenido ${respuesta.nombre} ${respuesta.apellido_paterno}`);
                window.location.href="./menu";
            }else{
                alert('El usuario o la contraseña no son correctos');
            }
        })
        .catch(error=>{
            console.log(error);
        })

    }

    componentDidMount() {
        if(cookies.get('username')){
            window.location.href="./menu";
        }
    }
    
    iniciarSesionExterna=async()=>{
        await axios.put('https://dev.tuten.cl:443/TutenREST/rest/user/'+ this.state.form.username,{}, {
            headers: {
                password: this.state.form.password,
                app: 'APP_BCK',
                Accept: 'application/json',      
            }
        }).then(response=>{
            console.log("response")
            console.log(response)
            return response.data;

        }).then(res => {
            console.log("res")
            console.log(res)
            cookies.set('res', res, {path: "/"});
            cookies.set('username', this.state.form.username, {path: "/"});
            window.location.href='./menu';
        
        }).catch(error=> console.log(error))
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8">
                            <img src={logo} className="img-fluid" alt="logo" />
                        </div>
                        <div className="col-lg-4 mb-5">
                            <div className="card mt-5">
                                <div className="card-body mb-5 mt-5">
                                    
                                    <h3 class="card-title mb-5 text-center"><b>Login</b></h3>

                                    <div className="form-group">
                                        <label>Usuario: </label>
                                        <br />
                                        <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        onChange={this.handleChange}
                                        />
                                        <br />
                                        <label>Contraseña: </label>
                                        <br />
                                        <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        onChange={this.handleChange}
                                        />
                                        <br />
                                        <button className="btn btn-dark btn-block" onClick={()=> this.iniciarSesionExterna()}>Iniciar Sesión</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
        );
    }
}

export default Login;