import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function MyModal(props: any) {
  const { title, body, footer, isOpen, onClose, height } = props
  const [modalOpen, setModalOpen] = useState(isOpen)

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      size="lg"
      show={modalOpen}
      onHide={handleClose}
      centered
    >
      <Modal.Dialog className='m-0'>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{height: height, overflowY: "scroll"}} className='py-3'>
          {body}
        </Modal.Body>

        <Modal.Footer>
          {footer}
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
}

export default MyModal;