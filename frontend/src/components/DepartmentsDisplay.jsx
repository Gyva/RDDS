import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './DepartmentDisplay.css';

const DepartmentsDisplay = () => {
    const [departments, setDepartments] = useState([]);
    const [facultiesCount, setFacultiesCount] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorAlerts, setErrorAlerts] = useState(null);
    const navigate = useNavigate();

    // Fetch departments on component mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/departments/');
            setDepartments(response.data);
            setLoading(false);
            response.data.forEach(department => {
                fetchFacultiesCount(department.dpt_id);
            });
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorAlerts('Failed to fetch departments');
            setLoading(false);
        }
    };

    const fetchFacultiesCount = async (dpt_id) => {
        try {
            const URL = `http://127.0.0.1:8000/api/faculties/?dpt_id=${dpt_id}`;
            const response = await axios.get(URL);
            if (response && response.data) {
                setFacultiesCount(prev => ({
                    ...prev,
                    [dpt_id]: response.data.length
                }));
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    const deleteThisDepartment = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this department?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/departments/${id}/`);
                setDepartments(departments.filter(dep => dep.dpt_id !== id));
            } catch (error) {
                console.error('Error deleting department:', error);
                setErrorAlerts('Failed to delete department');
            }
        }
    };

    // Define table columns
    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Department Name',
            selector: row => row.dpt_name,
            sortable: true,
        },
        {
            name: 'No. of Faculties',
            selector: row => facultiesCount[row.dpt_id] || '0',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button 
                        className="btn btn-warning me-2" 
                        onClick={() => {/* Update logic here */}}>
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button 
                        className="btn btn-danger me-2" 
                        onClick={() => deleteThisDepartment(row.dpt_id)}>
                        <i className="fas fa-trash"></i>
                    </button>
                    <button 
                        className="btn btn-success" 
                        onClick={() => {/* Add Faculty logic here */}}>
                        <i className="fas fa-plus"></i> Add Faculty
                    </button>
                </>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            {errorAlerts && (<span className='flex justify-content-end text-danger'>{errorAlerts}</span>)}
            <h2 className="mb-3 text-center">Departments Information</h2>
            <DataTable
                columns={columns}
                data={departments}
                progressPending={loading}
                pagination
                highlightOnHover
                striped
                responsive
                subHeader
                subHeaderComponent={
                    <button 
                        className="btn btn-success"
                        onClick={() => {/* Add Department logic here */}}>
                        <i className="fas fa-plus"></i> Add Department
                    </button>
                }
                paginationPerPage={5} // rows per page
            />
        </div>
    );
};

export default DepartmentsDisplay;
