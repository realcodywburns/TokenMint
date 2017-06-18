import React from 'react';
import { Well, Modal, Button } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { code } from '../../lib/styles';

export const CreateTxModal = (props) => {
    const { show, close, gas, changeGas, onGenerate, showTx } = props;
    const { rawTx, signedTx, submitTx } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Create Transaction</Modal.Title>
          </Modal.Header>
          {!showTx && <Modal.Body>
            <p>You are about to create a token on the Ethereum Classic chain.</p>
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
          </Modal.Body>}
          {showTx && <Modal.Body>
              <FormGroup>
                <ControlLabel>Raw Transaction</ControlLabel>
                <Well bsSize="sm" style={code}>{rawTx}</Well>  
              </FormGroup>
              <FormGroup>
                <ControlLabel>Signed Transaction</ControlLabel>
                <Well bsSize="sm" style={code}>{signedTx}</Well>
              </FormGroup>
            <Button bsStyle="primary" onClick={submitTx}>Submit</Button> 
          </Modal.Body>}
        </Modal>
    );
};

export const LaunchICOModal = (props) => {
    const { show, close, gas, changeGas, onGenerate, showTx } = props;
    const { rawTx, signedTx, submitTx } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Create Transaction</Modal.Title>
          </Modal.Header>
          {!showTx && <Modal.Body>
            <p>You are about to launch a crowdsale on the Ethereum Classic chain.</p>
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
          </Modal.Body>}
          {showTx && <Modal.Body>
              <FormGroup>
                <ControlLabel>Raw Transaction</ControlLabel>
                <Well bsSize="sm" style={code}>{rawTx}</Well>  
              </FormGroup>
              <FormGroup>
                <ControlLabel>Signed Transaction</ControlLabel>
                <Well bsSize="sm" style={code}>{signedTx}</Well>
              </FormGroup>
            <Button bsStyle="primary" onClick={submitTx}>Submit</Button> 
          </Modal.Body>}
        </Modal>
    );
};

export const BuyTokenModal = (props) => {
    const { show, close, showTx } = props;
    const { rawTx, signedTx, submitTx } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Buy Tokens</Modal.Title>
          </Modal.Header>
          {showTx && <Modal.Body>
            <p>You are about to buy {props.token} tokens on the Ethereum Classic chain.</p>
          </Modal.Body>}
          {showTx && <Modal.Body>
              <FormGroup>
                <ControlLabel>Raw Transaction</ControlLabel>
                <Well bsSize="sm" style={code}>{rawTx}</Well>  
              </FormGroup>
              <FormGroup>
                <ControlLabel>Signed Transaction</ControlLabel>
                <Well bsSize="sm" style={code}>{signedTx}</Well>
              </FormGroup>
            <Button bsStyle="primary" onClick={submitTx}>Submit</Button> 
          </Modal.Body>}
        </Modal>
    );
};

export const SuccessModal = (props) => {
    const { show, close } = props;
    const { txHash } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Your transaction has been submitted!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {txHash && <p>View the status of your transaction: 
             <a href={`"http://gastracker.io/tx/${txHash}"`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {txHash}
                  </a></p>}
          </Modal.Body>
        </Modal>
    );
};