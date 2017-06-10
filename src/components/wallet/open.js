import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { Grid, Row, Col } from 'react-bootstrap';
import { Form, FormGroup, ControlLabel, FormControl, Radio, Button, Glyphicon } from 'react-bootstrap';
import { openWallet } from '../../store/walletActions';
import { Wallet } from '../../lib/wallet';

class WalletForm extends React.Component {

  constructor(props) {
    super(props);
    this.openWallet = this.openWallet.bind(this);
    this.handlePrivKey = this.handlePrivKey.bind(this);
    this.handleFormat = this.handleFormat.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = {
      privKey: '',
      showFileKey: false,
      showTextKey: false,
      showAccessButton: false,
      showRequirePass: false,
      file: null,
    };
  }

  openWallet() {
    this.props.openWallet(this.state.privKey);
  }

  handlePrivKey(e) {
    this.setState({ showAccessButton: false });
    this.setState({ [e.target.id]: e.target.value });
    if (e.target.value.length === 64) 
      this.setState({ showAccessButton: true });
    else if (e.target.value.length === 128 || e.target.value.length === 132) 
      this.setState({ showRequirePass: true });
  }

  handleFormat(e) {
    if (e.target.value === "file") 
      this.setState({ showFileKey: true, showTextKey: false });
    else if (e.target.value === "text")
      this.setState({ showTextKey: true, showFileKey: false });
  }

  onDrop(acceptedFiles, rejectedFiles) {
        const reader = new FileReader();
        reader.readAsText(acceptedFiles[0]);
        this.setState({ file: acceptedFiles[0].name });
        reader.onload = (e) => {
          console.log(e.target.result)
          try {
              const pw = Wallet.walletRequirePass(e.target.result);
              this.setState({ showRequirePass: pw });
          } catch (e) {
              console.error(e)
          }
        };
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
              >
                <FormControl
                  componentClass="textarea"
                  placeholder="Private Key"
                  onChange={this.handlePrivKey}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Form>
          </Col> }
          {this.state.showFileKey && <Col sm={12} md={4}>
            <h4>Select your wallet file:</h4>
            <Dropzone style={{}} multiple={false} onDrop={this.onDrop}>
            <Button bsStyle="default">Click Me! <Glyphicon glyph="open-file" /></Button>
            </Dropzone>
            {this.state.file && <div>File Selected: {this.state.file}</div>} 
            
          </Col>}
          {this.state.showRequirePass && <div> Your file is encrypted. Please enter the password:</div>}
          {this.state.showAccessButton && <Col sm={12} md={4}>
            <h4>Access Your Wallet:</h4>
            <Button 
              bsStyle="primary" 
              onClick={this.openWallet}>
              OPEN WALLET
            </Button>
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
