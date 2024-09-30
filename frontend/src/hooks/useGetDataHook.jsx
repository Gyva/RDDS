import React, { useState } from 'react'
import axios from 'axios';

const useGetDataHook = ({ url }) => {
    const [data, setData] = useState(null);
    const [errMsg, setErrMsg] = useState(null);

    try {
        axios.get(url)
            .then((response) => {
                setData(response.data)
            })
    } catch (error) {
            setErrMsg("Server Error")
            console.error("Error fetching data ", error)
    }
    return (
        {data,errMsg}
    )
    
}

export default useGetDataHook