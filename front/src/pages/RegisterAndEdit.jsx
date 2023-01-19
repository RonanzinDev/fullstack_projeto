
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Form,
    Row,
    Col,
    FormGroup,
    FormFeedback,
    Label,
    Input,
    Button,
} from 'reactstrap';
import './style.css';
import Cookies from 'js-cookie';
const RegisterAndEditPage = () => {
    const countryOptions = ['Brasil', 'Estados Unidos'];
    const stateOptions = [
        {linked: 'Brasil', states: ['Espírito Santo', 'São Paulo']}, 
        {linked: 'Estados Unidos', states:['Flórida', 'Texas']}
    ];
    const municipalOptions = [
        {linked: 'Espírito Santo', municipals:['Vila Velha', 'Vitória']},
        {linked: 'São Paulo', municipals:['São Paulo', 'Santos']},
        {linked: 'Flórida', municipals:['Miami', 'Tampa']},
        {linked: 'Texas', municipals:['Austin', 'Dallas']},
    ];

    const [ID, setID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedMunicipal, setSelectedMunicipal] = useState('');
    const [cep, setCEP] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [cpf, setCpf] = useState('');
    const [pis, setPis] = useState('');
    const [flagEmailValid, setFlagEmailValid] = useState(false);
    const [flagCPFValid, setFlagCPFValid] = useState(false);
    const [nameState, setNameState] = useState(false);
    const [passwordState, setPasswordState] = useState(false);
    const [numberState, setNumberState] = useState(false);
    const [countryState, setCountryState] = useState(false);
    const [stateState, setStateState] = useState(false);
    const [municiapalState, setMunicipalState] = useState(false);
    const [cepState, setCepState] = useState(false);
    const [streetState, setStreetState] = useState(false);
    const [complementState, setComplementState] = useState(false);
    const [pisState, setPisState] = useState(false);

    const location = useLocation();
    const { flagEdit } = location.state ? location.state : false;

    
    const validateEmail = (value) => {
        if(value === '') return false;

        let user = value.substring(0, value.indexOf("@"));
        let domain = value.substring(value.indexOf("@")+ 1, value.length);
        if ((user.length >= 1) &&
            (domain.length >= 3) &&
            (user.search("@") == -1) &&
            (domain.search("@") ==- 1) &&
            (user.search(" ") == -1) &&
            (domain.search(" ") == -1) &&
            (domain.search(".") != -1) &&
            (domain.indexOf(".") >=1)&&
            (domain.lastIndexOf(".") < domain.length - 1)) {
            return true
        }
        else{
            return false
        }
    }

    const validateCPF = (strCPF) => {

        if(strCPF === '') return false;

        let sum;
        let rest;
        sum = 0;
        strCPF = strCPF.replace(/[.-]/g, '');


        if (strCPF == "00000000000") return false;
        
        for (let i=1; i<=9; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (11 - i);
        rest = (sum * 10) % 11;
        
        if ((rest == 10) || (rest == 11))  rest = 0;
        if (rest != parseInt(strCPF.substring(9, 10)) ) return false;
        
        sum = 0;
        for (let i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        rest = (sum * 10) % 11;
    
        if ((rest == 10) || (rest == 11))  rest = 0;
        if (rest != parseInt(strCPF.substring(10, 11) ) ) return false;
        return true;
    };

    const onlynumber = (evt) => {
        let theEvent = evt || window.event;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode( key );
        let regex = /^[0-9.]+$/;
        if( !regex.test(key) ) {
           theEvent.returnValue = false;
           if(theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    const validateForm = () => {
        setNameState(name != '' ? false : true);
        setPasswordState(password != '' ? false : true);
        setCountryState(selectedCountry != '' ? false : true);
        setStateState(selectedState != '' ? false : true);
        setMunicipalState(selectedMunicipal != '' ? false : true);
        setCepState(cep != '' ? false : true);
        setStreetState(street != '' ? false : true);
        setNumberState(number != '' || number >= 0 ? false : true);
        setComplementState(complement != '' ? false : true);
        setPisState(pis != '' ? false : true);
        setFlagCPFValid(!validateCPF(cpf));
        setFlagEmailValid(!validateEmail(email));
    }

    const registerUser = async () => {
        validateForm();

        let validate = name != '' && password != '' && selectedCountry != ''
        && selectedState != '' && selectedMunicipal != '' && cep != '' && street != ''
        && (number != '' || number >= 0) && complement != '' && pis != '' && email != '' && cpf != '';
        
        if(validate) {
            let body = {
                email: email,
                name: name,
                cpf: cpf.replace(/[.-]/g, ''),
                pis: pis,
                address: {
                  pais: selectedCountry,
                  estado: selectedState,
                  municipio: selectedMunicipal,
                  cep: cep.replace('-', ''),
                  rua: street,
                  numero: number,
                  complemento: complement
                },
                password: password,
            }
            
            await fetch("http://127.0.0.1:8000/api/register", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(body)
            })
            .then(() => {
                window.location.pathname = '/';
            })
            .catch(e => console.log(e));
        }
    }

    const logout = () => {
        //localStorage.setItem('token', '');
        Cookies.set('token', '')
        window.location.pathname = '/';
    };

    const getData = async () => {
        //let token = localStorage.getItem('token');
        let token = Cookies.get("token")
        await fetch("http://127.0.0.1:8000/api/user", {
            headers: {
                "Authorization": `bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(!data.detail) {
                setID(data.user.id)
                setName(data.user.name);
                setEmail(data.user.email);
                setSelectedCountry(data.address.pais);
                setSelectedState(data.address.estado);
                setSelectedMunicipal(data.address.municipio);
                setCEP(data.address.cep.match(/.{1,5}/g).join("-"));
                setStreet(data.address.rua);
                setNumber(data.address.numero);
                setComplement(data.address.complemento);
                setCpf(data.user.cpf.match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/,"-"));
                setPis(data.user.pis);
                console.log(data)
            } else {
                logout();
            }
        })
    };

    const deleteAccount = async () => {
        //let token = localStorage.getItem('token');
        let token = Cookies.get("token")
        await fetch(`http://127.0.0.1:8000/api/user/${ID}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `bearer ${token}`
            }
        }).then(response => response.json())
        .then(data => {
            if(!data.Error) {
                logout();
            } else {
                alert(data.Error);
            }
        });
    }

    const editAccount = async () => {
        validateForm();

        let validate = name != '' && selectedCountry != ''
        && selectedState != '' && selectedMunicipal != '' && cep != '' && street != ''
        && (number != '' || number >= 0) && complement != '' && pis != '' && email != '' && cpf != '';

        if(validate) {
            //let token = localStorage.getItem('token');
            let token = Cookies.get("token")
            let bodyUser = {
                email: email,
                name: name,
                cpf: cpf.replace(/[.-]/g, ''),
                pis: pis,
            }
    
            let bodyAddress = {
                pais: selectedCountry,
                estado: selectedState,
                municipio: selectedMunicipal,
                cep: cep.replace('-', ''),
                rua: street,
                numero: number,
                complemento: complement
            };
            
            await fetch(`http://127.0.0.1:8000/api/address`, {
                method: 'PUT',
                headers: {
                    "Authorization": `bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify(bodyAddress)
            })
            
            await fetch(`http://127.0.0.1:8000/api/user`, {
                method: 'PUT',
                headers: {
                    "Authorization": `bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify(bodyUser)
            })
    
            window.location.pathname = '/home';
        }
    }

    useEffect(()=>{
        flagEdit && getData();
    }, [])

    return (
        <div id="container-login">
            <Form id="form-login" method="POST">
                <div className="mb-3">
                    <Link to={!flagEdit ? '/' : '/home'} className="btn-back">
                        <strong>{'< Voltar'}</strong>
                    </Link>
                </div>
                <h1 className="mb-5">
                    {!flagEdit ? 'Cadastro' : 'Editar Perfil'}
                </h1>
                <FormGroup>
                    <Label for="exampleAddress">
                        Nome
                    </Label>
                    <Input
                        name="name"
                        placeholder="Digite aqui"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        invalid={nameState}
                    />
                   <FormFeedback invalid={nameState.toString()}>
                        Campo obrigatório
                    </FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="email">
                        E-mail
                    </Label>
                    <Input
                        name="email"
                        placeholder="Digite aqui"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        invalid={flagEmailValid}
                    />
                   <FormFeedback invalid={(flagEmailValid).toString()}>
                        E-mail inválido
                    </FormFeedback>
                </FormGroup>
                {!flagEdit && 
                    <FormGroup>
                        <Label for="password">
                            Senha
                        </Label>
                        <Input
                            name="password"
                            placeholder="•••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            invalid={passwordState}
                        />
                        <FormFeedback invalid={passwordState.toString()}>
                            Campo obrigatório
                        </FormFeedback>
                    </FormGroup>
                }
                
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="country">
                                País
                            </Label>
                            <Input
                                name="country"
                                type="select"
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.target.value);
                                    setSelectedState('');
                                    setSelectedMunicipal('');
                                }}
                                invalid={countryState}
                            >
                                <option value="">Selecione</option>
                                {
                                    countryOptions.map((item, index) => (
                                        <option key={`country-${index}`}>
                                            {item}
                                        </option>
                                    ))
                                }
                            </Input>
                            <FormFeedback invalid={countryState.toString()}>
                                Campo obrigatório
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="state">
                                Estado
                            </Label>
                            <Input
                                name="state"
                                type="select"
                                value={selectedState}
                                onChange={(e) => {
                                    setSelectedState(e.target.value)
                                    setSelectedMunicipal('');
                                }}
                                invalid={stateState}
                            >
                                <option value="">Selecione</option>
                                { 
                                    stateOptions.find(item => item.linked == selectedCountry)?.states
                                        .map((item, index) => (
                                            <option key={`state-${index}`}>
                                                {item}
                                            </option>
                                        ))
                                }
                            </Input>
                            <FormFeedback invalid={stateState.toString()}>
                                Campo obrigatório
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="municipal">
                                Município
                            </Label>
                            <Input
                                name="municipal"
                                type="select"
                                value={selectedMunicipal}
                                onChange={(e) => setSelectedMunicipal(e.target.value)}
                                invalid={municiapalState}
                            >
                                <option value="">Selecione</option>
                               { 
                                    municipalOptions.find(item => item.linked == selectedState)?.municipals
                                        .map((item, index) => (
                                            <option key={`municipal-${index}`}>
                                                {item}
                                            </option>
                                        ))
                                }
                            </Input>
                            <FormFeedback invalid={municiapalState.toString()}>
                                Campo obrigatório
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="CEP">
                                CEP
                            </Label>
                            <Input
                                name="CEP"
                                placeholder="00000-000"
                                type="text"
                                value={cep}
                                onChange={(e) => {
                                    let value = e.target.value.replace('.', '')
                                    if (value.length <= 8) return setCEP(value)
                                }}
                                onKeyPress={(e) => onlynumber(e)}
                                onBlur={() => { setCEP(cep.match(/.{1,5}/g).join("-"))}}
                                onFocus={() => {setCEP(cep.replace(/[-]/g, ''))} }
                                invalid={cepState}
                            />
                            <FormFeedback invalid={cepState.toString()}>
                                Campo obrigatório
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="street">
                                Rua
                            </Label>
                            <Input
                                name="street"
                                placeholder="Digite Aqui"
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                invalid={streetState}
                            />
                            <FormFeedback invalid={streetState.toString()}>
                                Campo obrigatório
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="number">
                                Número
                            </Label>
                            <Input
                                name="number"
                                placeholder="Digite Aqui"
                                type="text"
                                value={number}
                                onChange={(e) => setNumber(Number(e.target.value))}
                                onKeyPress={(e) => onlynumber(e)}
                                invalid={numberState}
                            />
                            <FormFeedback invalid={numberState.toString()}>
                                Campo obrigatório
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="complement">
                        Complemento
                    </Label>
                    <Input
                        name="complement"
                        placeholder="Digite aqui"
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        invalid={complementState}
                    />
                    <FormFeedback invalid={complementState.toString()}>
                        Campo obrigatório
                    </FormFeedback>
                </FormGroup>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="CPF">
                                CPF
                            </Label>
                            <Input
                                name="CPF"
                                placeholder="123.456.789-10"
                                type="text"
                                value={cpf}
                                onChange={(e) => {
                                    let value = e.target.value.replace('.', '')
                                    if (value.length <= 11) return setCpf(value)
                                }}
                                onKeyPress={(e) => onlynumber(e)}
                                onBlur={() => { setCpf(cpf.match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/,"-"))}}
                                onFocus={() => {setCpf(cpf.replace(/[.-]/g, ''))} }
                                invalid={flagCPFValid}
                            />
                            <FormFeedback invalid={(flagCPFValid).toString()}>
                                CPF Inválido
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="PIS">
                                PIS
                            </Label>
                            <Input
                                name="PIS"
                                placeholder="Digite aqui"
                                type="text"
                                value={pis}
                                onChange={(e) => setPis(e.target.value)}
                                onKeyPress={(e) => onlynumber(e)}
                                invalid={pisState}
                            />
                            <FormFeedback invalid={pisState.toString()}>
                                Campo obrigatório
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Button className="w-100 mt-5 bg-primary border-0 p-3" onClick={!flagEdit ? registerUser : editAccount}>
                    {!flagEdit ? 'Cadastrar' : 'Salvar Alterações'}
                </Button>

                {
                    flagEdit && 
                    <Link to={'/'}>
                        <Button className="w-100 mt-4 bg-danger border-0 p-3" onClick={deleteAccount}>
                            Deletar Conta
                        </Button>
                    </Link>
                }
                
            </Form>
        </div>
    );
}

export default RegisterAndEditPage;