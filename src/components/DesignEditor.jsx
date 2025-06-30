import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignContext } from '../contexts/DesignContext';
import { fabric } from 'fabric';
import tshirtFrontUrl from '../assets/mockups/t-front.svg';
import tshirtBackUrl from '../assets/mockups/t-back.svg';
import hoodieFrontUrl from '../assets/mockups/h-front.svg';
import hoodieBackUrl from '../assets/mockups/h-back.svg';

const DesignEditor = () => {
    const { setProductType: setContextProductType, setColor: setContextColor, setDesignImage, setSize: setContextSize } = useContext(DesignContext);
    const [productType, setProductType] = useState('tshirt');
    const [color, setColor] = useState('white');
    const [side, setSide] = useState('front'); // 'front' or 'back'
    const [size, setSize] = useState('M'); // NEW: default to 'M'
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const navigate = useNavigate();

    const handleProductChange = (e) => {
        setProductType(e.target.value);
        setContextProductType(e.target.value);
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
        setContextColor(e.target.value);
    };

    const handleSideChange = (newSide) => {
        setSide(newSide);
    };

    // NEW: handle size change
    const handleSizeChange = (e) => {
        setSize(e.target.value);
        setContextSize && setContextSize(e.target.value);
    };

    // Responsive canvas sizing
    const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
    useEffect(() => {
        const updateCanvasSize = () => {
            const isMobile = window.innerWidth < 768;
            const width = isMobile ? Math.min(window.innerWidth - 32, 400) : 500;
            setCanvasSize({
                width,
                height: width
            });
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Load correct SVG based on productType and side
    useEffect(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {
            fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
                width: canvasSize.width,
                height: canvasSize.height,
                backgroundColor: color
            });
        }

        let svgUrl = '';
        if (productType === 'tshirt') {
            svgUrl = side === 'front' ? tshirtFrontUrl : tshirtBackUrl;
        } else {
            svgUrl = side === 'front' ? hoodieFrontUrl : hoodieBackUrl;
        }

        fetch(svgUrl)
            .then(res => res.text())
            .then(svgText => {
                // Map logical color names to hex codes
                const colorMap = {
                    white: '#ffffff',
                    black: '#000000',
                    red: '#ef4444',
                    blue: '#3b82f6'
                };
                const hexColor = colorMap[color] || color;

                // Replace both T-shirt and hoodie main body fills
                let coloredSvg = svgText
                    .replace(/fill="#fcfcfc(ff)?"/gi, `fill="${hexColor}"`)
                    .replace(/fill="#ffffff"/gi, `fill="${hexColor}"`);

                fabric.loadSVGFromString(coloredSvg, (objects, options) => {
                    const mockup = fabric.util.groupSVGElements(objects, options);
                    mockup.set({
                        left: canvasSize.width / 2,
                        top: canvasSize.height / 2,
                        originX: 'center',
                        originY: 'center',
                        selectable: false
                    });
                    fabricCanvasRef.current.clear();
                    fabricCanvasRef.current.add(mockup);
                    fabricCanvasRef.current.renderAll();
                });
            });

        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        };
    }, [productType, color, side, canvasSize]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && fabricCanvasRef.current) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.src = e.target.result;
                img.onload = () => {
                    const maxSize = 200;
                    let scale = 1;
                    if (img.width > maxSize || img.height > maxSize) {
                        scale = Math.min(
                            maxSize / img.width,
                            maxSize / img.height
                        );
                    }
                    fabric.Image.fromURL(e.target.result, (fabricImg) => {
                        fabricImg.set({
                            left: 250,
                            top: 250,
                            originX: 'center',
                            originY: 'center',
                            scaleX: scale,
                            scaleY: scale,
                            cornerStyle: 'circle',
                            transparentCorners: false
                        });
                        fabricCanvasRef.current.add(fabricImg);
                        fabricCanvasRef.current.setActiveObject(fabricImg);
                        fabricCanvasRef.current.renderAll();
                        const designImageURL = fabricCanvasRef.current.toDataURL({
                            format: 'png',
                            quality: 0.8
                        });
                        setDesignImage(designImageURL);
                    });
                };
            };
            reader.readAsDataURL(file);
        }
    };

    // Add this function to remove the selected object (uploaded image)
    const handleDeleteImage = () => {
        if (fabricCanvasRef.current) {
            const activeObject = fabricCanvasRef.current.getActiveObject();
            if (activeObject && activeObject.type === 'image') {
                fabricCanvasRef.current.remove(activeObject);
                fabricCanvasRef.current.discardActiveObject();
                fabricCanvasRef.current.renderAll();
                setDesignImage(null);
            }
        }
    };

    const handleProceedToShipping = () => {
        if (fabricCanvasRef.current) {
            const designImageURL = fabricCanvasRef.current.toDataURL({
                format: 'png',
                quality: 0.8
            });
            setDesignImage(designImageURL);
        }
        setContextSize && setContextSize(size); // NEW: store size in context
        navigate('/shipping');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
                {/* Controls Panel */}
                <div className="w-full md:w-1/3 bg-white rounded-lg p-4 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Customize Your Product</h2>
                    <div className="space-y-6">
                        {/* Product Type Selection */}
                        <div>
                            <h3 className="font-medium mb-2">Product Type</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="tshirt"
                                        checked={productType === 'tshirt'}
                                        onChange={handleProductChange}
                                        className="mr-2"
                                    />
                                    <span>T-shirt</span>
                                </label>
                                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="hoodie"
                                        checked={productType === 'hoodie'}
                                        onChange={handleProductChange}
                                        className="mr-2"
                                    />
                                    <span>Hoodie</span>
                                </label>
                            </div>
                        </div>

                        {/* Side Selection */}
                        <div>
                            <h3 className="font-medium mb-2">Side</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    className={`p-3 text-black border rounded ${side === 'front' ? 'ring-2 ring-blue-500' : ''}`}
                                    onClick={() => handleSideChange('front')}
                                >
                                    Front
                                </button>
                                <button
                                    type="button"
                                    className={`p-3 text-black border rounded ${side === 'back' ? 'ring-2 ring-blue-500' : ''}`}
                                    onClick={() => handleSideChange('back')}
                                >
                                    Back
                                </button>
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h3 className="font-medium mb-2">Color</h3>
                            <div className="flex gap-4">
                                {[
                                    { value: 'white', icon: '⚪' },
                                    { value: 'black', icon: '⚫' },
                                    { value: 'red', icon: '🔴' },
                                    { value: 'blue', icon: '🔵' }
                                ].map((colorOption) => (
                                    <button
                                        key={colorOption.value}
                                        type="button"
                                        onClick={() => handleColorChange({ target: { value: colorOption.value } })}
                                        className={`text-3xl focus:outline-none transition-transform ${
                                            color === colorOption.value ? 'scale-125' : ''
                                        }`}
                                        aria-label={colorOption.value}
                                        style={{ background: 'none', boxShadow: 'none' }} 
                                    >
                                        {colorOption.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <h3 className="font-medium mb-2">Size</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {['S', 'M', 'L', 'XL'].map((sizeOption) => (
                                    <label
                                        key={sizeOption}
                                        className={`flex items-center justify-center p-2 border rounded cursor-pointer ${
                                            size === sizeOption ? 'ring-2 ring-blue-500 font-bold' : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="size"
                                            value={sizeOption}
                                            checked={size === sizeOption}
                                            onChange={handleSizeChange}
                                            className="hidden"
                                        />
                                        {sizeOption}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <h3 className="font-medium mb-2">Upload Design</h3>
                            <label className="block w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                        cursor-pointer"
                                />
                            </label>
                            {/* Add Delete Image button */}
                            <button
                                type="button"
                                onClick={handleDeleteImage}
                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors w-full"
                            >
                                Delete Image
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-4 shadow-sm">
                    <h1 className="text-2xl font-bold mb-4">
                        Design Your {productType === 'tshirt' ? 'T-shirt' : 'Hoodie'} ({side.charAt(0).toUpperCase() + side.slice(1)})
                    </h1>
                    <div className="w-full flex justify-center">
                        <div className="border border-gray-200 rounded-lg p-2 bg-white">
                            <canvas 
                                ref={canvasRef}
                                style={{
                                    width: '100%',
                                    maxWidth: `${canvasSize.width}px`,
                                    height: 'auto',
                                    touchAction: 'none'
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleProceedToShipping}
                        className="mt-6 w-full md:w-auto bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Proceed to Shipping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesignEditor;