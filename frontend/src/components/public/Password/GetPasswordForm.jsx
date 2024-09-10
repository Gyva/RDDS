import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './styles.css'

const GetPasswordForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [searchResult, setSearchResult] = useState(null); // State to store the search result
    const [searchError, setSearchError] = useState(null); // State to store search error
    const [userType, setUserType] = useState('student'); // State to store the selected user type
    const navigate = useNavigate(); 

    const onSubmit = async (data) => {
        try {
            // Determine the API endpoint based on the selected user type
            const endpoint = userType === 'student'
                ? `http://127.0.0.1:8000/api/students/search-by-regnum/?reg_num=${data.regNo}`
                : `http://127.0.0.1:8000/api/supervisors/search-supervisor/?reg_num=${data.regNo}`;

            const response = await fetch(endpoint);
            const result = await response.json();

            if (response.ok && result) {
                // If the search is successful, display the result
                setSearchResult(result);
                setSearchError(null); // Clear any previous errors
            } else {
                // If the search fails, display an error message
                setSearchResult(null);
                setSearchError('Item not found');
            }
        } catch (error) {
            // Handle any network errors
            setSearchResult(null);
            setSearchError('An error occurred while searching');
            console.error('Search error:', error);
        }
    };

    // Function to mask the email except for the last 3 characters before '@'
    const formatEmail = (email) => {
        const atIndex = email.indexOf('@');
        if (atIndex > 3) {
            const maskedPart = '*'.repeat(atIndex - 2); // Replace characters before the last 3 with asterisks
            const visiblePart = email.slice(atIndex - 2); // Last 3 characters and the domain
            return `${maskedPart}${visiblePart}`;
        }
        return email; // Return the email as is if there are fewer than 3 characters before the '@'
    };

    const handleClaimPassword = () => {
        if (searchResult) {
            // Redirect to the SetPassword component and pass the data
            navigate('/set-password', { state: { ...searchResult.supervisor } });
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="text-center mb-4">Claim Your Password</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex align-items-center">
                            <div className="form-group mb-3 me-2">
                                <select
                                    className={`form-select ${searchResult ? `block-input` : ``}`}
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value="student">Student</option>
                                    <option value="supervisor">Supervisor</option>
                                </select>
                            </div>
                            <div className="form-group mb-3 me-2">
                                <input
                                    type="text"
                                    className={`form-control ${errors.regNo ? 'is-invalid' : ''}  ${searchResult ? `block-input` : ``}`}
                                    name="reg_no"
                                    {...register('regNo', {
                                        required: 'Enter your Registration number to claim a password',
                                        // pattern: {
                                        //     value: /^\d{2}RP\d{5}$/,
                                        //     message: 'Invalid RegNumber format'
                                        // }
                                    })}
                                    placeholder="Search: Type your Registrastion Number"
                                    
                                />
                                {errors.regNo && <div className="invalid-feedback">{errors.regNo.message}</div>}
                            </div>
                            <div className="form-group mb-3 me-2">
                                {searchResult ? ("")
                                 : <button type="submit" className="btn btn-primary">Verify Info</button>}
                            </div>

                        </form>

                        {/* Display search result or error message */}
                        {searchResult && (
                            <>
                            <div className="alert alert-success mt-4" role="alert">
                                <h4 className="alert-heading">Account Found</h4>
                                <img src={searchResult.profile_pic} alt="Profile" className="img-fluid rounded mb-3" />
                                {/* <p><strong>Registration Number:</strong> {searchResult.supervisor.reg_no}</p> */}
                                <p><strong>First Name:</strong> {searchResult.supervisor.fname}</p>
                                <p><strong>Last Name:</strong> {searchResult.supervisor.lname}</p>
                                <p><strong>Email:</strong> {formatEmail(searchResult.supervisor.email)}</p>
                                <p><strong>Phone:</strong> {searchResult.supervisor.phone}</p>
                                {/* Add more fields as needed */}
                            </div>
                            <div className='d-flex justify-content-between'>
                            <button type="submit" onClick={handleClaimPassword} className="btn btn-success">Claim Password</button>
                            <button onClick={()=>{setSearchResult(null)}} type="submit" className="btn btn-danger">Not this account? Search again</button>
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
