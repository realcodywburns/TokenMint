import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

class TxModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal {...this.props} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Create Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to Create a token on the {this.props.chain} chain.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>No!</Button>
        </Modal.Footer>
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
    onHide: () => {
      console.log("Hide")
    }
  })
)(TxModal)

export default CreateTxModal;
