import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/homeBack.png';  // Update path
import anarchyIcon from '../assets/logo.png';  // Update path

const HomePage = () => {
    const navigate = useNavigate();

    const handleStartDesigning = () => {
        navigate('/design');
    };

    return (
        <div 
            className="flex flex-col items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backgroundBlend: 'overlay'
            }}
        >
            <div className="backdrop-blur-sm bg-white/30 p-8 rounded-lg text-center">
                <img 
                    src={anarchyIcon} 
                    alt="Anarchy Symbol" 
                    className="w-24 h-24 mb-4 mx-auto"
                />
                <h1 className="text-4xl font-bold mb-4 text-gray-800">Print Your T-Shirt</h1>
                <button 
                    onClick={handleStartDesigning}
                    className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                    Start Designing
                </button>
            </div>
        </div>
    );
};

export default HomePage;