import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

import "./style.css";
export default function ForgetPassword(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Button className="close" variant="link" onClick={props.onHide} />

      <Modal.Body>
        <div className="forget-pass-box mt-50">
          <h3>Reset password</h3>
          <p>Enter your email address to get reset instructions sent to you.</p>
          <Form.Group>
            <div className="group">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                id="email"
                type="text"
                className="input"
                placeholder="Enter your email"
              />
            </div>
          </Form.Group>
          <div className="group">
            <Button className="button" type="submit">
              submit
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
