import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Collapse } from 'react-bootstrap';

class TxModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRaw: false
    };    
  }

  render() {
    return (
      <Modal bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Create Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to Create a token on the {this.props.chain} chain.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onGenerate}>Generate Transaction</Button>
          <Button onClick={this.props.onHide}>No!</Button>
        </Modal.Footer>

        <Collapse in={this.state.showRaw}>
          raw transaction here
        </Collapse>
      </Modal>
    );
  }
};

const CreateTxModal = connect(
  (state, ownProps) => {
    return {
      chain: "Ethereum Classic"
    }
  },
  (dispatch, ownProps) => ({
    onGenerate: () => {
      console.log("Generate Transaction")
    }
  })
)(TxModal)

export default CreateTxModal;
