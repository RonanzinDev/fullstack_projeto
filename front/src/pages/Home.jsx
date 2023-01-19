import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
} from 'reactstrap';
import './style.css';
import Cookies from 'js-cookie';
const HomePage = () => {
    const [nameUser, setNameUser] = useState('');
    
    const logout = () => {
        //localStorage.setItem('token', '');
        Cookies.set("token", "")
        window.location.pathname = '/';
    }

    const getData = async () => {
        //let token = localStorage.getItem('token');
        let  token = Cookies.get("token")
        await fetch("http://127.0.0.1:8000/api/user", {
            headers: {
                "Authorization": `bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(!data.detail) {
                setNameUser(data.user.name);
            } else {
                logout();
            }
        })
    };

    useEffect(()=> {
        getData();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <h2>Olá {nameUser}</h2>
            <div className="d-flex flex-column w-100 align-items-center mt-5">
                <Link to={'/edit'} state={{flagEdit: true}} className="w-25">
                    <Button className="bg-primary border-0 w-100 m-3 p-3">Editar</Button>
                </Link>
                <Link to={'/'} state={{flagEdit: true}} className="w-25">
                    <Button className="bg-danger border-0 w-100 m-3 p-3" onClick={logout}>Deslogar</Button>  
                </Link>
            </div>
        </div>
    );
}

export default HomePage;