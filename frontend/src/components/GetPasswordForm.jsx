import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import './pwdstyles.css';

const GetPasswordForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [searchResult, setSearchResult] = useState(null); // State to store the search result
    const [searchError, setSearchError] = useState(null); // State to store search error
    const [userType, setUserType] = useState('student'); // State to store the selected user type
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const endpoint = userType === 'student' 
                ? `http://127.0.0.1:8000/api/students/search-student/?reg_num=${data.regNo}` 
                : `http://127.0.0.1:8000/api/supervisors/search-supervisor/?reg_num=${data.regNo}`;

            const response = await fetch(endpoint);
            const result = await response.json();

            if (response.ok && result) {
                setSearchResult(result);
                setSearchError(null); // Clear any previous errors
            } else {
                setSearchResult(null);
                setSearchError(result.error);
            }
        } catch (error) {
            setSearchResult(null);
            setSearchError(error.message);
            console.error('Search error:', error.message);
        }
    };

    const formatEmail = (email) => {
        const atIndex = email?.indexOf('@');
        if (atIndex > 3) {
            const maskedPart = '*'.repeat(atIndex - 2);
            const visiblePart = email.slice(atIndex - 2);
            return `${maskedPart}${visiblePart}`;
        }
        return email; 
    };

    const handleClaimPassword = () => {
        if (searchResult) {
            if (searchResult.student?.account === null) {
                navigate('/set-password', { state: { ...searchResult.student, isStudent: 'yes' } });
            } else if (searchResult.supervisor?.account === null) {
                navigate('/set-password', { state: { ...searchResult.supervisor, reg_no: searchResult.reg_num, isStudent: 'no' } });
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            
            <div className="container border rounded-2x">
            
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                    
                        <h2 className="text-center mb-4">Claim Your Password</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center">
                            <div className="form-group mb-3">
                                <select
                                    className={`form-select ${searchResult ? `block-input` : ``}`}
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value="student">Student</option>
                                    <option value="supervisor">Supervisor</option>
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.regNo ? 'is-invalid' : ''} ${searchResult ? `block-input` : ``}`}
                                    name="reg_no"
                                    {...register('regNo', {
                                        required: 'Enter your Registration number to claim a password',
                                    })}
                                    placeholder="Search: Type your Registration Number"
                                />
                                {errors.regNo && <div className="invalid-feedback">{errors.regNo.message}</div>}
                            </div>
                            <div className="form-group mb-3">
                                {searchResult ? (
                                    ""
                                ) : (
                                    <button type="submit" className="btn btn-primary">Verify Info</button>
                                )}
                            </div>
                        </form>

                        {/* Display search result or error message */}
                        {searchResult && (
                            <>
                                <div className="alert alert-success mt-4" role="alert">
                                    <h4 className="alert-heading">Data Found</h4>
                                    <img src={searchResult.profile_pic} alt="Profile" className="img-fluid rounded mb-3" />
                                    <p><strong>First Name:</strong> {searchResult.supervisor?.fname || searchResult.student?.fname}</p>
                                    <p><strong>Last Name:</strong> {searchResult.supervisor?.lname || searchResult.student?.lname}</p>
                                    <p><strong>Email:</strong> {formatEmail(searchResult.supervisor?.email) || formatEmail(searchResult.student?.email)}</p>
                                    <p><strong>Phone:</strong> {searchResult.supervisor?.phone || searchResult.student?.phone}</p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <button onClick={handleClaimPassword} className="btn btn-success">Claim Password</button>
                                    <button onClick={() => { setSearchResult(null) }} type="button" className="btn btn-danger">Not this account? Search again</button>
                                </div>
                            </>
                        )}

                        {searchError && (
                            <div className="alert alert-danger mt-4" role="alert">
                                {searchError}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetPasswordForm;
