import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Panel, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import OpenWallet from '../wallet/open';
import { gotoTab } from '../../store/tabActions';

class LaunchForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.gotoToken = this.gotoToken.bind(this);
    this.state = {
      value: ''
    };
  }

  gotoToken() {
    this.props.gotoToken();
  }

  getValidationState() {
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
          <h4>Start your Crowdsale!</h4>
          </Col>
        </Row>
        {!this.props.wallet &&  <Row>
          <Col>
            <p>
              Did you already create a token? If not, 
              <Button onClick={this.gotoToken} bsStyle="info" bsSize="small">do that first</Button>
            </p><p>
              If you already have a token, unlock your wallet to start the ICO.
            </p>
            <hr />
              <Panel header="Please unlock your account to continue">
                  <OpenWallet />
              </Panel>
            
          </Col>
        </Row>}
        <Form>
          <FormGroup
            controlId="etherPrice"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Price per Token (in ether)</ControlLabel>
            <FormControl
              type="number"
              value={this.state.value}
              placeholder="1"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            controlId="fundingGoal"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Funding Goal (sale will end when goal is reached)</ControlLabel>
            <FormControl
              type="number"
              value={this.state.value}
              placeholder="100000000"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <FormControl.Static>
              BTC, EUR USD
            </FormControl.Static>
          </FormGroup>

          <FormGroup>
            <Button 
              bsStyle="primary"
              onClick={this.initIco} >
              START THE ICO
            </Button>
          </FormGroup>

        </Form>
      </Grid>
    );
  }
};


const LaunchIco = connect(
  (state, ownProps) => {
    return {}
  },
  (dispatch, ownProps) => ({
      gotoToken: () => 
        dispatch(gotoTab('token'))
  })
)(LaunchForm)

export default LaunchIco;
