import React, { useRef, useState } from 'react';
import Layout from '../Layout';
import {register} from '../../api/apiAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated, userInfo } from '../../utils/auth';
import { Redirect } from 'react-router-dom';

const Register = () => {
    const submitBtnRef = useRef(null);

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        disabled: false,
        error: false
    });

    const {name, email, password, disabled, error} = values;

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();

        setValues({
            ...values,
            disabled: true
        });

        submitBtnRef.current.textContent = "";
        submitBtnRef.current.classList.add('loading');

        register({name: name, email: email, password: password})
            .then(response => {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: false,
                    disabled: false
                });

                submitBtnRef.current.textContent = "Register";
                submitBtnRef.current.classList.remove('loading');
                
                toast.success(`${response.data.message}`, {
                    autoClose: 3000
                });
            })
            .catch(err => {
                if (err.response) {
                    setValues({
                        ...values,
                        error: err.response.data,
                        disabled: false
                    });
    
                    submitBtnRef.current.textContent = "Register";
                    submitBtnRef.current.classList.remove('loading');
                    
                    if (err.response.data.message) {
                        toast.error(`${err.response.data.message}`, {
                            autoClose: 3000
                        });
                    }
                } else {
                    let msgText;
                    if (navigator.onLine) {
                        msgText = 'Registration failed! Please try again.';
                    } else {
                        msgText = 'Internet connection failed!';
                    }
                    setValues({
                        ...values,
                        error: false,
                        disabled: false
                    });
    
                    submitBtnRef.current.textContent = "Register";
                    submitBtnRef.current.classList.remove('loading');

                    toast.error(`${msgText}`, {
                        autoClose: 3000
                    });
                }
            });
    }

    return (
        <Layout title='Register' classname='container'>
            <ToastContainer />
            {isAuthenticated() ? <Redirect to={`/${userInfo().role}/dashboard`} /> : ''}
            <div className="row">
                <div className="col-lg-7 col-md-10 m-auto">
                <form className='authForm' onSubmit={handleSubmit}>
                    <h1 className='text-center'>Register Here</h1>
                    <div className="mb-3">
                            <label className="form-label">Your Name:</label>
                            <input type="text" className="form-control" name='name' value={name} onChange={handleChange} />
                            <div className="text-danger">{error.name ? error.name : ''}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email Address:</label>
                            <input type="text" className="form-control" name='email' value={email} onChange={handleChange} />
                            <div className="text-danger">{error.email ? error.email : ''}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <input type="password" className="form-control" name='password' value={password} onChange={handleChange} />
                            <div className="text-danger">{error.password ? error.password : ''}</div>
                        </div>
                        <button type="submit" disabled={disabled} className="submitBtn" ref={submitBtnRef}>Register</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Register;