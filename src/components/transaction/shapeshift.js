import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { FormGroup, FormControl, HelpBlock, ControlLabel, DropdownButton, Button } from 'react-bootstrap';
import { Grid, Row, Col, Panel, MenuItem, Image, Alert } from 'react-bootstrap';
import { loadSSCoins, getMarketData, shiftIt } from '../../store/ssActions';
import { Wallet } from '../../lib/wallet';
import PrintWallet from '../wallet/print';
import QRCode from 'qrcode.react';

class RenderSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            showSS: false, 
            exchangeRate: 1, // XBT/ETC
            coin: 'ETC',
            coinName: 'Ethereum Classic',
            returnAddress: null,
            wallet: null,
            tx: {},
            error: null,
        };
    }

    componentWillMount = () => {
        this.props.dispatch(loadSSCoins());
    }

    handleChange = (e) => 
        this.setState({ [e.target.id]: e.target.value });    

    getExchangeRate = (coin) => {
        this.props.dispatch(getMarketData(coin.get('symbol')))
            .then((result) => {
                console.log(result)
                if (result.rate)
                    this.setState({ 
                        coin: coin.get('symbol'),
                        coinName: coin.get('name'),
                        modalShow: true,
                        exchangeRate: result.rate
                    });
            });
    }

    // set up new wallet to transfer tokens into
    generateReceiver = () => {
        const pair = this.state.coin.toLowerCase() + '_etc';
        const wallet = Wallet.generate(false);
        this.setState({ wallet });
        this.props.dispatch(
            shiftIt(wallet, this.state.returnAddress, pair, this.props.amount))
                .then((result) => {
                  console.log(result);
                  this.setState({ tx: result, showSS: true })
                })
                .catch((e) => this.setState({ error: e.error }));
    }

    exportWallet = () => {
      const json = this.state.wallet.toJSON();
      const address = this.state.wallet.getAddressString();
      const fileData = {
                  filename: `${address}.json`,
                  mime: 'text/plain',
                  contents: json,
            }
      const blob = new Blob([fileData.contents], {type: fileData.mime});
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      document.body.appendChild(link); 
      link.download = fileData.filename;
      link.href = url;
      link.click()
      document.body.removeChild(link) // remove the link when done
    }

    printWallet = () => {
      const address = this.state.wallet.getAddressString();
      const key = this.state.wallet.getPrivateKeyString();
      const printWindow = window.open('#/blank');

      const onloadHandler = () => {
        printWindow.document.title = 'TokenMint Wallet';
        
        ReactDOM.render((
          <PrintWallet address={address} privKey={key} />
          ), printWindow.document.getElementById('root'));
      };

      printWindow.onload = onloadHandler;
      // Just in case 
      printWindow.document.readyState === 'complete' && onloadHandler();
    }    

    render() {
        const { deposit, depositAmount, expiration } = this.state.tx;
        const expTime = new Date(expiration).toJSON();
        return (
            <Grid>
            <DropdownButton 
                id="ssCoins"
                bsStyle="success"
                title="PAY WITH...">
                {this.props.coins.valueSeq().map((coin) => 
                    <MenuItem key={coin.get('symbol')} onClick={(e)=>this.getExchangeRate(coin)}>
                        <Image src={coin.get('imageSmall')} /> 
                        {coin.get('name')}
                    </MenuItem>)
                }
            </DropdownButton>
            
            <Panel header={`Buy ${this.props.amount} ${this.props.tokenName}s`}>
                <Row>
                  <Col sm={12} md={6} lg={6}>
                  ({this.props.price} per {this.props.symbol})

                    {/* 
                        TODO: Error checking
                        Deposit Limit: {this.state.rate.limit}
                        Minimum Amount: {this.state.rate.minimum}
                        MinerFee: {this.state.rate.minerFee}   
                    */}
                    <h3>Pay with {this.state.coinName}</h3>
                    <p>Exchange Rate: {this.state.exchangeRate} ({this.state.coin}/ETC)</p>

                    {!this.state.showSS && 
                    <FormGroup controlId="returnAddress" >
                        <ControlLabel>Return Address for Refunds (if wrong amount is received)</ControlLabel>
                        <FormControl type="text" onChange={this.handleChange}/>
                        <HelpBlock bsClass="error">{this.state.error}</HelpBlock>
                        <Button 
                          bsStyle="info"
                          onClick={this.generateReceiver} >
                          OKAY
                        </Button>                    
                    </FormGroup>}
                  </Col>
                </Row>
                {this.state.showSS && <div>
                    <h4>Please send {depositAmount} {this.state.coin} to {deposit}</h4>
                    <Row>
                      <Col sm={2}>
                        <QRCode value={this.state.tx.deposit} level="H" style="width:100%" />
                      </Col>
                      <Col sm={4}>
                        <p>
                        Deposit Type: {this.state.coinName}<br />
                        Deposit Amount: {depositAmount}<br />
                        Expires: {expTime}
                        </p>
                      </Col>
                      <Col sm={6}>
                        <Alert bsStyle="danger">
                          We have generated a new wallet for your {this.props.tokenName}. The tokens will be sent to this wallet when payment is received. You <strong>must</strong> save this wallet in order to access your tokens.<br />
                          <Button 
                            bsStyle="primary"
                            onClick={this.exportWallet} >
                            Export Wallet
                          </Button>
                          <Button 
                            bsStyle="primary"
                            onClick={this.printWallet} >
                            Print Paper Wallet
                          </Button>
                        </Alert>
                      </Col>
                    </Row>
                    </div>}
              </Panel>
          </Grid>

        );

    }
}

const ShapeShift = connect(
    (state, ownProps) => {
        const coins = state.shapeshift.get('coins').sort();
        return {
            coins,
        }
    },
    (dispatch, ownProps) => ({
      dispatch,

    })
)(RenderSS);

export default ShapeShift;