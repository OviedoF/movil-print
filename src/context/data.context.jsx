import { createContext, useContext, useState } from "react";

export const dataContext = createContext({});

const defaultTemplates = [
    {
        _id: 1,
        name: 'Template 1',
        scene: '/mocks/bolsa.png',
        background: '/mocks/palmeras_fondo.jpg',
        objects: [
            '/mocks/palmeras_1.webp',
            '/mocks/palmeras_2.png',
            '/mocks/palmeras_3.webp',
        ],
        sceneDimensions: { width: 25, height: 25 },
        shapes: [
            '/mocks/forma1.webp',
            '/mocks/forma2.webp',
            '/mocks/forma3.webp',
            '/mocks/forma4.png',
        ],
    }
];

export default function DataContext({ children = null }) {
    const [templates, setTemplates] = useState(defaultTemplates);
    const [textForm, setTextForm] = useState({
        text: '',
        size: 12,
        color: '#fefefe',
        font: 'Arial',
        weight: 'normal',
        italic: false,
        underline: false,
    });
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        handleConfirm: () => { }
    });

    return (
        <dataContext.Provider value={{
            templates,
            setTemplates,
            textForm,
            setTextForm,
            confirmationModal,
            setConfirmationModal
        }}>
            {children}
        </dataContext.Provider>
    );
}

export const useDataContext = () => useContext(dataContext);