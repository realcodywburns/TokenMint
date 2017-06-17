import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { BuyTokenModal } from '../transaction/modals';
import { generateBuyIco, loadCrowdSale } from '../../store/tokenActions';
import OpenWallet from '../wallet/open';
import { sendTransaction } from '../../store/transactionActions';
import { toFiat, toEther } from '../../lib/etherUnits';
import { fetchIco } from '../../store/icoActions';
import logo from '../../img/logo.png';

const DefaultGas = "0x94da7";

class RenderIco extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalShow: false, 
      showTx: false,
      gas: DefaultGas,
      tx: {},
      id: this.props.match.params.id,
      quantity: 1,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchIco(this.state.id));
  }

  handleChange = (e) => 
    this.setState({ [e.target.id]: e.target.value });


  buyIco = () => {
    const data = {
      amount: this.state.amount,
      gasLimit: this.state.gas,
    }
    console.log(data)
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


  submitTx = () => 
    this.props.sendTransaction(
        this.state.tx.signedTx, 
        this.state,
        this.props.wallet.getAddressString()
        ).then((result) => {
          this.setState({ modalShow: false, showTx: false })
      })


  render() {
    
    let modalClose = () => this.setState({ modalShow: false });
    let cost = this.props.tokenPrice * this.state.quantity;
    let costUSD = (this.props.usdRate && cost) ? toFiat(cost, "ether", this.props.usdRate.rate) : "0.00";
    let fundingGoalUSD = (this.props.usdRate && this.props.fundingGoal) ? 
      toFiat(this.props.fundingGoal, "ether", this.props.usdRate.rate) : "0.00";
    let amountRaisedUSD = (this.props.usdRate && this.props.amountRaised) ? 
      toFiat(this.props.amountRaised, "ether", this.props.usdRate.rate) : "0.00";
    let priceUSD = (this.props.usdRate && this.props.tokenPrice) ? 
      toFiat(this.props.tokenPrice, "ether", this.props.usdRate.rate) : "0.00";

    return (
      <Grid>
        <Row>
          <Col sm={6}>
            <a href="/">
              <img className="col-md-6 col-sm-8" src={logo} alt="TokenMint"  />
            </a>
          </Col>
        </Row>
        {this.props.ico && <Row>
          <Col>
            <h1>{this.props.ico.get("tokenName")}({this.props.ico.get("symbol")})</h1>
            <h3>Sale Address: {this.state.id}</h3>

            <Panel>
          
              <Row>
                <Col sm={4}>Token Contract</Col>
                <Col sm={8}>
                  <a href={`"http://gastracker.io/addr/${this.props.ico.get("tokenAddress")}"`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {this.props.ico.get("tokenAddress")}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>Total Token Supply</Col>
                <Col sm={8}>{this.props.ico.get("initialSupply")} {this.props.ico.get("symbol")}s</Col>
              </Row>
              <Row>
                <Col sm={4}>Funding Goal</Col>
                <Col sm={8}>{this.props.fundingGoal} ETC (${fundingGoalUSD})</Col>
              </Row>
              <Row>
                <Col sm={4}>Amount Raised</Col>
                <Col sm={8}>{this.props.amountRaised} ETC (${amountRaisedUSD})</Col>
              </Row>
              <Row>
                <Col sm={4}>Token Price</Col>
                <Col sm={8}>{this.props.tokenPrice} ETC (${priceUSD}) </Col>
              </Row>
            </Panel>


          </Col>
        </Row>}
        {!this.props.ico && <Row>
          <Col>
            <h1>Loading...</h1>
          </Col>
        </Row>}


        <hr />
        <h3> Buy Tokens</h3>
        <Form>
          <FormGroup
            controlId="amount"
          >
            <ControlLabel>Number of Tokens to Buy</ControlLabel>
            <FormControl
              type="number"
              placeholder="1"
              onChange={this.handleChange}
            />
          </FormGroup>
          <h4>Total cost: {cost} ETC  (${costUSD} USD)</h4> 
          

          {this.props.wallet &&
          <FormGroup>
            <Button 
              bsStyle="primary"
              onClick={this.buyIco} >
              BUY {this.props.ico.get('symbol')}
            </Button>
          </FormGroup>}
          {!this.props.wallet && <OpenWallet />}

        </Form>
        <BuyTokenModal 
          show={this.state.modalShow} 
          close={modalClose} 
          showTx={this.state.showTx}
          rawTx={this.state.tx.rawTx}
          signedTx={this.state.tx.signedTx}
          submitTx={this.submitTx}
          />

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
      const tokenPrice = state.ico.get('ico') && 
        toEther((state.ico.get('ico').get('tokenPrice') || 0), 'wei');
      return {
        ico: state.ico.get('ico'),
        wallet: state.wallet.get('wallet'),
        fundingGoal,
        amountRaised,
        tokenPrice,
        usdRate,
      }
    },
    (dispatch, ownProps) => ({
      dispatch,
      buyIco: (data, wallet) => {
        return new Promise((resolve, reject) => {
          dispatch(
            generateBuyIco( data, wallet )
          ).then((result) => resolve(result))
        })
      },
      sendTransaction: (tx, data, address) => {
        const afterTx = (txhash) => {
          console.log(txhash)
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
    })
)(RenderIco);

export default ViewIco;
