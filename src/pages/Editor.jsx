import React, { useRef, useState } from 'react'
import { useDataContext } from '../context/data.context';
import { useParams } from 'react-router-dom';
import styles from './Editor.module.scss';
import EditorElements from '../components/EditorElements';
import SceneElement from '../components/SceneElement';
import Controls from '../components/Controls';
import SceneTextElement from '../components/SceneText';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Editor() {
  const [optionsActive, setOptionsActive] = useState(true);
  const [design, setDesign] = useState({
    items: [],
    images: [],
    texts: []
  });
  const [objectSelected, setObjectSelected] = useState(null);
  const { templates } = useDataContext()
  const name = useParams().name;
  console.log(design)
  const template = templates.find(template => template.name === name) || {};
  const scene = useRef();

  return (
    <main>
      <section className={
        `${styles.editor} ${!optionsActive && styles.full}`
      }>
        <Controls objectSelected={objectSelected} setObjectSelected={setObjectSelected} setDesign={setDesign} design={design} />

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

      <EditorElements
        active={optionsActive}
        setOptionsActive={setOptionsActive}
        optionsActive={optionsActive}
        template={template}
        design={design}
        setDesign={setDesign}
        scene={scene}
      />

      <ConfirmationModal />
    </main>
  )
}
