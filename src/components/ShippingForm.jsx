import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignContext } from '../contexts/DesignContext';

const ShippingForm = () => {
    const navigate = useNavigate();
    const { productType, color, designImage } = useContext(DesignContext);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        wilaya: '',
        city: '',
        deliveryTo: 'home',
        fullAddress: ''
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Only allow letters for fullName
        if (name === 'fullName') {
            if (!/^[a-zA-Z\s]*$/.test(value)) return;
        }
        // Only allow numbers for phoneNumber
        if (name === 'phoneNumber') {
            if (!/^\d*$/.test(value)) return;
        }
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRadioChange = (e) => {
        setFormData({
            ...formData,
            deliveryTo: e.target.value,
            fullAddress: '' // reset full address if switching
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
            newErrors.fullName = 'Full name must contain only letters';
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
        }
        if (!formData.wilaya.trim()) {
            newErrors.wilaya = 'Wilaya is required';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (formData.deliveryTo === 'home' && !formData.fullAddress.trim()) {
            newErrors.fullAddress = 'Full address is required for home delivery';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        // Create order object with design image
        const order = {
            id: Date.now(),
            customerInfo: {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                wilaya: formData.wilaya,
                city: formData.city,
                deliveryTo: formData.deliveryTo,
                fullAddress: formData.deliveryTo === 'home' ? formData.fullAddress : ''
            },
            productDetails: {
                type: productType,
                color: color,
                designImage: designImage
            },
            orderDate: new Date().toISOString()
        };

        // Store order in localStorage (temporary solution)
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Navigate to thank you page
        navigate('/thank-you');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {submitted && errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {submitted && errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Wilaya</label>
                <input
                    type="text"
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {submitted && errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {submitted && errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Deliver to</label>
                <div className="flex gap-4 mt-1">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="deliveryTo"
                            value="home"
                            checked={formData.deliveryTo === 'home'}
                            onChange={handleRadioChange}
                        />
                        <span className="ml-2">Home</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="deliveryTo"
                            value="office"
                            checked={formData.deliveryTo === 'office'}
                            onChange={handleRadioChange}
                        />
                        <span className="ml-2">Office</span>
                    </label>
                </div>
            </div>
            {formData.deliveryTo === 'home' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Full Address</label>
                    <input
                        type="text"
                        name="fullAddress"
                        value={formData.fullAddress}
                        onChange={handleChange}
                        required={formData.deliveryTo === 'home'}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {submitted && errors.fullAddress && <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>}
                </div>
            )}
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded">
                Continue
            </button>
        </form>
    );
};

export default ShippingForm;