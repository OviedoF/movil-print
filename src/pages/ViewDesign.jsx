import React, { useRef, useState } from 'react'
import { useDataContext } from '../context/data.context';
import { useParams } from 'react-router-dom';
import styles from './ViewDesign.module.scss';
import SceneElement from '../components/SceneElement';
import SceneTextElement from '../components/SceneText';
import ConfirmationModal from '../components/ConfirmationModal';
import defaultDesign from './defaultDesign';

export default function ViewDesign() {
  const [optionsActive, setOptionsActive] = useState(true);
  const [design, setDesign] = useState(defaultDesign);
  const [objectSelected, setObjectSelected] = useState(null);
  const { templates } = useDataContext()
  const name = useParams().name;
  console.log(design)
  const template = templates.find(template => template.name === name) || {};
  const scene = useRef();

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
          <img src={template.scene} alt={template.name} />

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
    </main>
  )
}