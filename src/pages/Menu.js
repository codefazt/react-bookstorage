import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Moment from 'moment';



const cookies = new Cookies();
const style = {
    width : ""
}

class Menu extends Component {
    state={
        respuesta: null,
        dataInicial: null,
        form:{
            buscar: ''
        }
    }

    cerrarSesion=()=>{
        cookies.remove('id', {path: "/"});
        cookies.remove('apellido_paterno', {path: "/"});
        cookies.remove('apellido_materno', {path: "/"});
        cookies.remove('nombre', {path: "/"});
        cookies.remove('username', {path: "/"});
        window.location.href='./';
    }

    componentDidMount=async()=>{
        if(!cookies.get('username')){
            window.location.href="./";
        }

        let data = await this.getBookings()
        this.setState({
            respuesta: data,
            dataInicial: data
        });

        console.log(this.state.respuesta)
    }

    getBookings=async()=>{
        let respuesta = cookies.get('res')
        //this.handleChange()
        let data = await axios.get("https://dev.tuten.cl:443/TutenREST/rest/user/contacto@tuten.cl/bookings?current=true", {
            headers: {
                token: respuesta.sessionTokenBck,
                app: 'APP_BCK',
                Accept: 'application/json',  
                adminemail: 'testapis@tuten.cl'    
            }
        })
        .then(response=>{
            return response.data;
        })
        .then(response=>{
            return response
        })
        .catch(error=>{
            console.log(error);
        })

        return data
    }

    handleChange=async e=>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });

        console.log(this.state.form.buscar)
        let dataFiltrada = this.state.dataInicial.filter((fila) => {

            let haveFilter = false
            //!fila.search('e')
            if(fila.bookingPrice != null){
                if(!fila.bookingPrice.toString().search(this.state.form.buscar)) haveFilter = true
            }

            if(fila.bookingId != null){
                if(!fila.bookingId.toString().search(this.state.form.buscar)) haveFilter = true
            }

            return haveFilter
        })

        console.log("Respuesta definitiva")
        console.log(dataFiltrada)

        if(this.state.form.buscar !== null && this.state.form.buscar !== ''){
            this.setState({
                respuesta: dataFiltrada
            })
        
        }else{
            this.setState({
                respuesta: this.state.dataInicial
            })
        }

    }
    render() {
        Moment.locale('en');
        return (
            <div>
                
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="card" style={style}>
                                <div className="card-body">
                                    <h5 className="card-title">Swagger UI</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Tabla de Bookings</h6>
                                    <br/>
                                    <div className="row">
                                        <div className="col-md-8"></div>
                                        <div className="col-md-4">
                                            <div className="input-group mb-3">
                                                <span className="input-group-text" id="basic-addon1">@</span>
                                                <input onChange={this.handleChange} type="text" className="form-control" name="buscar" placeholder="Buscar" aria-label="Buscar" aria-describedby="basic-addon1"/>
                                            </div>
                                        </div>
                                    </div>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                            <th scope="col">BookingId</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Fecha de Creación</th>
                                            <th scope="col">Dirección</th>
                                            <th scope="col">Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        {this.state.respuesta != null ? this.state.respuesta.map((data,i) => {
                                            return (<tr key={i}>
                                                <td>{data.bookingId}</td>
                                                <td>{data.tutenUserClient.firstName + ' ' + data.tutenUserClient.lastName}</td>
                                                <td>{Moment(data.bookingTime).format('d/MM/YYYY')}</td>
                                                <td>{data.locationId.streetAddress}</td>
                                                <td>{data.bookingPrice}</td>
                                            </tr>)
                                        }): 'No hay lista'}

                                        </tbody>
                                    </table>
                                    <button className="btn btn-primary" onClick={()=>this.cerrarSesion()}>Cerrar Sesión</button>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Menu;