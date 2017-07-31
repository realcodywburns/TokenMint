import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Row, Col, Panel, Alert } from 'react-bootstrap';
import { loadSSCoins, shiftIt } from '../../store/ssActions';
import { Wallet } from '../../lib/wallet';
import PrintWallet from '../wallet/print';
import QRCode from 'qrcode.react';

class RenderSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSS: false, 
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

    // set up new wallet to transfer tokens into
    generateReceiver = () => {
        const pair = this.props.coin.toLowerCase() + '_etc';
        const wallet = Wallet.generate(false);
        const total = this.props.amount * this.props.price;
        this.setState({ wallet });
        this.props.dispatch(
            shiftIt(wallet, this.state.returnAddress, pair, total))
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
        const tokenName = this.props.ico.get('tokenName');
        const symbol = this.props.ico.get('symbol');
        const total = this.props.amount * this.props.price / this.props.exchangeRate;
        return (
            <Panel 
              bsStyle="success"
              header={`Pay with ${this.props.coinName}`}>
                <Row>
                  <Col sm={12} md={6} lg={6}>
                  <h4>{`Buy ${this.props.amount} ${tokenName}s`}</h4>
                    {/* 
                        TODO: Error checking
                        Deposit Limit: {this.state.rate.limit}
                        Minimum Amount: {this.state.rate.minimum}
                        MinerFee: {this.state.rate.minerFee}   
                    */}
                    <p>Exchange Rate: {this.props.exchangeRate} ({this.props.coin}/ETC)<br />
                    Total: {total} {this.props.coin}
                    </p>

                    <Button 
                      bsStyle="primary"
                      onClick={this.generateReceiver} >
                      BUY {symbol}
                    </Button>                    
                  </Col>
                </Row>
                {this.state.showSS && <div>
                    <h4>Please send {depositAmount} {this.props.coin} to {deposit}</h4>
                    <Row>
                      <Col sm={2}>
                        <QRCode value={this.state.tx.deposit} level="H" />
                      </Col>
                      <Col sm={4}>
                        <p>
                        Deposit Type: {this.props.coinName}<br />
                        Deposit Amount: {depositAmount}<br />
                        Expires: {expTime}
                        </p>
                      </Col>
                      <Col sm={6}>
                        <Alert bsStyle="danger">
                          We have generated a new wallet for your {tokenName}. The tokens will be sent to this wallet when payment is received. You <strong>must</strong> save this wallet in order to access your tokens.<br />
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
        );

    }
}

const ShapeShift = connect(
    (state, ownProps) => {
        const coins = state.shapeshift.get('coins').filter((f) => f.get('available')).sort();
        return {
            coins,
        }
    },
    (dispatch, ownProps) => ({
      dispatch,

    })
)(RenderSS);

export default ShapeShift;