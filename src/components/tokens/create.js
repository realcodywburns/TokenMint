import React from 'react';
import { connect } from 'react-redux';
import { Tab, Row, Col } from 'react-bootstrap';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button } from 'react-bootstrap';

const CreateToken = React.createClass({
  getInitialState() {
    return {
      symbol: 'POOP',
      decimals: 8
    };
  },

  initToken() {

  },

  getRequiredValidation(key) {
    if (this.state.key) return 'success';
    else return 'warning';
  },

  handleChange(e, key) {
    this.setState({ key: e.target.value });
  },

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
            onChange={(e) => this.handleChange(e,'token')}
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
            onChange={(e) => this.handleChange(e, 'totalSupply')}
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
            onChange={(e) => this.handleChange(e, 'symbol')}
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
            onChange={(e) => this.handleChange(e, 'decimals')}
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
});




export default CreateToken;
