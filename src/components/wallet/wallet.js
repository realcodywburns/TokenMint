import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
//import { openWallet } from '../../store/walletActions';
import { Wallet } from '../../lib/wallet';

const WalletForm = React.createClass({
  getInitialState() {
    console.log(this.props)
    return {
      privKey: null
    };
  },

  openWallet() {
    this.props.openWallet(this.state.privKey);
  },

  getRequiredValidation(key) {
    if (this.state.key) return 'success';
    else return 'warning';
  },

  handleChange(e, key) {
    this.setState({ [e.target.id]: e.target.value });
  },

  render() {
    return (
      <Form>
        <FormGroup
          controlId="privKey"
          validationState={this.getRequiredValidation('privKey')}
        >
          <ControlLabel>Paste / type your private key</ControlLabel>
          <FormControl
            componentClass="textarea"
            value={this.state.privKey}
            placeholder="Private Key"
            onChange={(e) => this.handleChange(e,'privKey')}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup>
          <Button 
            bsStyle="primary"
            onClick={this.openWallet} >
            OPEN WALLET
          </Button>
        </FormGroup>

      </Form>
    );
  }
});

const OpenWallet = connect(
  (state, ownProps) => {
  },
  (dispatch, ownProps) => ({
    openWallet: (key) => {
      const wallet = new Wallet(key);
        console.log(wallet)
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
        });
    }
  })
)(WalletForm)

export default OpenWallet;
