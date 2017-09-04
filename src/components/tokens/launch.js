import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import { Form, FormGroup, FormControl, Radio, ControlLabel, HelpBlock, Button } from 'react-bootstrap';
import { LaunchICOModal, SuccessModal } from '../transaction/modals';
import { generateIcoTransaction, estimateIcoGas, createIco } from '../../store/tokenActions';
import OpenWallet from '../wallet/open';
import { sendTransaction } from '../../store/transactionActions';
import { toFiat } from '../../lib/etherUnits';
import { gotoTab } from '../../store/tabActions';
import { hexToDecimal } from '../../lib/convert';
import { number } from '../../lib/validate';
import { toWei } from '../../lib/etherUnits';

const DefaultGas = "0x94da7";

class LaunchForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false, 
      modalSuccess: false,
      hash: null,
      showTx: false,
      gas: DefaultGas,
      tx: {},
      token: null,
      index: 0,
      premine: 0,
    };
  }

  gotoToken = () => {
    this.props.dispatch(gotoTab('token'));
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleToken = (e) => {
    const token = this.props.tokenList.get(e.target.value);
    this.setState({ index: e.target.value, token});
  }

  estimateGas = () => {
    const data = {
      price: toWei(this.state.price),
      fundingGoal: this.state.fundingGoal,
      premine: this.state.premine,
      index: this.state.index,
    }
    this.props.estimateGas(data, this.props.wallet)
      .then((result) => { 
        this.setState({ modalShow: true, 
                        showTx: false
                      });
        this.setState({ gas: result || DefaultGas});
      })
  }

  initIco = () => {
    const data = {
      price: toWei(this.state.price),
      fundingGoal: this.state.fundingGoal,
      gasLimit: this.state.gas,
      premine: this.state.premine,
      index: this.state.index,      
    }
    this.props.initIco(data, this.props.wallet)
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
    return (number(this.state.price) || number(this.state.fundingGoal)) ? true : false;
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let modalSuccessClose = () => this.setState({ modalSuccess: false });

    let priceUSD = (this.state.price && this.props.usdRate) ? toFiat(this.state.price, "ether", this.props.usdRate.rate) : "0.00";
    let priceBTC = (this.state.price && this.props.btcRate) ? toFiat(this.state.price, "ether", this.props.btcRate.rate) : "0";
    let goalUSD = (this.state.fundingGoal && this.props.usdRate) ? toFiat(this.state.fundingGoal, "ether", this.props.usdRate.rate) : "0.00";
    let goalBTC = (this.state.fundingGoal && this.props.btcRate) ? toFiat(this.state.fundingGoal, "ether", this.props.btcRate.rate) : "0.00";

    return (
      <Grid>
        <Row>
          <Col>
          <h2>Start your Crowdsale!</h2>
          </Col>
        </Row>
        {(this.props.tokenList.size === 0) &&  <Row>
          <Col>
            <p>
              Did you already create a token? If not, 
              <Button onClick={this.gotoToken} bsStyle="info" bsSize="small">do that first</Button>
            </p>
            {!this.props.wallet && <p>
              If you already have a token, unlock your wallet to start the ICO.
            </p>}
            <hr />
            {!this.props.wallet &&  <OpenWallet />}
            
          </Col>
        </Row>}
        {(this.props.tokenList.size > 0) && <Row>
          <h4>Select a Token</h4>
          <FormGroup
            controlId="index"
          >
            {this.props.tokenList.map((token, i) =>
            <Radio 
              name="tokenIndex" 
              key={token.get("tokenAddress")} 
              onChange={this.handleToken} 
              value={i}>
               <Panel 
                bsStyle="info" 
                header={<h5>{`${token.get("name")}(${token.get("symbol")})`}</h5>}>
               <Row>
                <Col sm={4}>Token Contract</Col>
                <Col sm={8}>
                  <a href={`"http://gastracker.io/addr/${token.get("tokenAddress")}"`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {token.get("tokenAddress")}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>Token Supply</Col>
                <Col sm={8}>{token.get("initialSupply")}</Col>
              </Row>
              </Panel>
            </Radio>)}
          </FormGroup>
        </Row>}
        <hr />
        {this.state.token && <Form>
          <FormGroup
            controlId="price"
            validationState={number(this.state.price)}
          >
            <ControlLabel>Price per Token (in ether)</ControlLabel>
            <FormControl
              type="number"
              placeholder="1"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock>{`$${priceUSD} USD`}<br />
            {`${priceBTC} BTC`}</HelpBlock>
          </FormGroup>

          <FormGroup
            controlId="fundingGoal"
            validationState={number(this.state.fundingGoal)}
          >
            <ControlLabel>Funding Goal (sale will end when goal is reached)</ControlLabel>
            <FormControl
              type="number"
              placeholder="100000000"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock>{`$${goalUSD} USD`}<br />
            {`${goalBTC} BTC`}</HelpBlock>
          </FormGroup>
          <FormGroup
            controlId="premine"
            validationState={number(this.state.premine)}
          >
            <ControlLabel>Premine (number of tokens to keep for yourself)</ControlLabel>
            <FormControl
              type="number"
              placeholder="0"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup>
            {this.props.wallet &&
            <Button 
              disabled={this.getValid()}
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
        <SuccessModal
          show={this.state.modalSuccess}
          close={modalSuccessClose}
          hash={this.state.hash}
        >
          Congratulations! Once your transaction has been processed, you will find the crowdsale link in your <Button onClick={this.gotoWallet} bsStyle="info" bsSize="small">wallet.</Button> <br />
        </SuccessModal>          
      </Grid>
    );
  }
};


const LaunchIco = connect(
  (state, ownProps) => {
    const rates = state.wallet.get('rates');
    const usdRate = rates.filter((r)=>r.currency==='usd')[0];
    const btcRate = rates.filter((r)=>r.currency==='btc')[0];
    return {
      wallet: state.wallet.get('wallet'),
      tokenList: state.tokens.get('token'),
      usdRate,
      btcRate,
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
        const resolver = (resolve, f) => (txhash) => {
           const token = {
              owner: address,
              initialSupply: data.totalSupply,
              name: data.token,
              decimals: data.decimals,
              symbol: data.symbol,
              index: data.index,
              tokenTx: txhash,
          };
          dispatch(createIco(token));
          resolve(txhash);
        };

        return new Promise((resolve, reject) => {
          dispatch(sendTransaction( tx ))
            .then(resolver(resolve));
        });
      },
      dispatch,
      gotoWallet: () => 
        dispatch(gotoTab('wallet'))
  })
)(LaunchForm)

export default LaunchIco;
