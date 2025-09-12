import React, { useState, useEffect } from 'react';
import styles from './TemplateManager.module.scss';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDataContext } from '../context/data.context';
import { useNavigate } from 'react-router-dom';
import { makeQuery } from '../utils/api';
import { useSnackbar } from 'notistack';
import ReplaceOnLoading from '../utils/ReplaceOnLoading';

const TemplateManager = () => {
  const { templates, setTemplates } = useDataContext();
  const [currentTemplate, setCurrentTemplate] = useState({
    name: '',
    scene: '',
    width: 0,
    height: 0,
    background: '',
    elements: [],
    shapes: []
  });
  const [images, setImages] = useState({
    scene: '',
    background: '',
    elements: [],
    shapes: []
  });
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
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
        setImages(prev => ({
          ...prev,
          [field]: e.target.files[0]
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

      setImages(prev => ({
        ...prev,
        [field]: files
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if(currentTemplate.name) formData.append('name', currentTemplate.name.trim());
    if(currentTemplate.width) formData.append('width', currentTemplate.width.trim());
    if(currentTemplate.height) formData.append('height', currentTemplate.height.trim());
    if(images.background) formData.append('background', images.background);
    images.elements.forEach((obj, index) => {
      formData.append(`elements`, obj);
    });
    images.shapes.forEach((shape, index) => {
      formData.append(`shapes`, shape);
    });

    if (!isEditing) {
      makeQuery(
        localStorage.getItem('token'),
        'createTemplate',
        formData,
        enqueueSnackbar,
        (res) => {
          enqueueSnackbar('Template creado correctamente', { variant: 'success' });
          setTemplates([...templates, res]);
          setCurrentTemplate({
            name: '',
            scene: '',
            width: 0,
            height: 0,
            background: '',
            elements: [],
            shapes: []
          });
          setIsEditing(false);
        },
        setLoading
      )
    } else {
      makeQuery(
        localStorage.getItem('token'),
        'editTemplate',
        {
          form: formData,
          id: currentTemplate._id
        },
        enqueueSnackbar,
        (res) => {
          enqueueSnackbar('Template actualizado correctamente', { variant: 'success' });
          setTemplates(templates.map(t => t._id === res._id ? res : t));
          setCurrentTemplate({
            name: '',
            scene: '',
            width: 0,
            height: 0,
            background: '',
            elements: [],
            shapes: []
          });
          setIsEditing(false);
        },
        setLoading
      )
    }
  };

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    makeQuery(
      localStorage.getItem('token'),
      'deleteTemplate',
      id,
      enqueueSnackbar,
      (res) => {
        enqueueSnackbar('Template eliminado correctamente', { variant: 'success' });
        setTemplates(templates.filter(t => t._id !== id));
      },
      setLoading
    );
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <ReplaceOnLoading loading={loading}>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        Ir a templates
      </button>

      <div className={styles.templateManager}>
        <h1>Gestor de Templates</h1>

        <table className={styles.templateTable}>
          <thead>
            <tr>
              <th>Nombre</th>
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
                <td>
                  `${template.width} x ${template.height} cm`
                </td>
                <td><img src={template.background} alt="Background" className={styles.previewImage} /></td>
                <td>{template.elements.length} objetos</td>
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

          <div className={styles.dimensionsGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="width">Ancho (cm):</label>
              <input
                type="number"
                id="width"
                min="0"
                step="0.1"
                value={currentTemplate.width || ''}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, width: e.target.value })}
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
                value={currentTemplate.height || ''}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, height: e.target.value })}
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
            <label htmlFor="elements">Objetos:</label>
            <input
              type="file"
              id="elements"
              onChange={(e) => handleMultipleFileChange(e, 'elements')}
              accept="image/*"
              multiple
            />
            <div className={styles.previewContainer}>
              {currentTemplate?.elements?.map((obj, index) => (
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
    </ReplaceOnLoading>
  );
};

export default TemplateManager;

