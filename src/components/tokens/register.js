import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Row, Col, Accordion, Panel } from 'react-bootstrap';
import { generateRegisterTransaction, estimateRegisterGas } from '../../store/tokenActions';
import { sendTransaction } from '../../store/transactionActions';
import { RegisterTxModal, SuccessModal } from '../transaction/modals';
import OpenWallet from '../wallet/open';
import { hexToDecimal } from '../../lib/convert';
import { required, address } from '../../lib/validate';

const DefaultGas = "0x11a7a7";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      modalSuccess: false,
      hash: null,
      showTx: false,
      gas: DefaultGas,
      tx: {},
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  changeGas = (e) => {
    this.setState({ gas: e.target.value })
  }

  estimateGas = () => {
    const data = {
      address: this.state.address,
      crowdsale: this.state.crowdsale,
      name: this.state.name,
      symbol: this.state.symbol,
      url: this.state.url,
      icon: this.state.icon,
      blerb: this.state.blerb,
    }
    this.props.estimateGas(data, this.props.wallet)
      .then((result) => {
        this.setState({ modalShow: true,
                        showTx: false
                      });
        this.setState({ gas: result || DefaultGas});
      })
  }

  initReg = () => {
    const data = {
      address: this.state.address,
      crowdsale: this.state.crowdsale,
      name: this.state.name,
      symbol: this.state.symbol,
      url: this.state.url,
      icon: this.state.icon,
      blerb: this.state.blerb,
      gasLimit: this.state.gas,
    }
    this.props.initReg(data, this.props.wallet)
      .then((result) => {
        this.setState({ modalShow: true,
                        showTx: true,
                        tx: result
                      });
      })
  }

  submitTx = () => {
    this.props.sendTransaction(
        this.state.tx.signedTx,
        this.state,
        this.props.wallet.getAddressString()
        ).then((result) => {
          this.setState({ 
            modalShow: false, 
            showTx: false, 
            hash: result,
            modalSuccess: true })
      })
  }

  getValid = () => {
    return (required(this.state.address) || address(this.state.address) || 
      (this.state.crowdsale && address(this.state.crowdsale) )) ? true : false;
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let modalSuccessClose = () => this.setState({ modalSuccess: false });

    return (
      <Accordion>
      <Panel eventKey="0" header="Add Token to Registry">
        <FormGroup
          controlId="address"
          validationState={required(this.state.address)}
        >
          <ControlLabel>Token Contract Address</ControlLabel>
          <FormControl
            type="text"
            placeholder="0xb4bf8acc4f3db90d5c994b98cc80eef6869e1b64"
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup
          controlId="crowdsale"
          validationState={(this.state.crowdsale) ? address(this.state.crowdsale) : null}
        >
          <ControlLabel>Crowdsale Address</ControlLabel>
          <FormControl
            type="text"
            placeholder="0x59153bcf752b4e1ef294b370d635ce320bfdac08"
            onChange={this.handleChange}
          />
        </FormGroup>        
        <FormGroup
          controlId="token"
        >
          <ControlLabel>Token Name</ControlLabel>
          <FormControl
            type="text"
            placeholder="TokenMint Coin"
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup
          controlId="symbol"
        >
          <ControlLabel>Token Symbol</ControlLabel>
          <FormControl
            type="text"
            placeholder="TOKN"
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup
          controlId="url"
        >
          <ControlLabel>Web Page</ControlLabel>
          <FormControl
            type="text"
            placeholder="https://ethereumclassic.org"
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup
          controlId="icon"
        >
          <ControlLabel>Icon URL</ControlLabel>
          <FormControl
            type="text"
            placeholder="https://tinypic.com/1234"
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup
          controlId="blerb"
        >
          <ControlLabel>More Info</ControlLabel>
          <FormControl
            componentClass="textarea"
            placeholder=""
            onChange={this.handleChange}
          />
        </FormGroup>          
        <Row>
          <Col sm={12}>
          {this.props.wallet &&
            <Button
              disabled={this.getValid()}
              bsStyle="primary"
              onClick={this.estimateGas} >
              REGISTER TOKEN
            </Button>}
          {!this.props.wallet &&
              <OpenWallet />
          }
          </Col>
        </Row>

        <RegisterTxModal
          show={this.state.modalShow}
          close={modalClose}
          showTx={this.state.showTx}
          rawTx={this.state.tx.rawTx}
          signedTx={this.state.tx.signedTx}
          gas={hexToDecimal(this.state.gas || DefaultGas)}
          changeGas={this.changeGas}
          onGenerate={this.initReg}
          submitTx={this.submitTx}
        />
        <SuccessModal
          show={this.state.modalSuccess}
          close={modalSuccessClose}
          hash={this.state.hash}
        >
          Congratulations! Once your token has been registered on the blockchain, it will be listed in the token browser. 
        </SuccessModal>
      </Panel>
      </Accordion>
    );
  }
};


const RegisterToken = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet')
    }
  },
  (dispatch, ownProps) => ({
    estimateGas: (data, wallet) => {
      return new Promise((resolve, reject) => {
        dispatch(estimateRegisterGas( data, wallet ))
        .then((result) => resolve(result));
      })
    },
    initReg: (data, wallet) => {
      return new Promise((resolve, reject) => {
        dispatch(
          generateRegisterTransaction( data, wallet )
        ).then((result) => resolve(result))
      })
    },
    sendTransaction: (tx, data, address) => {
      const resolver = (resolve, f) => (txhash) => {
        resolve(txhash);
      };

      return new Promise((resolve, reject) => {
        dispatch(sendTransaction( tx ))
          .then(resolver(resolve));
      });
    },
  })
)(RegisterForm)

export default RegisterToken;
