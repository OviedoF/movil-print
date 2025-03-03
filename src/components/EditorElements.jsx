import React, { useEffect, useState } from 'react'
import styles from './EditorElements.module.scss';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { v4 } from 'uuid';
import { useDataContext } from '../context/data.context';

const fonts = [
    'After Night', 'Against Refresh', 'Amastery Hand', 'Antonio Bold', 'Arizona Bold',
    'Artbrush', 'Athletic', 'GROBOLD', 'MJF Zhafira Demo', 'Papa Gnome', 'Spicy Rice Regular'
];

function Elements({ elements, design, setDesign, scene, objectKey }) {
    const handleAddElement = (element) => {
        setDesign({
            ...design,
            [objectKey]: [...design[objectKey], {
                element,
                x: scene.current.offsetWidth / 2 - 50,
                y: scene.current.offsetHeight / 2 - 50,
                width: 100,
                height: 100,
                rotation: 0,
                id: v4(),
                zIndex: design.images.length + design.items.length + design.texts.length + 100,
                type: objectKey
            }]
        })
    }

    return (
        <ul className={styles.elements}>
            {elements.map((element, index) => (
                <li key={index} onClick={() => handleAddElement(element)}>
                    <img src={element} alt={`Elemento ${index}`} />
                </li>
            ))}
        </ul>
    )
}

