import { createContext, useContext, useEffect, useState } from "react";
import { makeQuery } from "../../src/utils/api";
import { enqueueSnackbar } from "notistack";

export const dataContext = createContext({});

export default function DataContext({ children = null }) {
    const [templates, setTemplates] = useState([]);
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

    const getTemplates = () => {
        makeQuery(
            localStorage.getItem('token'),
            'getTemplates',
            null,
            enqueueSnackbar,
            (data) => setTemplates(data),
            null,
        )
    }

    useEffect (() => {
        getTemplates();
    }, []);

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