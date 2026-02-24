import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = ({ onOrderChange }) => {
    const [parts, setParts] = useState([]);
    const [order, setOrder] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/config')
            .then(res => setParts(res.data.parts))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (part, count) => {
        const newOrder = { ...order, [part]: parseInt(count) || 0 };
        if (newOrder[part] <= 0) delete newOrder[part];
        setOrder(newOrder);
        onOrderChange(newOrder);
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-bold mb-4">Create Order</h2>
            <div className="grid grid-cols-2 gap-4">
                {parts.map(part => (
                    <div key={part} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 capitalize">{part.replace('_', ' ')}</label>
                        <input
                            type="number"
                            min="0"
                            className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={(e) => handleChange(part, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderForm;
