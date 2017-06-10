import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col} from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class RenderWallet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      privKey: '',
    };
  }
  
  render() {
    return (
      <Grid>
        <Row>
          <Col>
          <h2>Account Information</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4}>
            <h4>Account Address</h4>{this.props.wallet.getAddressString()}
            <h4>Account Balance</h4>
            Token Balances, 
            Equivalent Values in BTC, EUR, USD
            <Button>Close Wallet</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const ShowWallet = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet'),
    };
  },
  (dispatch, ownProps) => ({

  })
)(RenderWallet)

export default ShowWallet;
