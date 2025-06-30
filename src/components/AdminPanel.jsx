import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Load orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
    }, []);

    const handleDeleteOrder = (orderId) => {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Panel - Orders</h1>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="font-medium">{order.customerInfo.fullName}</p>
                                            <p className="text-gray-500">{order.customerInfo.phoneNumber}</p>
                                            <p className="text-gray-500">Wilaya: {order.customerInfo.wilaya}</p>
                                            <p className="text-gray-500">City: {order.customerInfo.city}</p>
                                            <p className="text-gray-500">Deliver to: {order.customerInfo.deliveryTo}</p>
                                            {order.customerInfo.deliveryTo === 'home' && (
                                                <p className="text-gray-500">Full Address: {order.customerInfo.fullAddress}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p>Type: {order.productDetails.type}</p>
                                            <p>Color: {order.productDetails.color}</p>
                                            {order.productDetails.designImage && (
                                                <img 
                                                    src={order.productDetails.designImage} 
                                                    alt="Design Preview" 
                                                    className="mt-2 w-24 h-24 object-contain border border-gray-200"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button 
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;