function Text({ design, setDesign, scene }) {
    const { enqueueSnackbar } = useSnackbar();
    const { textForm, setTextForm } = useDataContext();
    const [fontIndex, setFontIndex] = useState(fonts.indexOf(textForm.font) || 0);

    const editText = () => {
        setDesign({
            ...design,
            texts: design.texts.map(text => text.id === textForm.id ? textForm : text)
        });

        resetTextForm();
        enqueueSnackbar('Texto editado', { variant: 'success' });
    };

    const addText = () => {
        if (!textForm.text) return enqueueSnackbar('Debes escribir un texto', { variant: 'error' });
        if (textForm.id) return editText();

        setDesign({
            ...design,
            texts: [...design.texts, {
                ...textForm,
                x: scene.current.offsetWidth / 2 - 50,
                y: scene.current.offsetHeight / 2 - 50,
                width: 100,
                height: 30,
                rotation: 0,
                id: v4(),
                zIndex: design.images.length + design.items.length + design.texts.length + 100,
                type: 'texts'
            }]
        });

        resetTextForm();
        enqueueSnackbar('Texto agregado', { variant: 'success' });
    };

    const resetTextForm = () => {
        setTextForm({
            text: '',
            size: 12,
            color: '#fefefe',
            font: 'Arial',
            weight: 'normal',
            italic: false,
            underline: false,
        });
        setFontIndex(0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTextForm({ ...textForm, [name]: value });
    };

    const changeFont = (direction) => {
        let newIndex = (fontIndex + direction + fonts.length) % fonts.length;
        setFontIndex(newIndex);
        setTextForm({ ...textForm, font: fonts[newIndex] });
    };

    return (
        <form className={styles.text} onSubmit={(e) => e.preventDefault()}>
            <textarea name="text" value={textForm.text} onChange={handleChange} placeholder='Escribe tu texto' style={{
                fontSize: `${textForm.size}px`,
                color: textForm.color,
                fontFamily: textForm.font,
                fontWeight: textForm.weight,
                fontStyle: textForm.italic ? 'italic' : 'normal',
                textDecoration: textForm.underline ? 'underline' : 'none',
            }} />

            <div className={styles.controls}>
                <ul className={styles.settings}>
                    <li>
                        <label>Tamaño:</label>
                        <button type="button" onClick={() => setTextForm({ ...textForm, size: Math.max(1, textForm.size - 1) })}>-</button>
                        <input type="number" name="size" value={parseInt(textForm.size)} onChange={handleChange} />
                        <button type="button" onClick={() => setTextForm({ ...textForm, size: textForm.size + 1 })}>+</button>
                    </li>
                </ul>

                <ul className={styles.settings}>
                    <li>
                        <label>Fuente:</label>
                        <button type="button" onClick={() => changeFont(-1)}> {'<'} </button>
                        <span style={{
                            fontSize: '16px',
                            textAlign: 'center',
                        }}>{textForm.font}</span>
                        <button type="button" onClick={() => changeFont(1)}> {'>'} </button>
                    </li>
                </ul>

                <ul className={styles.design}>
                    <li>
                        <button type="button" onClick={() => setTextForm({ ...textForm, weight: textForm.weight === 'normal' ? 'bold' : 'normal' })} style={{
                            fontWeight: 'bold',
                            backgroundColor: textForm.weight === 'bold' ? '#777' : '#555'
                        }}>B</button>
                    </li>

                    <li>
                        <button type="button" onClick={() => setTextForm({ ...textForm, italic: !textForm.italic })} style={{
                            fontStyle: 'italic',
                            backgroundColor: textForm.italic ? '#777' : '#555'
                        }}>I</button>
                    </li>

                    <li>
                        <button type="button" onClick={() => setTextForm({ ...textForm, underline: !textForm.underline })} style={{
                            textDecoration: 'underline',
                            backgroundColor: textForm.underline ? '#777' : '#555'
                        }}>U</button>
                    </li>

                    <li>
                        <input type="color" name="color" value={textForm.color} onChange={handleChange} />
                    </li>
                </ul>

                <button className={styles.add} type="button" onClick={addText}>{textForm.id ? 'Editar' : 'Agregar'} texto</button>
            </div>
        </form>
    );
}

export default function EditorElements({ active, setOptionsActive, optionsActive, template, design, setDesign, scene }) {
    const [menuOpen, setMenuOpen] = useState('elements')
    const { setTextForm } = useDataContext()

    const toggleOptions = () => setOptionsActive(!optionsActive)

    const handleMenu = (menu) => setMenuOpen(menu)

    useEffect(() => {
        if (optionsActive === 'text') setMenuOpen('text')

        if (!optionsActive) setTextForm({
            text: '',
            size: 12,
            color: '#fefefe',
            font: 'Arial',
            weight: 'normal',
            italic: false,
            underline: false,
        })
    }, [optionsActive])

    if (template.name) return (
        <section className={
            `${styles.items} ${active ? styles.active : styles.inactive
            }`
        }>
            <button className={styles.toggle} onClick={toggleOptions}>
                {optionsActive ? <FaChevronDown size={16} /> : <FaChevronUp size={16} />}
            </button>

            {optionsActive && <>
                <ul className={styles.options}>
                    <li>
                        <button className={
                            `${menuOpen === 'elements' ? styles.active : ''} ${styles.option}`
                        } onClick={() => handleMenu('elements')}>
                            Elementos
                        </button>
                    </li>
                    <li>
                        <button className={
                            `${menuOpen === 'images' ? styles.active : ''} ${styles.option}`
                        } onClick={() => handleMenu('images')}>
                            Imágenes
                        </button>
                    </li>
                    <li>
                        <button className={
                            `${menuOpen === 'text' ? styles.active : ''} ${styles.option}`
                        } onClick={() => handleMenu('text')}>
                            Texto
                        </button>
                    </li>
                </ul>

                {menuOpen === 'elements' && <Elements
                    elements={template.shapes}
                    design={design}
                    setDesign={setDesign}
                    scene={scene}
                    objectKey={'items'}
                />}

                {menuOpen === 'images' && <Elements
                    elements={template.elements}
                    design={design}
                    setDesign={setDesign}
                    scene={scene}
                    objectKey={'images'}
                />}

                {menuOpen === 'text' && <Text
                    design={design}
                    setDesign={setDesign}
                    scene={scene}
                />}
            </>}
        </section>
    )
}
