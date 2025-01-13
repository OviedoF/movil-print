import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import styles from './SceneElement.module.scss';
import { FaRotate, FaTrash } from 'react-icons/fa6';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useDataContext } from '../context/data.context';

export default function SceneTextElement({
    element,
    scene,
    design,
    designKey,
    setDesign,
    objectSelected,
    setObjectSelected,
    setOptionsActive
}) {
    const [position, setPosition] = useState({ x: element.x, y: element.y });
    const [size, setSize] = useState({ width: element.width, height: element.height });
    const [rotate, setRotate] = useState(element.rotation || 0);
    const [isRotating, setIsRotating] = useState(false);
    const {setTextForm} = useDataContext();
    const { enqueueSnackbar } = useSnackbar();
    const object = useRef();
    const rotator = useRef();

    useEffect(() => {
        if (rotator.current) {
            rotator.current.style.transform = `rotate(${rotate}deg)`;
        }
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
                        rotation: rotate,
                    };
                }
                return item;
            }),
        }));
    };

    const onDragStop = (e, data) => {
        if (scene.current) {
            setPosition({ x: data.x, y: data.y });
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
            ...design.items.map((t) => t.zIndex),
            ...design.texts.map((t) => t.zIndex)
        );

        setDesign((prev) => ({
            ...prev,
            [designKey]: prev[designKey].map((o) =>
                o.id === element.id ? { ...o, zIndex: newZIndex + 1 } : o
            ),
        }));

        enqueueSnackbar('Texto movido hacia adelante', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });
    };

    const handleZDown = () => {
        const newZIndex = Math.min(
            ...design.images.map((o) => o.zIndex),
            ...design.items.map((t) => t.zIndex),
            ...design.texts.map((t) => t.zIndex)
        );

        setDesign((prev) => ({
            ...prev,
            [designKey]: prev[designKey].map((o) =>
                o.id === element.id ? { ...o, zIndex: newZIndex - 1 } : o
            ),
        }));

        enqueueSnackbar('Texto movido hacia atrás', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });
    };

    const handleEdit = () => {
        setOptionsActive('text');
        setTextForm(element);
    }

    return (
        <Draggable
            position={position}
            bounds="parent"
            onStart={(e) => e.preventDefault()}
            onStop={onDragStop}
            cancel={`.${styles.actionButton}`}
        >
            <div
                ref={object}
                className={`${styles.sceneElement} ${objectSelected === element.id ? styles.selected : ''}`}
                style={{
                    width: 'auto',
                    height: 'auto',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    zIndex: element.zIndex || 100,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setObjectSelected(element.id);
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: element.color,
                        fontSize: `${element.size}px`,
                        fontFamily: element.font,
                        fontWeight: element.weight,
                        fontStyle: element.italic ? 'italic' : 'normal',
                        textDecoration: element.underline ? 'underline' : 'none',
                        transformOrigin: 'center',
                    }}
                    ref={rotator}
                >
                    {element.text}
                </div>

                {objectSelected === element.id && (
                    <>
                        <ul className={styles.options}>
                            <li
                                className={styles.actionButton}
                                style={{ cursor: 'grab' }}
                                onMouseDown={() => setIsRotating(true)}
                                onTouchStart={() => setIsRotating(true)}
                            >
                                <FaRotate color="#007bff" />
                            </li>
                            <li className={styles.actionButton} onClick={handleDelete}>
                                <FaTrash color="#dc3545" />
                            </li>
                            <li className={styles.actionButton} onClick={handleZUp}>
                                <FaChevronUp color="#007bff" />
                            </li>
                            <li className={styles.actionButton} onClick={handleZDown}>
                                <FaChevronDown color="#007bff" />
                            </li>
                            <li className={styles.actionButton} onClick={handleEdit}>
                                <FaEdit color="#007bff" />
                            </li>
                        </ul>
                    </>
                )}
            </div>
        </Draggable>
    );
}