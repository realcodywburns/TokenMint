import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { Row, Col, Panel, Alert } from 'react-bootstrap';
import { Form, FormGroup, FormControl, Radio, Button } from 'react-bootstrap';
import { openWallet, openWalletFile } from '../../store/walletActions';
import { Wallet } from '../../lib/wallet';
import ShowWallet from './show';
import SendWallet from './send';

class WalletForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      privKey: '',
      showFileKey: false,
      showTextKey: false,
      showAccessButton: false,
      showRequirePass: false,
      showBalance: false,
      file: null,
      password: null,
      error: null,
    };
  }

  resetState = () => {
    this.setState({
      error: null,
      file: null,
      password: null,
      showBalance: false,
      showRequirePass: false,
      showAccessButton: false,
    });
  }

  openWallet = () => {
    if (this.state.showTextKey)
        this.props.openWallet(this.state.privKey, this.state.password)
          .then((result) => {
            if (!result instanceof Error) {
              this.setState({ showBalance: true });
              this.resetState();
            } else
              this.setState({ error: result });
          });
    else if (this.state.showRequirePass && this.state.showFileKey)
        this.props.openWalletFile(this.state.file, this.state.password)
          .then((result) => {
            if (!result instanceof Error) {
              this.setState({ showBalance: true });
              this.resetState();
            } else
              this.setState({ error: result.toString() });
          });
  }

  closeWallet = () => {
    this.resetState();
    this.props.closeWallet();
  }

  handlePassword = (e) => {
    this.setState({ [e.target.id]: e.target.value, showRequirePass: true });
  }

  handlePrivKey = (e) => {
    this.resetState();
    this.setState({ [e.target.id]: e.target.value });
    if (e.target.value.length === 64)
      this.setState({ showAccessButton: true });
    else if (e.target.value.length === 128 || e.target.value.length === 132)
      this.setState({ showAccessButton: true});

  }

  handleFormat = (e) => {
    if (e.target.value === "file")
      this.setState({ showFileKey: true, showTextKey: false });
    else if (e.target.value === "text")
      this.setState({ showTextKey: true, showFileKey: false });
    this.resetState();
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
        const reader = new FileReader();
        reader.readAsText(acceptedFiles[0]);
        this.setState({ fileName: acceptedFiles[0].name });
        reader.onload = (e) => {
          try {
              const pw = Wallet.walletRequirePass(e.target.result);
              this.setState({ showRequirePass: pw, file: e.target.result,showAccessButton: true });
          } catch (e) {
              console.error(e)
          }
        };
    }

  render() {
    return (
      <Panel 
        header="Please unlock your account to continue"
        footer="Note: Your private key is only used to sign transactions in the browser. It is never transmitted to the server, and we do not store any account information. "
        >
        <Row>
          <Col sm={12} md={4} >
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
        {this.state.showTextKey && <Col sm={12} md={6} lg={6}>
            <h4>Paste / type your private key.</h4>
            <Form>
              <FormGroup
                controlId="privKey"
              >
                <FormControl
                  componentClass="input"
                  placeholder="Private Key"
                  onChange={this.handlePrivKey}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Form>
          </Col> }
          {this.state.showFileKey && <Col sm={12} md={4} lg={3}>
            <h4>Select your wallet file:</h4>
            <Dropzone style={{}} multiple={false} onDrop={this.onDrop}>
            <Button bsStyle="default">Click Me! <i className="fa fa-qrcode" aria-hidden="true"></i></Button>
            </Dropzone>
            {this.state.file && <div>File Selected: {this.state.fileName}</div>}

          </Col>}
          {this.state.showRequirePass && <Col sm={12} md={4} lg={3}>
            <Form>
              <div> Your file is encrypted. Please enter the password:</div>
              <FormGroup
                controlId="password"
              >
                <FormControl
                  componentClass="input"
                  placeholder="Password"
                  type="password"
                  bsSize="small"
                  onChange={this.handlePassword}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Form>
          </Col>}
          <Col sm={12} md={4} lg={3}>
            {this.state.showAccessButton && 
              <Button
                bsStyle="primary"
                bsSize="large"
                style={{marginTop: "20px"}}
                onClick={this.openWallet}>
                OPEN WALLET
              </Button>}
            {this.state.error && <Alert bsStyle="danger">{this.state.error}</Alert>}
              {this.props.wallet && this.state.showBalance &&
                  <Alert bsStyle="success">Wallet successfully decrypted.</Alert>}
            </Col>
        </Row>
          {this.props.wallet && this.state.showBalance &&
            <Row>            
              <Col sm={6} md={4}>
                <ShowWallet showClose={true} closeWallet={this.closeWallet}/>
              </Col>
              <Col sm={6} md={8}>
                <SendWallet/>
              </Col>
            </Row>
          }
      </Panel>
    );
  }
}

const OpenWallet = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet'),
    };
  },
  (dispatch, ownProps) => ({
    openWallet: (key, password) => {
      return new Promise((resolve, reject) => {
        const w = dispatch(openWallet(key, password));
        resolve(w);
      })
    },
    openWalletFile: (key, password) => {
      return new Promise((resolve, reject) => {
        const w = dispatch(openWalletFile(key, password));
        resolve(w);
      });
    },
  })
)(WalletForm)

export default OpenWallet;
