import React from 'react';
import { connect } from 'react-redux';
import { Tab, Row, Col } from 'react-bootstrap';
import { Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
// import { FieldGroup } from 'elements/form';
import { generateTokenTransaction } from '../../store/tokenActions';

class CreateTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: 'POOP',
      decimals: 8
    };
  }

  getRequiredValidation(key) {
    if (this.state.key) return 'success';
    else return 'warning';
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  initToken() {
    this.props.initToken(this.state, this.props.wallet)
  }

  render() {
    return (
      <Form>
        <FormGroup
          controlId="token"
          validationState={this.getRequiredValidation('token')}
        >
          <ControlLabel>Token Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.token}
            placeholder="Scamcoin"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup
          controlId="totalSupply"
          validationState={this.getRequiredValidation('totalSupply')}
        >
          <ControlLabel>Total Supply</ControlLabel>
          <FormControl
            type="number"
            value={this.state.totalSupply}
            placeholder="1000000"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup
          controlId="symbol"
        >
          <ControlLabel>Token Symbol (optional)</ControlLabel>
          <FormControl
            type="text"
            value={this.state.symbol}
            placeholder="POOP"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup
          controlId="decimals"
        >
          <ControlLabel>Decimal Places (optional)</ControlLabel>
          <FormControl
            type="number"
            value={this.state.decimals}
            placeholder="8"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup>
          <Button 
            bsStyle="primary"
            onClick={this.initToken} >
            LET'S DO THIS
          </Button>
        </FormGroup>

      </Form>
    );
  }
};


const CreateToken = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet')
    }
  },
  (dispatch, ownProps) => ({
    initToken: (data, wallet) => {
      const confirmTx = (tx) => {
        console.log(tx);
      }
      const resolver = (resolve, f) => (x) => {
          f.apply(x);
          resolve(x);
      };
      return new Promise((resolve, reject) => {
        dispatch(
          generateTokenTransaction( data, wallet )
        ).then(resolver(confirmTx, resolve));
      })
    }
  })
)(CreateTokenForm)

export default CreateToken;
