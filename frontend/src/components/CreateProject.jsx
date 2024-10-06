import React, { useState } from 'react';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Rich text editor

const CreateProject = () => {
    const [title, setTitle] = useState('');
    const [caseStudy, setCaseStudy] = useState('');
    const [abstract, setAbstract] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const projectData = {
            title: title,
            case_study: caseStudy,
            abstract: abstract
        };

        try {
            const response = await axios.post('http://localhost:8000/api/projects/create/', projectData);
            if (response.status === 201) {
                setSuccessMessage('Project created successfully!');
                setTitle('');
                setCaseStudy('');
                setAbstract('');
            }
        } catch (error) {
            setErrorMessage('An error occurred while creating the project.');
        }
    };

    return (
        <div className="create-project-form">
            <h2>Submit a Project</h2>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Case Study:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={caseStudy}
                        onChange={(e) => setCaseStudy(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Abstract:</label>
                    <ReactQuill
                        theme="snow"
                        value={abstract}
                        onChange={setAbstract}
                        style={{ height: '400px' }}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default CreateProject;
