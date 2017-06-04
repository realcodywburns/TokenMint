import React from 'react';
import { connect } from 'react-redux';
import { Tab, Row, Col } from 'react-bootstrap';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button } from 'react-bootstrap';

const CreateToken = React.createClass({
  getInitialState() {
    return {
      value: ''
    };
  },

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  },

  handleChange(e) {
    this.setState({ value: e.target.value });
  },

  render() {
    return (
      <Form>
        <FormGroup
          controlId="token"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Token Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Scamcoin"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Required.</HelpBlock>
        </FormGroup>

        <FormGroup
          controlId="totalSupply"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Total Supply</ControlLabel>
          <FormControl
            type="number"
            value={this.state.value}
            placeholder="1000000"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Required.</HelpBlock>
        </FormGroup>

        <FormGroup
          controlId="symbol"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Token Symbol (optional)</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="POOP"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup
          controlId="decimals"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Decimal Places (optional)</ControlLabel>
          <FormControl
            type="number"
            value={this.state.value}
            placeholder="8"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup>
          <Button 
            bsStyle="primary"
            onClick={this.initTokn} >
            LET'S DO THIS
          </Button>
        </FormGroup>

      </Form>
    );
  }
});




export default CreateToken;
