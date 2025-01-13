import React from 'react';
import styles from './ConfirmationModal.module.scss';
import {useDataContext} from '../context/data.context';

const ConfirmationModal = ({
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  const { confirmationModal, setConfirmationModal } = useDataContext();

  const closeModal = () => setConfirmationModal({
    isOpen: false,
    title: '',
    message: '',
    handleConfirm: () => {}
  });

  const onConfirm = () => {
    confirmationModal.handleConfirm();
    closeModal();
  };

  return (
    <>
      {confirmationModal.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{confirmationModal.title}</h2>
            <p className={styles.modalMessage}>{confirmationModal.message}</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>{cancelText}</button>
              <button className={styles.confirmButton} onClick={onConfirm}>{confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;