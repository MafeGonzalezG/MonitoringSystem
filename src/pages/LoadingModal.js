import React from 'react';
import { Modal, Spinner } from 'react-bootstrap'; // Import Modal and Spinner from react-bootstrap
import './LoadingModal.css'; // Import the stylesheet LoadingModal.css
const SpinnerModal = ({ show }) => {
  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="modal-content-transparent"
    >
      <Modal.Body className="text-center">
      <Spinner animation="border" variant="light" className="spinner-lg" />
      </Modal.Body>
    </Modal>
  );
};

export default SpinnerModal;
