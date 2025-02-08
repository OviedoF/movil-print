import React, { useState } from 'react';
import { useDataContext } from '../context/data.context';
import styles from './TemplateSelect.module.scss';
import { Link } from 'react-router-dom';

export default function TemplateSelect() {
    const { templates } = useDataContext();

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Selecciona una plantilla</h1>
            <section className={styles.templateGrid}>
                {templates.map(template => (
                    <Link
                        to={`/editor/${template.name}`}
                        key={template._id}
                        className={`${styles.templateCard}`}
                        style={{ backgroundImage: `url(${template.background})` }}
                        onClick={() => setSelectedTemplate(template._id)}
                    >
                        <div className={styles.templateInfo}>
                            <h2 className={styles.templateName}>{template.name}</h2>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}
