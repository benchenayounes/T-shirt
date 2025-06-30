import { useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';

export const useFabric = () => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);

    const initializeCanvas = useCallback(() => {
        if (canvasRef.current) {
            fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
                width: 500,
                height: 500,
                backgroundColor: 'white',
            });
        }
    }, []);

    useEffect(() => {
        initializeCanvas();
        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
            }
        };
    }, [initializeCanvas]);

    const addImageToCanvas = (imageUrl) => {
        fabric.Image.fromURL(imageUrl, (img) => {
            img.scaleToWidth(200);
            fabricCanvasRef.current.add(img);
            fabricCanvasRef.current.renderAll();
        });
    };

    const removeSelectedObject = () => {
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject) {
            fabricCanvasRef.current.remove(activeObject);
            fabricCanvasRef.current.renderAll();
        }
    };

    const clearCanvas = () => {
        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.setBackgroundColor('white', fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
    };

    return {
        canvasRef,
        fabricCanvas: fabricCanvasRef.current,
        initializeCanvas,
        addImageToCanvas,
        removeSelectedObject,
        clearCanvas,
    };
};

export default useFabric;