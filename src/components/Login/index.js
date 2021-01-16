import React, { useState, useMemo, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Row, Col, Form, Button } from "react-bootstrap";

import ForgetPassword from "../ForgetPassword";

import "./style.css";

/**
 * Websocket URL is stored in a .env file
 */
const socketUrl = process.env.REACT_APP_WS_URL;
export default function LoginPage() {
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, updateFormData] = useState({
    userName: "",
    password: "",
  });
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  /**
   * This useEffect will be called only once component
   * is mounted to the page, it means that the `sendJsonMessage`
   * only get called once and we don't subscribe on a topic
   * multiple times
   */
  useEffect(() => {
    sendJsonMessage({ topic: "subscribe", to: "EURUSD:CUR" });
  }, []);

  const handleChange = (e) => {
    const element = e.target;
    const value = element.value;
    const { name } = element;
    return updateFormData({ ...formData, [name]: value });
  };

  /**
   * This will act as a computed propery which keeps
   * updated with any changes in the form
   */
  const isFormValid = useMemo(
    () => formData.userName !== "" && formData.password !== "",
    [formData.userName, formData.password]
  );

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        setIsLoading(true);
        /**
         * There should be an endpoint on server side
         * to handle login functionality, but since
         * there is no backend, I just called to an artificial
         * endpoint /login
         */
        const response = await fetch("/login", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        await response.json();
        // navigate to dashboard if login was successful
      } catch (err) {
        throw new Error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Row className="h-100 login-wrapper">
      <Col className="h-100">
        <div className="h-100 d-flex">
          <div className="login-box">
            <div className="login">
              <div className="input-wrapper">
                <Form.Group>
                  <div className="group">
                    <Form.Label className="label">Username</Form.Label>
                    <Form.Control
                      name="userName"
                      type="text"
                      className="input"
                      placeholder="Enter your username"
                      onInput={handleChange}
                    />
                  </div>
                  <div className="group">
                    <Form.Label className="label">Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      className="input"
                      placeholder="Enter your password"
                      onInput={handleChange}
                    />
                  </div>
                </Form.Group>
                <div className="group">
                  <Button
                    className="button"
                    type="submit"
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                  >
                    {isLoading ? "Loading…" : "Sign In"}
                  </Button>
                </div>
                <div className="hr"></div>
                <div className="foot">
                  <Row>
                    <Col>
                      <Button variant="link" onClick={() => setModalShow(true)}>
                        Forgot Password?
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-50">
                    <Col xs={1}>
                      <div className={`circle mt-1 ${connectionStatus}`}></div>
                    </Col>
                    <Col>
                      <p className="last-detail">
                        timestamp
                        <span>
                          {lastJsonMessage && lastJsonMessage.dt
                            ? new Date(lastJsonMessage.dt).toLocaleString()
                            : "..."}
                        </span>
                      </p>
                    </Col>
                    <Col>
                      <p className="last-detail">
                        price
                        <span>
                          {(lastJsonMessage && lastJsonMessage.price) || "..."}
                        </span>
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ForgetPassword show={modalShow} onHide={() => setModalShow(false)} />
      </Col>
    </Row>
  );
}
