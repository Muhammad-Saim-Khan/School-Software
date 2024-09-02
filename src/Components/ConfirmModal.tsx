import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function ConfirmModal(props: any) {
    const { title, body, isOpen, onClose, icon } = props
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
            show={modalOpen}
            onHide={handleClose}
            centered
        >
            <Modal.Dialog className='m-0'>
                <Modal.Header className='border-0'>
                    <Modal.Title className='d-flex flex-column px-2 text-center'>
                        <div>
                            {icon}
                        </div>
                        <div>
                            {title}
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className='pb-3 pt-0 mb-3 text-center'>
                    {body}
                </Modal.Body>
            </Modal.Dialog>
        </Modal>
    );
}

export default ConfirmModal;