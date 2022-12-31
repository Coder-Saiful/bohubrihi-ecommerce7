import React, { useRef, useState } from 'react';
import Layout from '../Layout';
import {login} from '../../api/apiAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import { authenticate, isAuthenticated, userInfo } from '../../utils/auth';

const Login = () => {
    const submitBtnRef = useRef(null);

    const [values, setValues] = useState({
        email: '',
        password: '',
        disabled: false,
        error: false,
        redirect: false
    });

    const {name, email, password, disabled, error, redirect} = values;

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

        login({email: email, password: password})
            .then(response => {
                authenticate(response.data.token, () => {
                    setValues({
                        ...values,
                        email: '',
                        password: '',
                        error: false,
                        disabled: false,
                        redirect: true
                    });
    
                    submitBtnRef.current.textContent = "Login";
                    submitBtnRef.current.classList.remove('loading');
                });
            })
            .catch(err => {
                if (err.response) {
                    setValues({
                        ...values,
                        error: err.response.data,
                        disabled: false
                    });
    
                    submitBtnRef.current.textContent = "Login";
                    submitBtnRef.current.classList.remove('loading');
                    
                    if (err.response.data.loginErr) {
                        toast.error(`${err.response.data.loginErr}`, {
                            autoClose: 3000
                        });
                    }
                } else {
                    let msgText;
                    if (navigator.onLine) {
                        msgText = 'Login failed! Please try again.';
                    } else {
                        msgText = 'Internet connection failed!';
                    }
                    setValues({
                        ...values,
                        error: false,
                        disabled: false
                    });
    
                    submitBtnRef.current.textContent = "Login";
                    submitBtnRef.current.classList.remove('loading');

                    toast.error(`${msgText}`, {
                        autoClose: 3000
                    });
                }
            });
    }

    const redirectUser = () => {
        if (redirect) {
            return <Redirect to={`/${userInfo().role}/dashboard`} />
        }
        if (isAuthenticated()) {
            return <Redirect to={`/${userInfo().role}/dashboard`} />
        }
    }

    return (
        <Layout title='Login' classname='container'>
            <ToastContainer />
            {redirectUser()}
            <div className="row">
                <div className="col-lg-7 col-md-10 m-auto">
                <form className='authForm' onSubmit={handleSubmit}>
                    <h1 className='text-center'>Login Here</h1>
                        <div className="mb-3">
                            <label className="form-label">Email Address:</label>
                            <input type="text" className="form-control" name='email' value={email} onChange={handleChange} />
                            <div className="text-danger">{error.message ? error.message : ''}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <input type="password" className="form-control" name='password' value={password} onChange={handleChange} />
                        </div>
                        <button type="submit" disabled={disabled} className="submitBtn" ref={submitBtnRef}>Register</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;