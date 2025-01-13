import React, { useState, useEffect } from 'react';
import styles from './TemplateManager.module.scss';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDataContext } from '../context/data.context';
import { useNavigate } from 'react-router-dom';

const TemplateManager = () => {
  const { templates, setTemplates } = useDataContext();
  const [currentTemplate, setCurrentTemplate] = useState({
    name: '',
    scene: '',
    sceneDimensions: { width: 0, height: 0 },
    background: '',
    objects: [],
    shapes: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentTemplate(prev => ({
          ...prev,
          [field]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(results => {
      setCurrentTemplate(prev => ({
        ...prev,
        [field]: results
      }));
    });
  };

  const handleDimensionChange = (dimension, value) => {
    setCurrentTemplate(prev => ({
      ...prev,
      sceneDimensions: {
        ...prev.sceneDimensions,
        [dimension]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateToSave = {
      ...currentTemplate,
      sceneDimensions: currentTemplate.sceneDimensions || { width: 0, height: 0 }
    };
    if (isEditing) {
      setTemplates(templates.map(t => t._id === templateToSave._id ? templateToSave : t));
    } else {
      setTemplates([...templates, { ...templateToSave, _id: Date.now() }]);
    }
    setCurrentTemplate({
      name: '',
      scene: '',
      sceneDimensions: { width: 0, height: 0 },
      background: '',
      objects: [],
      shapes: []
    });
    setIsEditing(false);
  };

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t._id !== id));
  };

  return (
    <>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        Ir a templates
      </button>

      <div className={styles.templateManager}>
        <h1>Gestor de Templates</h1>

        <table className={styles.templateTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Escena</th>
              <th>Medidas (cm)</th>
              <th>Fondo</th>
              <th>Objetos</th>
              <th>Formas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(template => (
              <tr key={template._id}>
                <td>{template.name}</td>
                <td><img src={template.scene} alt="Scene" className={styles.previewImage} /></td>
                <td>
                  {template.sceneDimensions ?
                    `${template.sceneDimensions.width} x ${template.sceneDimensions.height} cm` :
                    'N/A'}
                </td>
                <td><img src={template.background} alt="Background" className={styles.previewImage} /></td>
                <td>{template.objects.length} objetos</td>
                <td>{template.shapes.length} formas</td>
                <td>
                  <button onClick={() => handleEdit(template)} className={styles.editButton}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(template._id)} className={styles.deleteButton}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>{isEditing ? 'Editar Template' : 'Crear Nuevo Template'}</h2>
        <form onSubmit={handleSubmit} className={styles.templateForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              value={currentTemplate?.name || ''}
              onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="scene">Escena:</label>
            <input
              type="file"
              id="scene"
              onChange={(e) => handleFileChange(e, 'scene')}
              accept="image/*"
            />
            {currentTemplate?.scene && (
              <img src={currentTemplate.scene} alt="Scene Preview" className={styles.previewImage} />
            )}
          </div>

          <div className={styles.dimensionsGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="width">Ancho (cm):</label>
              <input
                type="number"
                id="width"
                min="0"
                step="0.1"
                value={currentTemplate.sceneDimensions?.width || ''}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="height">Alto (cm):</label>
              <input
                type="number"
                id="height"
                min="0"
                step="0.1"
                value={currentTemplate.sceneDimensions?.height || ''}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="background">Fondo:</label>
            <input
              type="file"
              id="background"
              onChange={(e) => handleFileChange(e, 'background')}
              accept="image/*"
            />
            {currentTemplate?.background && (
              <img src={currentTemplate.background} alt="Background Preview" className={styles.previewImage} />
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="objects">Objetos:</label>
            <input
              type="file"
              id="objects"
              onChange={(e) => handleMultipleFileChange(e, 'objects')}
              accept="image/*"
              multiple
            />
            <div className={styles.previewContainer}>
              {currentTemplate?.objects?.map((obj, index) => (
                <img key={index} src={obj} alt={`Object ${index + 1}`} className={styles.previewImage} />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shapes">Formas:</label>
            <input
              type="file"
              id="shapes"
              onChange={(e) => handleMultipleFileChange(e, 'shapes')}
              accept="image/*"
              multiple
            />
            <div className={styles.previewContainer}>
              {currentTemplate?.shapes?.map((shape, index) => (
                <img key={index} src={shape} alt={`Shape ${index + 1}`} className={styles.previewImage} />
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Actualizar Template' : 'Crear Template'}
          </button>
        </form>
      </div>
    </>
  );
};

export default TemplateManager;

