import React from 'react';
import { connect } from 'react-redux';
import { Well, Modal, Button } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export const CreateTxModal = (props) => {
    const { show, close, gas, changeGas, onGenerate, showTx } = props;
    const { rawTx, signedTx } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Create Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You are about to Create a token on the Ethereum Classic chain.</p>
            <FormGroup
              controlId="gasLimit"
            >
              <ControlLabel>Gas</ControlLabel>
              <FormControl
                type="number"
                value={gas}
                onChange={changeGas}
              />
            </FormGroup>
            <Button bsStyle="primary" onClick={onGenerate}>Generate Transaction</Button>
          </Modal.Body>
          {showTx && <Modal.Footer>
            <Well>{rawTx}</Well>  
            <Well>{signedTx}</Well>  
          </Modal.Footer>}
        </Modal>
    );
};