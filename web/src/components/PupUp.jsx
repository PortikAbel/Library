import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function PopUp(info) {
    const [show, setShow] = useState(true);
  
    const handleClose = () => setShow(false);
  
    return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{info}</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        </Modal.Footer>
    </Modal>
    );
  }