import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Row, Col, Alert } from 'react-bootstrap';
import { loadSSCoins } from '../../store/ssActions';
import PrintWallet from '../wallet/print';
import QRCode from 'qrcode.react';

class RenderSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSS: false, 
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
      const address = this.props.wallet.getAddressString();
      const key = this.props.wallet.getPrivateKeyString();
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
        const { deposit, depositAmount, expiration } = this.props.tx;
        const expTime = new Date(expiration).toJSON();
        const tokenName = this.props.ico.get('tokenName');
        return (            
            <div>
                <h4>Please send {depositAmount} {this.props.coin} to {deposit}</h4>
                <Row>
                  <Col sm={2}>
                    <QRCode value="{this.props.tx.deposit}" level="H" />
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
              </div>
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