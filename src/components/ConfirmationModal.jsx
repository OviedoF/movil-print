import React from 'react';
import styles from './ConfirmationModal.module.scss';
import { useDataContext } from '../context/data.context';

const ConfirmationModal = ({
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  children
}) => {
  const { confirmationModal, setConfirmationModal } = useDataContext();
  console.log(confirmationModal);

  const closeModal = () => setConfirmationModal({
    isOpen: false,
    title: '',
    message: '',
    handleConfirm: () => { }
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

            <form className={styles.modalForm} onSubmit={onConfirm}>
              {children && children}

              <div className={styles.modalActions}>
                <button className={styles.cancelButton} onClick={closeModal} type='button'>{cancelText}</button>
                <button className={styles.confirmButton} type='submit'>{confirmText}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;