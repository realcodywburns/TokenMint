import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Panel, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { LaunchICOModal } from '../transaction/modals';
import { generateIcoTransaction, estimateIcoGas, createIco } from '../../store/tokenActions';
import OpenWallet from '../wallet/open';
import { sendTransaction } from '../../store/transactionActions';
import { gotoTab } from '../../store/tabActions';
import { hexToDecimal } from '../../lib/convert';
import { toWei } from '../../lib/etherUnits';

const DefaultGas = "0x94da7";

class LaunchForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.initIco = this.initIco.bind(this);
    this.estimateGas = this.estimateGas.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.gotoToken = this.gotoToken.bind(this);
    this.submitTx = this.submitTx.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      price: 1,
      fundingGoal: 10000000,
      modalShow: false, 
      showTx: false,
      gas: DefaultGas,
      tx: {},
    };
  }

  gotoToken() {
    this.props.gotoToken();
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
      price: toWei(this.state.price),
      fundingGoal: this.state.fundingGoal,
    }
    this.props.estimateGas(data, this.props.wallet)
      .then((result) => { 
        this.setState({ modalShow: true, 
                        showTx: false
                      });
        this.setState({ gas: result || DefaultGas});
      })
  }

  initIco() {
    const data = {
      price: toWei(this.state.price),
      fundingGoal: this.state.fundingGoal,
      gasLimit: this.state.gas,
    }
    this.props.initIco(data, this.props.wallet)
      .then((result) => { 
        this.setState({ modalShow: true, 
                        showTx: true,
                        tx: result
                      });
      })
  }

  submitTx() {
    this.props.sendTransaction(
        this.state.tx.signedTx, 
        this.state,
        this.props.wallet.getAddressString()
        ).then((result) => {
          this.setState({ modalShow: false, showTx: false });
      })
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });

    return (
      <Grid>
        <Row>
          <Col>
          <h4>Start your Crowdsale!</h4>
          </Col>
        </Row>
        {!this.props.token &&  <Row>
          <Col>
            <p>
              Did you already create a token? If not, 
              <Button onClick={this.gotoToken} bsStyle="info" bsSize="small">do that first</Button>
            </p>
            {!this.props.wallet && <p>
              If you already have a token, unlock your wallet to start the ICO.
            </p>}
            <hr />
            {!this.props.wallet && <Panel header="Please unlock your account to continue">
                  <OpenWallet />
              </Panel>}
            
          </Col>
        </Row>}
        {this.props.token && <Row>
          <h4>{this.props.token.get("name")}({this.props.token.get("symbol")})</h4>
          
          <Row>
            <Col sm={4}>Token Contract</Col>
            <Col sm={8}>
              <a href={`"http://gastracker.io/addr/${this.props.token.get("tokenAddress")}"`} 
                rel="noopener noreferrer"
                target="_blank">
                {this.props.token.get("tokenAddress")}
              </a>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>Token Supply</Col>
            <Col sm={8}>{this.props.token.get("initialSupply")}</Col>
          </Row>
        </Row>}
        <hr />
        {this.props.token && <Form>
          <FormGroup
            controlId="etherPrice"
            validationState={this.getRequiredValidation('etherPrice')}
          >
            <ControlLabel>Price per Token (in ether)</ControlLabel>
            <FormControl
              type="number"
              placeholder="1"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup
            controlId="fundingGoal"
            validationState={this.getRequiredValidation('fundingGoal')}
          >
            <ControlLabel>Funding Goal (sale will end when goal is reached)</ControlLabel>
            <FormControl
              type="number"
              placeholder="100000000"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <FormControl.Static>
              BTC, EUR USD
            </FormControl.Static>
          </FormGroup>

          <FormGroup>
            {this.props.wallet &&
            <Button 
              bsStyle="primary"
              onClick={this.estimateGas} >
              START THE ICO
            </Button>}
          </FormGroup>

        </Form>}
        <LaunchICOModal 
          show={this.state.modalShow} 
          close={modalClose} 
          showTx={this.state.showTx}
          rawTx={this.state.tx.rawTx}
          signedTx={this.state.tx.signedTx}
          gas={hexToDecimal(this.state.gas || DefaultGas)}
          changeGas={this.handleChange}
          onGenerate={this.initIco}
          submitTx={this.submitTx}
          />
      </Grid>
    );
  }
};


const LaunchIco = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet'),
      token: state.tokens.get('token')
    }
  },
  (dispatch, ownProps) => ({
      estimateGas: (data, wallet) => {
        return new Promise((resolve, reject) => {
          dispatch(estimateIcoGas( data, wallet ))
          .then((result) => resolve(result));
        })      
      },
      initIco: (data, wallet) => {
        return new Promise((resolve, reject) => {
          dispatch(
            generateIcoTransaction( data, wallet )
          ).then((result) => resolve(result))
        })
      },
      sendTransaction: (tx, data, address) => {
        const afterTx = (txhash) => {
          console.log(txhash)
          const ico = {
              saleTx: txhash,
              beneficiary: address,
              fundingGoal: data.fundingGoal,
              price: toWei(data.price),
          };
          dispatch(gotoTab('buy', ico));
          dispatch(createIco(ico));
        };

        const resolver = (resolve, f) => (x) => {
          f.apply(x);
          resolve(x);
        };

        return new Promise((resolve, reject) => {
          dispatch(sendTransaction( tx ))
            .then(resolver(afterTx, resolve));
        });
      },      
      gotoToken: () => 
        dispatch(gotoTab('token'))
  })
)(LaunchForm)

export default LaunchIco;
