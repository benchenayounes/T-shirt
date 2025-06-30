import React, { createContext, useState } from 'react';

export const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
    const [productType, setProductType] = useState(null);
    const [color, setColor] = useState(null);
    const [designImage, setDesignImage] = useState(null);
    const [canvas, setCanvas] = useState(null);

    return (
        <DesignContext.Provider value={{ 
            productType, 
            setProductType, 
            color, 
            setColor, 
            designImage, 
            setDesignImage,
            canvas,
            setCanvas
        }}>
            {children}
        </DesignContext.Provider>
    );
};