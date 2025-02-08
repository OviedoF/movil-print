import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import styles from './ViewDesign.module.scss';
import SceneElement from '../components/SceneElement';
import SceneTextElement from '../components/SceneText';
import ConfirmationModal from '../components/ConfirmationModal';
import { makeQuery } from '../utils/api';
import { useSnackbar } from 'notistack';

export default function ViewDesign() {
  const [optionsActive, setOptionsActive] = useState(true);
  const [design, setDesign] = useState({
    items: [],
    images: [],
    texts: []
  });
  const [template, setTemplate] = useState({});
  const [objectSelected, setObjectSelected] = useState(null);
  const id = useParams().id;
  const scene = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const getDesign = () => {
    makeQuery(
      localStorage.getItem('token'),
      'getDesign',
      id,
      enqueueSnackbar,
      (data) => {
        setDesign(data);
        setTemplate(data.template)
      }
    )
  }

  useEffect(() => {
    getDesign();
  }, []);

  return (
    <main>
      <button className={styles.print} onClick={() => window.print()}>
        Imprimir
      </button>

      <section className={
        `${styles.editor} ${!optionsActive && styles.full}`
      }>

        <img src={template.background} alt={template.name} className={styles.background} />

        <div className={styles.scene} ref={scene} style={{
          width: `${template.width}cm`,
          height: `${template.height}cm`
        }}>

          {design.items.map((item, index) => <SceneElement
            key={index}
            element={item}
            scene={scene}
            design={design}
            designKey="items"
            setDesign={setDesign}
            objectSelected={objectSelected}
            setObjectSelected={setObjectSelected}
          />)}

          {design.images.map((image, index) => <SceneElement
            key={index}
            element={image}
            scene={scene}
            design={design}
            designKey="images"
            setDesign={setDesign}
            objectSelected={objectSelected}
            setObjectSelected={setObjectSelected}
          />)}

          {design.texts.map((text, index) => <SceneTextElement
            key={index}
            element={text}
            scene={scene}
            design={design}
            designKey="texts"
            setDesign={setDesign}
            objectSelected={objectSelected}
            setObjectSelected={setObjectSelected}
            setOptionsActive={setOptionsActive}
          />)}
        </div>
      </section>

      <ConfirmationModal />

      <style jsx>
        {`
          
          @media print {
            .${styles.print} {
              display: none;
            }

            .${styles.background} {
              display: none;
            }
              
            .${styles.editor} .${styles.scene} {
              border: none;
            }
            
            .${styles.sceneImage} {
              opacity: 0;
            }

            .${styles.scene} {
              width: calc(var(--template-width) * 1cm);
              height: calc(var(--template-height) * 1cm);
              transform: scale(var(--multiplier-width), var(--multiplier-height));
              transform-origin: top left;
            }
          }
        `}
      </style>
    </main>
  )
}