import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import styles from './SceneElement.module.scss';
import { FaRotate, FaTrash } from 'react-icons/fa6';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSnackbar } from 'notistack';

export default function SceneElement({
    element,
    scene,
    design,
    designKey,
    setDesign,
    objectSelected,
    setObjectSelected,
}) {
    const [rotate, setRotate] = useState(element.rotation || 0);
    const [isRotating, setIsRotating] = useState(false);
    const [resizing, setResizing] = useState(null);
    const {enqueueSnackbar} = useSnackbar();
    const object = useRef();
    const rotator = useRef();
    const newSize = useRef({ width: element.width, height: element.height, x: element.x, y: element.y });


    useEffect(() => {
        if (rotator.current) {
            rotator.current.style.transform = `rotate(${rotate}deg)`;
        }

        window.addEventListener('click', (e) => {
            if (object.current && !object.current.contains(e.target)) {
                setObjectSelected(null);
            }
        });
    }, [rotate]);

    useEffect(() => {
        if (isRotating) {
            window.addEventListener('mousemove', handleMouseMovement);
            window.addEventListener('mouseup', objectRotationEnd);
            window.addEventListener('touchmove', handleMouseMovement);
            window.addEventListener('touchend', objectRotationEnd);

            return () => {
                window.removeEventListener('mousemove', handleMouseMovement);
                window.removeEventListener('mouseup', objectRotationEnd);
                window.removeEventListener('touchmove', handleMouseMovement);
                window.removeEventListener('touchend', objectRotationEnd);
            };
        }
    }, [isRotating]);

    const handleMouseMovement = (e) => {
        if (!scene.current) return;
        const rect = object.current.getBoundingClientRect();
        const sceneRect = scene.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        setRotate(angle + 90);
    };

    const objectRotationEnd = () => {
        setIsRotating(false);
        setDesign((prev) => ({
            ...prev,
            [designKey]: prev[designKey].map((item) => {
                if (item.id === element.id) {
                    return {
                        ...item,
                        rotate,
                    };
                }
                return item;
            }),
        }));
    };

    const handleResizeStart = (e, direction) => {
        e.stopPropagation();
        setResizing(direction);

        const startX = e.clientX || e.touches[0].clientX;
        const startY = e.clientY || e.touches[0].clientY;
        const startWidth = element.width;
        const startHeight = element.height;
        const startXPos = element.x;
        const startYPos = element.y;

        const sceneRect = scene.current.getBoundingClientRect();

        const onMouseMove = (e) => {
            const deltaX = (e.clientX || e.touches[0].clientX) - startX;
            const deltaY = (e.clientY || e.touches[0].clientY) - startY;
        
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newXPos = startXPos;
            let newYPos = startYPos;
        
            if (direction.includes('right')) {
                newWidth = Math.min(Math.max(startWidth + deltaX, 50), sceneRect.width - startXPos);
            }
            if (direction.includes('bottom')) {
                newHeight = Math.min(Math.max(startHeight + deltaY, 50), sceneRect.height - startYPos);
            }
            if (direction.includes('left')) {
                newWidth = Math.max(startWidth - deltaX, 50);
                newXPos = Math.max(startXPos + deltaX, 0);
            }
            if (direction.includes('top')) {
                newHeight = Math.max(startHeight - deltaY, 50);
                newYPos = Math.max(startYPos + deltaY, 0);
            }
        
            newSize.current = { width: newWidth, height: newHeight, x: newXPos, y: newYPos };
        
            setDesign((prev) => ({
                ...prev,
                [designKey]: prev[designKey].map((item) =>
                    item.id === element.id ? { ...item, width: newWidth, height: newHeight, x: newXPos, y: newYPos } : item
                ),
            }));
        };
        

        const onMouseUp = () => {
            setResizing(null);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onMouseMove);
            window.removeEventListener('touchend', onMouseUp);
        
            setDesign((prev) => ({
                ...prev,
                [designKey]: prev[designKey].map((item) =>
                    item.id === element.id ? { ...item, ...newSize.current } : item
                ),
            }));
        };
        

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('touchend', onMouseUp);
    };

    const onDragStop = (e, data) => {
        if (scene.current) {
            if (data.x === element.x && data.y === element.y) {
                return;
            }

            setDesign((prev) => ({
                ...prev,
                [designKey]: prev[designKey].map((item) => {
                    if (item.id === element.id) {
                        return {
                            ...item,
                            x: data.x,
                            y: data.y,
                        };
                    }
                    return item;
                }),
            }));
        }
    };

    const handleDelete = () => {
        setDesign((prev) => ({
            ...prev,
            [designKey]: prev[designKey].filter((item) => item.id !== element.id),
        }));
    };

    const handleZUp = () => {
        const newZIndex = Math.max(
            ...design.images.map((o) => o.zIndex),
            ...design.items.map((t) => t.zIndex)
        );
        
        setDesign((prev) => ({
            ...prev,
            [designKey]: prev[designKey].map((o) =>
                o.id === element.id ? { ...o, zIndex: newZIndex + 1 } : o
            ),
        }));

        enqueueSnackbar('Elemento movido hacia adelante', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });
    }

    const handleZDown = () => {
        const newZIndex = Math.min(
            ...design.images.map((o) => o.zIndex),
            ...design.items.map((t) => t.zIndex)
        );
        
        setDesign((prev) => ({
            ...prev,
            [designKey]: prev[designKey].map((o) =>
                o.id === element.id ? { ...o, zIndex: newZIndex - 1 } : o
            ),
        }));

        enqueueSnackbar('Elemento movido hacia atrás', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });
    }

    return (
        <Draggable
            position={{ x: element.x, y: element.y }}
            bounds="parent"
            onStart={(e) => e.preventDefault()}
            onStop={onDragStop}
            cancel={`.${styles.actionButton}, .${styles.resizeHandle}`}
        >
            <div
                ref={object}
                className={`${styles.sceneElement} ${objectSelected === element.id ? styles.selected : ''}`}
                style={{
                    width: element.width,
                    height: element.height,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translate(${element.x}px, ${element.y}px)`,
                    zIndex: element.zIndex || 100,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setObjectSelected(element.id);
                }}
                onTouchStart={(e) => {
                    e.stopPropagation();
                    setObjectSelected(element.id);
                }}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${rotate}deg)`,
                    transformOrigin: 'center',
                }} ref={rotator}>
                    <img
                        src={element.element}
                        className="object_img"
                        alt={element.element}
                        draggable="false"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                {objectSelected === element.id && (
                    <>
                        <ul className={styles.options}>
                            <li className={styles.actionButton} style={{
                                cursor: 'grab'
                            }} onMouseDown={() => setIsRotating(true)} onTouchStart={() => setIsRotating(true)}>
                                <FaRotate color='#007bff' />
                            </li>
                            <li className={styles.actionButton} onClick={handleDelete}>
                                <FaTrash color='#dc3545' />
                            </li>
                            <li className={styles.actionButton} onClick={handleZUp}>
                                <FaChevronUp color='#007bff' />   
                            </li>
                            <li className={styles.actionButton} onClick={handleZDown}>
                                <FaChevronDown color='#007bff' />
                            </li>
                        </ul>
                        <div className={`${styles.resizeHandle} ${styles.topLeft}`} onMouseDown={(e) => handleResizeStart(e, 'top-left')} onTouchStart={(e) => handleResizeStart(e, 'top-left')} />
                        <div className={`${styles.resizeHandle} ${styles.topRight}`} onMouseDown={(e) => handleResizeStart(e, 'top-right')} onTouchStart={(e) => handleResizeStart(e, 'top-right')} />
                        <div className={`${styles.resizeHandle} ${styles.bottomLeft}`} onMouseDown={(e) => handleResizeStart(e, 'bottom-left')} onTouchStart={(e) => handleResizeStart(e, 'bottom-left')} />
                        <div className={`${styles.resizeHandle} ${styles.bottomRight}`} onMouseDown={(e) => handleResizeStart(e, 'bottom-right')} onTouchStart={(e) => handleResizeStart(e, 'bottom-right')} />
                    </>
                )}
            </div>
        </Draggable>
    );
}

