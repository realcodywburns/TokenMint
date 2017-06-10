import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Form, FormGroup, ControlLabel, FormControl, Radio, Button } from 'react-bootstrap';
import { openWallet } from '../../store/walletActions';

class WalletForm extends React.Component {

  constructor(props) {
    super(props);
    this.openWallet = this.openWallet.bind(this);
    this.getRequiredValidation = this.getRequiredValidation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormat = this.handleFormat.bind(this);
    this.state = {
      privKey: '',
      showFileKey: false,
      showTextKey: false,
    };
  }

  openWallet() {
    this.props.openWallet(this.state.privKey);
  }

  getRequiredValidation(key) {
    if (this.state.key) return 'success';
    else return 'warning';
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleFormat(e) {
    if (e.target.value === "file") 
      this.setState({ showFileKey: true, showTextKey: false });
    else if (e.target.value === "text")
      this.setState({ showTextKey: true, showFileKey: false });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
          <h2>Access Your Wallet</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4}>
            <h4>Select the format of your private key.</h4>
            <Form>
              <FormGroup>
                <Radio name="keyFormat" value="file" onChange={this.handleFormat}>
                  JSON or Keystore File</Radio>
                <Radio name="keyFormat" value="text" onChange={this.handleFormat}>
                  Plain Text Private Key</Radio>
              </FormGroup>
            </Form>
          </Col>
          {this.state.showTextKey && <Col sm={12} md={4}>
            <h4>Paste / type your private key.</h4>
            <Form>
              <FormGroup
                controlId="privKey"
                validationState={this.getRequiredValidation('privKey')}
              >
                <FormControl
                  componentClass="textarea"
                  value={this.state.privKey}
                  placeholder="Private Key"
                  onChange={this.handleChange}
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
          </Col> }
          {this.state.showFileKey && <Col sm={12} md={4}>
            <h4>Select your wallet file:</h4>
          </Col>}
        </Row>
      </Grid>
    );
  }
}

const OpenWallet = connect(
  (state, ownProps) => {
    return {};
  },
  (dispatch, ownProps) => ({
    openWallet: (key) => {
      dispatch(openWallet(key));
    }
  })
)(WalletForm)

export default OpenWallet;
