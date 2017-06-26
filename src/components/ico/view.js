import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, PageHeader } from 'react-bootstrap';
import { FormGroup, FormControl, HelpBlock, ControlLabel, Button } from 'react-bootstrap';
import { BuyTokenModal, SuccessModal } from '../transaction/modals';
import { generateBuyIco } from '../../store/tokenActions';
import OpenWallet from '../wallet/open';
import { sendTransaction } from '../../store/transactionActions';
import { toFiat, toEther } from '../../lib/etherUnits';
import { decimalToHex } from '../../lib/convert';
import { fetchIco, getBalanceOf } from '../../store/icoActions';
import logo from '../../img/logo.png';
import { number } from '../../lib/validate';
import { CustomHead, CustomAbout } from './custom';

const DefaultGas = 100000;

class RenderIco extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalShow: false, 
      modalSuccess: false,
      hash: null,      
      showTx: false,
      gas: decimalToHex(DefaultGas),
      tx: {},
      id: this.props.match.params.id,
      amount: 1,
      custom: false,
      payETC: false,
      paySS: false,
    };
  }

  componentWillMount = () => {
    this.props.dispatch(fetchIco(this.state.id));
    if(this.state.id==="0x59153bcf752b4e1ef294b370d635ce320bfdac08")    
        this.setState({ custom: true });
  }

  handleChange = (e) => 
    this.setState({ [e.target.id]: e.target.value });


  buyIco = () => {
    const value = this.props.price * this.state.amount;
    const data = {
      to: this.state.id,
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
    this.setState({ payETC: true, paySS: false });
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
    let fundingGoalUSD = (this.props.usdRate && this.props.fundingGoal) ? 
      toFiat(this.props.fundingGoal, "ether", this.props.usdRate.rate) : "0.00";
    let amountRaisedUSD = (this.props.usdRate && this.props.amountRaised) ? 
      toFiat(this.props.amountRaised, "ether", this.props.usdRate.rate) : "0.00";
    let priceUSD = (this.props.usdRate && this.props.price) ? 
      toFiat(this.props.price, "ether", this.props.usdRate.rate) : "0.00";

    return (
      <Grid>
        <Row>
          <Col md={4} mdOffset={4}>
            <a href="/">
              <img className="col-md-6 col-sm-8" src={logo} alt="TokenMint"  />
            </a>
          </Col>
        </Row>
        
        {this.props.ico && this.state.custom && 
            <CustomHead name={this.props.ico.get("tokenName")}
              symbol={this.props.ico.get("symbol")} />
        }
        {this.props.ico && !this.state.custom && 
          <PageHeader>{this.props.ico.get("tokenName")}
              &nbsp;<small>({this.props.ico.get("symbol")})</small>
          </PageHeader>
        }
        {this.props.ico && 
            <Panel bsStyle="info" 
              header={`${this.props.amountRaised} ETC Raised ($${amountRaisedUSD})`} > 
          
              <Row>
                <Col sm={4}>Funding Goal</Col>
                <Col sm={8}>{this.props.fundingGoal} ETC (${fundingGoalUSD})</Col>
              </Row>
              <Row>
                <Col sm={4}>Token Price</Col>
                <Col sm={8}>{this.props.price} ETC (${priceUSD}) </Col>
              </Row>
              <hr />
              <Row>
                <Col sm={4}>Number of Tokens Available</Col>
                <Col sm={8}>{this.props.ico.get("initialSupply")} {this.props.ico.get("symbol")}</Col>
              </Row>                        
            </Panel>
        }

        {!this.props.ico && 
          <Panel>
            <h1>Loading...</h1>
          </Panel>}


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
                        {false && <Col>
                          <Button 
                            disabled={this.getValid()}
                            bsStyle="success"
                            onClick={this.buyIco} >
                            PAY WITH ANOTHER CURRENCY
                          </Button>
                        </Col>}
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

        <hr />
        {this.props.ico && <Row>
          <Col>
            <h3>More Info</h3>
            <Panel footer={this.state.custom && <CustomAbout />}>
              <Row>
                <Col sm={4}>Token Contract</Col>
                <Col sm={8}>
                  <a href={`http://gastracker.io/addr/${this.props.ico.get("tokenAddress")}`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {this.props.ico.get("tokenAddress")}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>Crowdsale Address</Col>
                <Col sm={8}>
                  <a href={`http://gastracker.io/addr/${this.state.id}`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {this.state.id}
                  </a>
                </Col>
              </Row>
            </Panel>
          </Col>
        </Row>}
        
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
      </Grid>
    );

  }
}

const ViewIco = connect(
    (state, ownProps) => {
      const rates = state.wallet.get('rates');
      const usdRate = rates.filter((r)=>r.currency==='usd')[0];
      const fundingGoal = state.ico.get('ico') && 
        toEther((state.ico.get('ico').get('fundingGoal') || 0), 'wei');
      const amountRaised = state.ico.get('ico') && 
        toEther((state.ico.get('ico').get('amountRaised') || 0), 'wei');
      const price = state.ico.get('ico') && 
        toEther((state.ico.get('ico').get('price') || 0), 'wei');
      const balance = state.ico.get('balance').toString(10);
      return {
        ico: state.ico.get('ico'),
        wallet: state.wallet.get('wallet'),
        fundingGoal,
        amountRaised,
        price,
        usdRate,
        balance,
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

export default ViewIco;
