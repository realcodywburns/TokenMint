import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormGroup, FormControl } from 'react-bootstrap';
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
              <Form.Label>Gas</Form.Label>
              <FormControl
                type="number"
                defaultValue={gas}
                onChange={changeGas}
              />
            </FormGroup>
            <Button bsStyle="primary" onClick={onGenerate}>Generate Transaction</Button>
          </Modal.Body>}
          {showTx && <Modal.Body>
              <FormGroup>
                <Form.Label>Raw Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{rawTx}</Form.Text>  
              </FormGroup>
              <FormGroup>
                <Form.Label>Signed Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{signedTx}</Form.Text>
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
              <Form.Label>Gas</Form.Label>
              <FormControl
                type="number"
                defaultValue={gas}
                onChange={changeGas}
              />
            </FormGroup>
            <Button bsStyle="primary" onClick={onGenerate}>Generate Transaction</Button>
          </Modal.Body>}
          {showTx && <Modal.Body>
              <FormGroup>
                <Form.Label>Raw Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{rawTx}</Form.Text>  
              </FormGroup>
              <FormGroup>
                <Form.Label>Signed Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{signedTx}</Form.Text>
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
                <Form.Label>Raw Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{rawTx}</Form.Text>  
              </FormGroup>
              <FormGroup>
                <Form.Label>Signed Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{signedTx}</Form.Text>
              </FormGroup>
            <Button bsStyle="primary" onClick={submitTx}>Submit</Button> 
          </Modal.Body>}
        </Modal>
    );
};

export const SendTxModal = (props) => {
    const { show, close, showTx } = props;
    const { rawTx, signedTx, submitTx } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Send Transaction</Modal.Title>
          </Modal.Header>
          {showTx && <Modal.Body>
            <p>You are about to send {props.amount} {props.token} on the Ethereum Classic chain.</p>
          </Modal.Body>}
          {showTx && <Modal.Body>
              <FormGroup>
                <Form.Label>Raw Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{rawTx}</Form.Text>  
              </FormGroup>
              <FormGroup>
                <Form.Label>Signed Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{signedTx}</Form.Text>
              </FormGroup>
            <Button bsStyle="primary" onClick={submitTx}>Submit</Button> 
          </Modal.Body>}
        </Modal>
    );
};

export const RegisterTxModal = (props) => {
    const { show, close, gas, changeGas, onGenerate, showTx } = props;
    const { rawTx, signedTx, submitTx } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Create Transaction</Modal.Title>
          </Modal.Header>
          {!showTx && <Modal.Body>
            <p>You are about to register a token on the Ethereum Classic chain.</p>
            <FormGroup
              controlId="gasLimit"
            >
              <Form.Label>Gas</Form.Label>
              <FormControl
                type="number"
                defaultValue={gas}
                onChange={changeGas}
              />
            </FormGroup>
            <Button bsStyle="primary" onClick={onGenerate}>Generate Transaction</Button>
          </Modal.Body>}
          {showTx && <Modal.Body>
              <FormGroup>
                <Form.Label>Raw Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{rawTx}</Form.Text>  
              </FormGroup>
              <FormGroup>
                <Form.Label>Signed Transaction</Form.Label>
                <Form.Text bsSize="sm" style={code}>{signedTx}</Form.Text>
              </FormGroup>
            <Button bsStyle="primary" onClick={submitTx}>Submit</Button> 
          </Modal.Body>}
        </Modal>
    );
};

export const SuccessModal = (props) => {
    const { show, close } = props;
    const { hash } = props;

    return (
      <Modal show={show} onHide={close} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Your transaction has been submitted!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{props.children}</p>
            {hash && <p>View the status of your transaction: 
             <a href={`http://gastracker.io/tx/${hash}`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {hash}
                  </a></p>}
          </Modal.Body>
        </Modal>
    );
};