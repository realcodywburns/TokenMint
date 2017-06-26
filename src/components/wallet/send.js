import React from 'react';
import { connect } from 'react-redux';
import { Panel} from 'react-bootstrap';
import { FormGroup, MenuItem, InputGroup, DropdownButton, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { loadCustomToken, generateSendTokenTransaction } from '../../store/tokenActions';
import { sendTransaction, generateSendTransaction } from '../../store/transactionActions';
import { SendTxModal, SuccessModal } from '../transaction/modals';
import { number, address } from '../../lib/validate';

const DefaultTokenGas = "0x5D52";
const DefaultGas = "0x5208";

class RenderWallet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      to: null,
      tokenUnit: 'ETC',
      tokenAddress: null,
      hash: null,
      showTx: false,
      modalShow: false,
      modalSuccess: false,
      tx: {},
    }
  }
 
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  changeToken = (key, e) => {
    this.setState({ tokenUnit: e.target.id.toUpperCase() });
    this.setState({ tokenAddress: null });
  }

  loadToken = () => {
    this.props.loadCustomToken(this.state.tokenAddress);
  }

  generateTransaction = () => {
    const data = {
      to: this.state.to,
      value: this.state.amount,
    }
    let genTx;
    if (this.state.tokenUnit !== 'ETC' && address(this.state.tokenAddress)) {
      data.gasLimit = DefaultTokenGas;
      genTx = this.props.generateTokenSend(this.state.tokenAddress, data, this.props.wallet);
    } else {
      data.gasLimit = DefaultGas;
      genTx = this.props.generateSend(data, this.props.wallet);
    }
    this.setState({ modalShow: true, 
                    showTx: false
                  });      
    genTx.then((result) => {
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
    return (address(this.state.to) || number(this.state.amount)) ? true : false;
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let modalSuccessClose = () => this.setState({ modalSuccess: false });
    let custom = null;
    let c = this.props.custom.findKey((tok) => tok.get('address') === this.state.tokenAddress);
    if (c >= 0) 
        custom = this.props.custom.get(c);

    return (
        <Panel header="Send ETC & Tokens" bsStyle="primary">
          
          <FormGroup
            controlId="to"
            validationState={address(this.state.to)}
          >
            <ControlLabel>To Address</ControlLabel>
            <FormControl
              type="text"
              placeholder="0xe9a7e26bf5c05fe3bae272d4c940bd7158611ce9"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup
            controlId="amount"
          >
            <ControlLabel>Amount to Send</ControlLabel>
            <InputGroup>
              <FormControl
                type="number"
                placeholder="Amount"
                onChange={this.handleChange}
              />
              <DropdownButton
                role="menuitem"
                componentClass={InputGroup.Button}
                title={this.state.tokenUnit}
                id="tokenUnit"
                onSelect={this.changeToken}
              >
                {/* TODO: List tokens from registry */}
                <MenuItem id="ETC" key="etc">ETC</MenuItem>
                <MenuItem id="Custom" key="custom">Custom</MenuItem>
              </DropdownButton>
            </InputGroup>
            <FormControl.Feedback />
          </FormGroup>
          {(this.state.tokenUnit !== 'ETC') && (!custom) && <FormGroup
            controlId="tokenAddress"
          >
            <ControlLabel>Send Custom Token</ControlLabel>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Token Contract Address"
                onChange={this.handleChange}
              />
              <InputGroup.Button>
                <Button
                  disabled={(address(this.state.tokenAddress)==='undefined')}
                  bsStyle="info"
                  onClick={this.loadToken} >
                  LOAD TOKEN
                </Button>
              </InputGroup.Button>
            </InputGroup>
            <FormControl.Feedback />
          </FormGroup>}
          {custom && <h4>{`${custom.get('name')}(${custom.get('symbol')})`}</h4> }

          <Button
            disabled={this.getValid()}
            bsStyle="primary"
            onClick={this.generateTransaction} >
            GENERATE TRANSACTION
          </Button>

          <SendTxModal
            show={this.state.modalShow}
            close={modalClose}
            showTx={this.state.showTx}
            rawTx={this.state.tx.rawTx}
            signedTx={this.state.tx.signedTx}
            submitTx={this.submitTx}
            amount={this.state.amount}
            token={this.state.tokenUnit}
          />
          <SuccessModal
            show={this.state.modalSuccess}
            close={modalSuccessClose}
            hash={this.state.hash}
          >
            Congratulations! Once your token has been mined, you will be able to see it in your wallet. <br />
            Next Step: <Button onClick={this.props.gotoIco} bsStyle="info" bsSize="small">Launch a Crowdsale</Button>
          </SuccessModal>

        </Panel>
    );
  }
}

const SendWallet = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet'),
      custom: state.tokens.get('custom'),
    };
  },
  (dispatch, ownProps) => ({
    loadCustomToken: (address) => {
      dispatch(loadCustomToken(address));
    },
    generateSend: (data, wallet) => {
      return new Promise((resolve, reject) => {
        dispatch(
          generateSendTransaction( data, wallet )
        ).then((result) => resolve(result))
      })
    },
    generateTokenSend: (address, data, wallet) => {
      return new Promise((resolve, reject) => {
        dispatch(
          generateSendTokenTransaction( address, data, wallet )
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
)(RenderWallet)

export default SendWallet;
