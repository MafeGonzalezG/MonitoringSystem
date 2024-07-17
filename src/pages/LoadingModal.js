import React from 'react';
import { Modal, Spinner } from 'react-bootstrap'; // Import Modal and Spinner from react-bootstrap
import './LoadingModal.css'; // Import the stylesheet LoadingModal.css
/**
 * A modal that displays a spinner.
 * @component
 * @param {object} props - The component props.
 * @param {boolean} props.show - A boolean that determines whether the modal is displayed.
 * @returns {JSX.Element} - The SpinnerModal component
 */	
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
