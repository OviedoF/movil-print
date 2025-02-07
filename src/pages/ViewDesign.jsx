import React, { useEffect, useRef, useState } from 'react'
import { useDataContext } from '../context/data.context';
import { useParams } from 'react-router-dom';
import styles from './ViewDesign.module.scss';
import SceneElement from '../components/SceneElement';
import SceneTextElement from '../components/SceneText';
import ConfirmationModal from '../components/ConfirmationModal';
import defaultDesign from './defaultDesign';
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
  const [multiplierForCMS, setMultiplierForCMS] = useState({
    width: 1,
    height: 1
  });
  const [objectSelected, setObjectSelected] = useState(null);
  const id = useParams().id;
  const scene = useRef();
  const { enqueueSnackbar } = useSnackbar();
  console.log('Multiplier:', multiplierForCMS);

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

  const getMultiplierForCMS = () => {
    if (!scene.current || !template.width || !template.height) return;

    const sceneWidth = scene.current.offsetWidth; // PX
    const sceneHeight = scene.current.offsetHeight; // PX

    const templateWidthCM = template.width; // CM
    const templateHeightCM = template.height; // CM

    const templateWidthPX = templateWidthCM * 37.795276;
    const templateHeightPX = templateHeightCM * 37.795276;

    const multiplierWidth = templateWidthPX / sceneWidth;
    const multiplierHeight = templateHeightPX / sceneHeight;

    setMultiplierForCMS({
      width: multiplierWidth,
      height: multiplierHeight
    });
  };

  useEffect(() => {
    getDesign();
  }, []);

  useEffect(() => {
    if (template.width && template.height) {
      getMultiplierForCMS();

      document.documentElement.style.setProperty('--template-width', template.width);
      document.documentElement.style.setProperty('--template-height', template.height);
      document.documentElement.style.setProperty('--multiplier-width', multiplierForCMS.width);
      document.documentElement.style.setProperty('--multiplier-height', multiplierForCMS.height);
    }
  }, [template, multiplierForCMS]);

  return (
    <main>
      <button className={styles.print} onClick={() => window.print()}>
        Imprimir
      </button>

      <section className={
        `${styles.editor} ${!optionsActive && styles.full}`
      }>

        <img src={template.background} alt={template.name} className={styles.background} />

        <div className={styles.scene} ref={scene}>
          <img src={template.scene} alt={template.name} className={styles.sceneImage} id={styles.sceneBg} />

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