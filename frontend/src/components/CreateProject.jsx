import React, { useContext, useState } from 'react';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Rich text editor
import { getAcademicYear } from '../utils/getAcademicYear.js';
import { AuthContext } from '../contexts/AuthProvider.jsx';

const CreateProject = () => {
    const [title, setTitle] = useState('');
    const [caseStudy, setCaseStudy] = useState('');
    const [abstract, setAbstract] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { api } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const projectData = {
            title: title,
            case_study: caseStudy,
            abstract: abstract,
            accademic_year: getAcademicYear(),
        };

        try {
            const response = await api.post('http://127.0.0.1:8000/api/projects/', projectData);
            if (response.status === 201) {
                
                setTitle('');
                setCaseStudy('');
                setAbstract('');
                setSuccessMessage('Project created successfully!');
            }            
        } catch (error) {
            setErrorMessage('An error occurred while creating the project.');
        }
    };

    return (
        <div className="container-fluid my-u d-flex align-items-center justify-content-center" style={{ height: '100vh', marginTop: '110px' }}>
            <div className="card w-100 rounded-4" style={{ maxWidth: '1000px', minHeight: '80vh' }}>
                <div className="card-header bg-primary text-white rounded-top-4">
                    <h2 className="m-2 text-center">Submit a Project</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Case Study:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={caseStudy}
                                onChange={(e) => setCaseStudy(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label>Abstract:</label>
                            <ReactQuill
                                theme="snow"
                                value={abstract}
                                onChange={setAbstract}
                                style={{ height: '250px' }}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-center mt-5">
                            <button type="submit" className="btn btn-primary w-100">Submit</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Media query for margin adjustments */}
            <style>
                
            </style>
        </div>
    );
};

export default CreateProject;
