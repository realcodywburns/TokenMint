import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { FormGroup, FormControl, HelpBlock, ControlLabel, DropdownButton, Button } from 'react-bootstrap';
import { Grid, Row, Col, Modal, MenuItem } from 'react-bootstrap';
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
        this.props.dispatch(getMarketData(coin))
            .then((result) => {
                console.log(result)
                if (result.rate)
                    this.setState({ 
                        coin,
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
        return (
            <Grid>
            <DropdownButton 
                id="ssCoins"
                bsStyle="success"
                title="PAY WITH...">
                {this.props.coins.valueSeq().map((coin) => 
                    <MenuItem key={coin.get('symbol')} onClick={(e)=>this.getExchangeRate(coin.get('symbol'))}>
                        {coin.get('name')}
                    </MenuItem>)
                }
            </DropdownButton>
            
            <Modal show={this.state.modalShow} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Buy {this.props.amount} {this.props.tokenName}s 
                        ({this.props.price} per {this.props.symbol})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* 
                        TODO: Error checking
                        Deposit Limit: {this.state.rate.limit}
                        Minimum Amount: {this.state.rate.minimum}
                        MinerFee: {this.state.rate.minerFee}   
                    */}
                    <h3>Pay with {this.state.coin}</h3>
                    <p>Exchange Rate: {this.state.exchangeRate} ({this.state.coin}/ETC)</p>

                    <FormGroup controlId="returnAddress" >
                        <ControlLabel>Return Address (for refunds)</ControlLabel>
                        <FormControl type="text" onChange={this.handleChange}/>
                        <HelpBlock>{this.state.error}</HelpBlock>
                    </FormGroup>
                    <Button 
                      bsStyle="primary"
                      onClick={this.generateReceiver} >
                      OKAY
                    </Button>
                </Modal.Body>
                {this.state.showSS && <Modal.Body>
                    <Row>
                      <Col sm={4}>
                        <QRCode value={this.state.tx.deposit} level="H" />
                      </Col>
                      <Col sm={4}>
                        <p>Deposit Type: {this.state.coin}</p>
                        <p>Deposit Amount: {this.state.depositAmount}</p>
                        <p>Expires: {this.state.expiration}</p>
                      </Col>
                      <Col sm={4}>
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
                      </Col>
                    </Row>
              </Modal.Body>}
            </Modal>
          </Grid>

        );

    }
}

const ShapeShift = connect(
    (state, ownProps) => {
        const coins = state.shapeshift.get('coins');
        return {
            coins,
        }
    },
    (dispatch, ownProps) => ({
      dispatch,

    })
)(RenderSS);

export default ShapeShift;