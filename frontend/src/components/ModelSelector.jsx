import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModelSelector = ({ onSelect }) => {
    const [models, setModels] = useState([]);
    const [selected, setSelected] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/config')
            .then(res => {
                setModels(res.data.models);
                if (res.data.models.length > 0) {
                    setSelected(res.data.models[0]);
                    onSelect(res.data.models[0]);
                }
            })
            .catch(err => console.error(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setSelected(e.target.value);
        onSelect(e.target.value);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Model</label>
            <select
                value={selected}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
        </div>
    );
};

export default ModelSelector;
