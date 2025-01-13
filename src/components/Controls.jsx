import React, { useState } from 'react'
import styles from './Controls.module.scss';
import { FaCopy, FaFile, FaPaste } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { v4 } from 'uuid';
import { useDataContext } from '../context/data.context';

export default function Controls({
    objectSelected,
    setObjectSelected,
    design,
    setDesign,
}) {
    const [copied, setCopied] = useState(null);
    const { setConfirmationModal } = useDataContext();
    const { enqueueSnackbar } = useSnackbar();

    const handleCopy = () => {
        if (objectSelected) {
            const element = [...design.texts, ...design.images, ...design.items].find(item => item.id === objectSelected);

            if (!element) return;

            setCopied(element);
            enqueueSnackbar('Elemento copiado', { variant: 'success' });
        }

        if (!objectSelected) {
            enqueueSnackbar('Selecciona un elemento para copiar', { variant: 'error' });
        }
    }

    const handlePaste = () => {
        if (copied) {
            const id = v4();
            setDesign(prev => {
                const key = copied.type;
                return {
                    ...prev, [key]: [...prev[key], {
                        ...copied,
                        id,
                        x: copied.x + 10,
                        y: copied.y + 10,
                        zIndex: design.items.length + design.images.length + design.texts.length + 100
                    }]
                };
            });

            setObjectSelected(id);

            enqueueSnackbar('Elemento pegado', { variant: 'success' });
        }

        if (!copied) {
            enqueueSnackbar('No hay elementos para pegar', { variant: 'error' });
        }
    }

    const handleClear = () => {
        setConfirmationModal({
            isOpen: true,
            title: 'Eliminar todos los elementos',
            message: '¿Estás seguro de eliminar todos los elementos?',
            handleConfirm: () => {
                setDesign({
                    texts: [],
                    images: [],
                    items: []
                });
                setObjectSelected(null);
                enqueueSnackbar('Elementos eliminados', { variant: 'success' });
            }
        });
    }

    const handleSend = () => {
        setConfirmationModal({
            isOpen: true,
            title: 'Enviar diseño',
            message: '¿Estás seguro de enviar el diseño?',
            handleConfirm: () => {
                setDesign({
                    texts: [],
                    images: [],
                    items: []
                });
                setObjectSelected(null);
                enqueueSnackbar('Diseño enviado', { variant: 'success' });
            }
        });
    }

    return (
        <>
            <ul className={styles.controls}>
                <li>
                    <button onClick={handleCopy}>
                        <FaCopy color='#007bff' />
                    </button>
                </li>

                <li>
                    <button onClick={handlePaste}>
                        <FaPaste color='#007bff' />
                    </button>
                </li>

                <li>
                    <button onClick={handleClear}>
                        <FaFile color='#007bff' />
                    </button>
                </li>
            </ul>

            <button className={styles.send} onClick={handleSend}>
                Enviar diseño
            </button>
        </>
    )
}
