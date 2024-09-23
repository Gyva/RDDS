import React, { useState, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthProvider';
import Cookies from 'js-cookie';
import axios from 'axios';

const Login = (e) => {
   const {register, handleSubmit, formState: {errors}} = useForm();
   const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

   

    const onSubmit = async (data) => {
        const URL = "http://127.0.0.1:8000/api/login/";
            
            const response = await axios.post(URL, {
                username: data.username,
                password: data.password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
        try {
            

            if(response.ok){
                Cookies.set('User',response.data.id, {expires : 7})
                Cookies.set('role', response.data.role, {expires: 7})
                Cookies.set('token', response.data.access_token, {expires: 7})
                Cookies.set('refresh_token',response.data.refresh_token, {expires: 7})

                alert('Login successfully')
            }
            if(response.status === 400){
                setErrMsg(response.data.non_field_errors[0]) 
            }
            
            else{
             
            }

           
        } catch (error) {
            setErrMsg(response.data.non_field_errors[0])
            
        }
    };
    
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Login</h2>
                        {errMsg && <p className='alert alert-danger'>{errMsg}</p>}
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                            <div className="form-group mb-3">
                                <label htmlFor="username">Email/RegNo:</label>
                                <input
                                    type="text"
                                    id="username"
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    {...register('username', {
                                        required: 'email address or RegNumber is required',
                                    })}
                                    placeholder="Enter your email/RegNo"
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', { required: 'Password is required' })}
                                    placeholder="Enter your password"
                                    
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
