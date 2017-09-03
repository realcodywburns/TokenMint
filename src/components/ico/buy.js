import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Panel } from 'react-bootstrap';
import { FormGroup, FormControl, HelpBlock, ControlLabel, Button } from 'react-bootstrap';
import { BuyTokenModal, SuccessModal } from '../transaction/modals';
import AltcoinButton from '../transaction/altcoin';
import ShapeShift from '../transaction/shapeshift';
import { generateBuyIco } from '../../store/tokenActions';
import OpenWallet from '../wallet/open';
import { sendTransaction } from '../../store/transactionActions';
import { getMarketData, shiftIt } from '../../store/ssActions';
import { toFiat } from '../../lib/etherUnits';
import { decimalToHex } from '../../lib/convert';
import { getBalanceOf } from '../../store/icoActions';
import { number } from '../../lib/validate';
import { Wallet } from '../../lib/wallet';

const DefaultGas = 100000;

class RenderIco extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalShow: false, 
      modalSuccess: false,
      showSS: false,
      hash: null,      
      showTx: false,
      gas: decimalToHex(DefaultGas),
      tx: {},
      amount: 1,
      custom: false,
      payETC: false,
      exchangeRate: 1, // XBT/ETC
      coin: 'ETC',
      coinName: 'Ethereum Classic',
    };
  }

  handleChange = (e) => 
    this.setState({ [e.target.id]: e.target.value });


  buyIco = () => {
    const value = this.props.price * this.state.amount;
    const data = {
      to: this.props.id,
      value,
      gasLimit: this.state.gas,
    }
    this.setState({ modalShow: true, 
                    showTx: false
                  });
    this.props.buyIco(data, this.props.wallet)
      .then((result) => {
        this.setState({ modalShow: true,
                        showTx: true,
                        tx: result
                      });
      })
  }

  selectETC = () => {
    this.setState({ payETC: true, coin: 'ETC' });
  }

  getExchangeRate = (coin) => {
      this.props.dispatch(getMarketData(coin.get('symbol')))
          .then((result) => {
              console.log(result)
              if (result.rate)
                  this.setState({ 
                      showSS: false,
                      payETC: false,
                      coin: coin.get('symbol'),
                      coinName: coin.get('name'),
                      exchangeRate: result.rate
                  });
          });
  }

  // set up new wallet to transfer tokens into
  generateReceiver = () => {
      const pair = this.state.coin.toLowerCase() + '_etc';
      const sswallet = Wallet.generate(false);
      const total = this.state.amount * this.props.price;
      this.setState({ sswallet });
      this.props.dispatch(
          shiftIt(sswallet, this.state.returnAddress, pair, total))
              .then((result) => {
                console.log(result);
                this.setState({ tx: result, showSS: true })
              })
              .catch((e) => this.setState({ error: e.error }));
  }

  submitTx = () => 
    this.props.sendTransaction(
        this.state.tx.signedTx, 
        this.state,
        this.props.wallet.getAddressString()
        ).then((result) => {
          this.setState({ 
            modalShow: false, 
            showTx: false, 
            amount: 0,
            hash: result,
            modalSuccess: true
          })
      })

  getValid = () => {
    return (number(this.state.amount)) ? true : false;
  }

  render() {
    
    let modalClose = () => this.setState({ modalShow: false });
    let modalSuccessClose = () => this.setState({ modalSuccess: false });
    let cost = this.props.price * this.state.amount;
    let costUSD = (this.props.usdRate && cost) ? toFiat(cost, "ether", this.props.usdRate.rate) : "0.00";

    let total = this.state.amount * this.props.price / this.state.exchangeRate;

    return (
      <div>
        <Panel bsStyle="success" 
          header="Buy Tokens" 
          footer={!this.props.wallet && 
                      <Row>
                        <Col sm={2}>
                          <Button 
                            disabled={this.getValid()}
                            bsStyle="success"
                            onClick={this.selectETC} >
                            PAY WITH ETC
                          </Button>
                        </Col>
                        <Col>
                          <AltcoinButton
                            getExchangeRate={this.getExchangeRate} />
                        </Col>
                      </Row>}>
            <FormGroup
              controlId="amount"
            >
              <ControlLabel>Number of Tokens to Buy</ControlLabel>
              <FormControl
                type="number"
                placeholder="1"
                onChange={this.handleChange}
              />
              <HelpBlock>{`Total cost: ${cost} ETC  ($${costUSD} USD).`} You will be able to withdraw your payment at any time before the funding goal is reached.</HelpBlock>
              {this.props.wallet && this.props.ico &&
              <FormGroup>
                <Button 
                  bsStyle="primary"
                  onClick={this.buyIco} >
                  BUY {this.props.ico.get('symbol')}
                </Button>
              </FormGroup>}
            </FormGroup>
          </Panel>


          {this.props.wallet && this.props.ico && 
            <Panel bsStyle="success"> 
              {this.props.ico.get('tokenName')}s Owned: &nbsp; 
              {this.props.balance} 
                &nbsp; <Button 
                        bsStyle="danger"
                        onClick={this.props.getBalance(this.props.ico.get('tokenAddress'), this.props.wallet)}
                        bsSize="xs" >
                        Check Balance
                      </Button>
            </Panel>}

            {!this.props.wallet && this.state.payETC &&
                <OpenWallet />
              }
            {!this.props.wallet && this.state.coin !=='ETC' &&
                <Panel 
                  bsStyle="success"
                  header={`Pay with ${this.state.coinName}`}>
                    <Row>
                      <Col sm={12} md={6} lg={6}>
                      <h4>{`Buy ${this.state.amount} ${this.props.ico.get('tokenName')}s`}</h4>
                        {/* 
                            TODO: Error checking
                            Deposit Limit: {this.state.rate.limit}
                            Minimum Amount: {this.state.rate.minimum}
                            MinerFee: {this.state.rate.minerFee} 
                            Return Address  
                        */}
                        <p>Exchange Rate: {this.state.exchangeRate} ({this.state.coin}/ETC)<br />
                        Total: {total} {this.state.coin}
                        </p>

                        <Button 
                          bsStyle="primary"
                          onClick={this.generateReceiver} >
                          BUY {this.props.ico.get('symbol')}
                        </Button>                    
                      </Col>
                    </Row>
                    {this.state.showSS && <ShapeShift 
                      tx={this.state.tx}
                      amount={this.state.amount}
                      coin={this.state.coin}
                      coinName={this.state.coinName}
                      exchangeRate={this.state.exchangeRate}
                      wallet={this.state.sswallet}
                      {...this.props} />}
                  </Panel>
              }

        
        {this.props.ico &&
        <BuyTokenModal 
          show={this.state.modalShow} 
          close={modalClose} 
          showTx={this.state.showTx}
          rawTx={this.state.tx.rawTx}
          signedTx={this.state.tx.signedTx}
          submitTx={this.submitTx}
          token={this.props.ico.get("symbol")}
          />}
        <SuccessModal
          show={this.state.modalSuccess}
          close={modalSuccessClose}
          hash={this.state.hash}
        >
          Congratulations! Once your transaction has been processed, the tokens will be in your account.
          <p>Next: <a href="/">Create your own Token</a></p>
        </SuccessModal>  
      </div>
    );

  }
}

const BuyIco = connect(
    (state, ownProps) => {
      return {
        ico: state.ico.get('ico'),
        wallet: state.wallet.get('wallet'),
      }
    },
    (dispatch, ownProps) => ({
      dispatch,
      getBalance: (token, wallet) => {
        dispatch(getBalanceOf(token, wallet.getAddressString()));
      },
      buyIco: (data, wallet) => {
        return new Promise((resolve, reject) => {
          dispatch(
            generateBuyIco( data, wallet )
          ).then((result) => resolve(result))
        })
      },
      sendTransaction: (tx, data, address) => {
        return new Promise((resolve, reject) => {
          dispatch(sendTransaction( tx ))
            .then((hash)=>resolve(hash));
        });
      },
    })
)(RenderIco);

export default BuyIco;
