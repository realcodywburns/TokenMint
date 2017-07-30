import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Row, Col, Accordion, Panel } from 'react-bootstrap';
import { generateTokenTransaction, estimateTokenGas, createToken } from '../../store/tokenActions';
import { sendTransaction } from '../../store/transactionActions';
import { gotoTab } from '../../store/tabActions';
import { RegisterTxModal, SuccessModal } from '../transaction/modals';
import OpenWallet from '../wallet/open';
import { hexToDecimal } from '../../lib/convert';
import { required, address } from '../../lib/validate';

const DefaultGas = "0x11a7a7";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: 'TOKN',
      decimals: 8,
      modalShow: false,
      modalSuccess: false,
      hash: null,
      showTx: false,
      gas: DefaultGas,
      tx: {},
    };
  }


  handleSelect = (e) => {
    console.log('select')
    this.setState({ open: !this.state.open });
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  changeGas = (e) => {
    this.setState({ gas: e.target.value })
  }

  estimateGas = () => {
    const data = {
      token: this.state.token,
      symbol: this.state.symbol,
      totalSupply: this.state.totalSupply,
      decimals: this.state.decimals,
    }
    this.props.estimateGas(data, this.props.wallet)
      .then((result) => {
        this.setState({ modalShow: true,
                        showTx: false
                      });
        this.setState({ gas: result || DefaultGas});
      })
  }

  initToken = () => {
    const data = {
      token: this.state.token,
      symbol: this.state.symbol,
      totalSupply: this.state.totalSupply,
      decimals: this.state.decimals,
      gasLimit: this.state.gas,
    }
    this.props.initToken(data, this.props.wallet)
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

  gotoIco = () => {
    this.setState({ modalSuccess: false });
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
          onGenerate={this.initToken}
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
        dispatch(estimateTokenGas( data, wallet ))
        .then((result) => resolve(result));
      })
    },
    initToken: (data, wallet) => {
      return new Promise((resolve, reject) => {
        dispatch(
          generateTokenTransaction( data, wallet )
        ).then((result) => resolve(result))
      })
    },
    sendTransaction: (tx, data, address) => {
      const resolver = (resolve, f) => (txhash) => {
         const token = {
            owner: address,
            initialSupply: data.totalSupply,
            name: data.token,
            decimals: data.decimals,
            symbol: data.symbol,
            tokenTx: txhash,
        };
        dispatch(createToken(token));
        resolve(txhash);
      };

      return new Promise((resolve, reject) => {
        dispatch(sendTransaction( tx ))
          .then(resolver(resolve));
      });
    },
    gotoIco: () => {
      dispatch(gotoTab('ico'));
    }
  })
)(RegisterForm)

export default RegisterToken;
