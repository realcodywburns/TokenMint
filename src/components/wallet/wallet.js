import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import OpenWallet from './open';
import ViewWallet from './view';
import { closeWallet } from '../../store/walletActions';

class WalletForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewWallet: false,
      openWallet: false,
    };
  }

  openWallet = () => {
    this.setState({viewWallet: false, openWallet: true});
  }

  viewWallet = () => {
    this.setState({viewWallet: true, openWallet: false});
  }

  closeWallet = () => {
    this.setState({viewWallet: false, openWallet: false}); 
    this.props.dispatch(closeWallet());
  }

  render() {
    return (
      <div>
        {!this.state.openWallet && !this.state.viewWallet && 
        <Row>
          <Col sm={12} md={4} mdOffset={2} >
            <Button
                bsStyle="info"
                bsSize="large"
                style={{marginTop: "20px"}}
                onClick={this.viewWallet}>
                VIEW WALLET BALANCE
              </Button>
          </Col>
          <Col sm={12} md={4} >
            <Button
                bsStyle="info"
                bsSize="large"
                style={{marginTop: "20px"}}
                onClick={this.openWallet}>
                SEND ETC / TOKENS
              </Button>
          </Col>
        </Row>}
        {this.state.openWallet && <OpenWallet closeWallet={this.closeWallet} />}
        {this.state.viewWallet && <ViewWallet closeWallet={this.closeWallet} />}
      </div>
    );
  }
}

const ManageWallet = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet'),
    };
  },
  (dispatch, ownProps) => ({
    dispatch,
  })
)(WalletForm)

export default ManageWallet;
