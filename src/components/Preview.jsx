import React, { useContext } from 'react';
import { DesignContext } from '../contexts/DesignContext';

const Preview = () => {
    const { selectedProduct, uploadedImage } = useContext(DesignContext);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Preview Your Design</h2>
            <div className="border-2 border-gray-300 p-4 rounded-lg">
                {selectedProduct === 't-shirt' && (
                    <img src="/assets/mockups/tshirt.svg" alt="T-shirt Mockup" className="w-64" />
                )}
                {selectedProduct === 'hoodie' && (
                    <img src="/assets/mockups/hoodie.svg" alt="Hoodie Mockup" className="w-64" />
                )}
                {uploadedImage && (
                    <img src={uploadedImage} alt="User Upload" className="absolute" />
                )}
            </div>
        </div>
    );
};

export default Preview;