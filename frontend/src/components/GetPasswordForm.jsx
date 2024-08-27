import React from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const GetPasswordForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        // Handle form submission logic
        console.log('Form submitted:', data);
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <h2 className="text-center mb-4">Claim Your Password</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.regNo ? 'is-invalid' : ''}`}
                                    name="reg_no"
                                    {...register('regNo', {
                                        required: 'Enter your Registration number to claim a password',
                                        pattern: {
                                            value: /^\d{2}RP\d{5}$/,
                                            message: 'Invalid RegNumber format'
                                        }
                                    })}
                                    placeholder="Enter Registration Number"
                                />
                                {errors.regNo && <div className="invalid-feedback">{errors.regNo.message}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Claim a Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetPasswordForm;
