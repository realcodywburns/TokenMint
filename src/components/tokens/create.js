import React from 'react';
import { connect } from 'react-redux';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { generateTokenTransaction, estimateTokenGas } from '../../store/tokenActions';
import { CreateTxModal } from '../transaction/createModal';
import OpenWallet from '../wallet/open';


class CreateTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.initToken = this.initToken.bind(this);
    this.estimateGas = this.estimateGas.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      symbol: 'POOP',
      decimals: 8,
      modalShow: false, 
      showTx: false,
      tx: {},
    };
  }

  getRequiredValidation(key) {
    if (this.state.key) return 'success';
    else return 'warning';
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  estimateGas() {
    const data = {
      token: this.state.token,
      symbol: this.state.symbol,
      totalSupply: this.state.totalSupply,
      decimals: this.state.decimals,
    }
    this.props.estimateGas(data, this.props.wallet)
      .then((result) => { 
        //const tx = JSON.parse(result);
        console.log(result)
        this.setState({ modalShow: true, 
                        showTx: true,
                        //tx
                      });
      })
  }

  initToken() {
    const data = {
      token: this.state.token,
      symbol: this.state.symbol,
      totalSupply: this.state.totalSupply,
      decimals: this.state.decimals,
    }
    this.props.initToken(data, this.props.wallet)
      .then((result) => { 
        //const tx = JSON.parse(result);
        console.log(result)
        this.setState({ modalShow: true, 
                        showTx: true,
                        //tx
                      });
      })
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });

    return (
      <div>
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
        </Form>
        {this.props.wallet &&
          <Button 
            bsStyle="primary"
            onClick={this.estimateGas} >
            LET'S DO THIS
          </Button>}
        {!this.props.wallet && 
          <Panel header="Please unlock your account to continue">
              <OpenWallet />
          </Panel>
        }

        <CreateTxModal 
          show={this.state.modalShow} 
          close={modalClose} 
          showTx={this.state.showTx}
          rawTx={this.state.tx.rawTx}
          signedTx={this.state.tx.signedTx}
          />
      </div>
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
    estimateGas: (data, wallet) => {
      const confirmTx = (tx) => {
        console.log(tx)
        return tx;
      }
      const resolver = (resolve, f) => (x) => {
          return f.apply(x);
          //resolve(x);
      };

      return new Promise((resolve, reject) => {
        dispatch(estimateTokenGas( data, wallet ))
        .then((result) => resolve(result))
      })      
    },
    initToken: (data, wallet) => {
      const confirmTx = (tx) => {
        console.log(tx)
        return tx;
      }
      const resolver = (resolve, f) => (x) => {
          return f.apply(x);
          //resolve(x);
      };
      return new Promise((resolve, reject) => {
        dispatch(
          generateTokenTransaction( data, wallet )
        ).then(resolver(confirmTx, resolve))
         .catch((error) => {
            resolve({ _error: (error.message || JSON.stringify(error)) });
         })
      })
    }
  })
)(CreateTokenForm)

export default CreateToken;
