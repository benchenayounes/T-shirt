import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignContext } from '../contexts/DesignContext';

const ProductSelector = () => {
    const [productType, setProductType] = useState('tshirt');
    const [color, setColor] = useState('white');
    const navigate = useNavigate();
    const { setProductType: setContextProductType, setColor: setContextColor } = useContext(DesignContext);

    const handleProductChange = (e) => {
        setProductType(e.target.value);
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update context with selected values
        setContextProductType(productType);
        setContextColor(color);
        // Navigate to design page
        navigate('/design');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Select Your Product</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="mb-4">
                    <label className="mr-2">
                        <input
                            type="radio"
                            value="tshirt"
                            checked={productType === 'tshirt'}
                            onChange={handleProductChange}
                        />
                        T-shirt
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="hoodie"
                            checked={productType === 'hoodie'}
                            onChange={handleProductChange}
                        />
                        Hoodie
                    </label>
                </div>
                <select value={color} onChange={handleColorChange} className="mb-4 p-2 border rounded">
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Next
                </button>
            </form>
        </div>
    );
};

export default ProductSelector;