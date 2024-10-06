import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PasswordResetForm = () => {
    
    const { uid, token } = useParams(); // Get UID and token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    // console.log (uid + " " + token)
    // Handle form submission
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            return;
        }
        console.log(uid + " " + token + " " + newPassword +" "+ confirmNewPassword)
        try {

            const response = await axios.post('http://127.0.0.1:8000/api/password-reset-confirm/', {
                uidb64: uid,
                token: token,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword
            });
            console.log(response)

            if (response.status === 200) {
                setSuccess(response.data.message);
                setError(null);
                setTimeout(() => {
                    navigate('/login'); // Redirect to login after success
                }, 2000);
            }
            else{
                setError(response.data.non_field_errors
                );
                setSuccess(null)
            }
        } catch (err) {
            setError("Your reset password link may have been expired? Request another.");
            setSuccess(null);
            console.error(err);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Reset Your Password</h2>

                        {error && <div className="alert alert-danger text-center">{error}</div>}
                        {success && <div className="alert alert-success text-center">{success}</div>}

                        <form onSubmit={handlePasswordReset} className="d-flex flex-column">
                            <div className="form-group mb-3">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Confirm Reset Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetForm;
