import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { toFiat, toEther } from '../../lib/etherUnits';


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
          <Col sm={8} md={6}>
            <Panel>
              
              <Panel header="Account Address" bsStyle="success">
                {this.props.wallet.getAddressString()}
              </Panel>
              <Panel bsStyle="info">
                <h4>Balance</h4>
                {this.props.balance || '?'} ETC
              </Panel>
              <Panel bsStyle="warning">
                <h4>Tokens</h4>
              </Panel>
              <Panel>
                <h4>Equivalent Values</h4>
                <hr />  
                {this.props.fiatValues.map((v) =>
                  <Row key={v.currency}><Col smOffset={1}>{v.value} {v.currency.toUpperCase()}</Col>
                  </Row>)}
              </Panel>
              {this.props.showClose && <Button onClick={this.props.closeWallet}>Close Wallet</Button>}
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const ShowWallet = connect(
  (state, ownProps) => {
    const rates = state.wallet.get('rates');
    const balance = state.transaction.get('data')  && 
      toEther(state.transaction.get('data').get('balance'), 'wei');
    let fiatValues = [];
    if (rates && balance)
      fiatValues = rates.map((r) => {
        return { 
          currency: r.currency, 
          value: toFiat(balance, 'ether', r.rate)
        }
      });
    return {
      wallet: state.wallet.get('wallet'),
      balance,
      fiatValues,
    };
  },
  (dispatch, ownProps) => ({

  })
)(RenderWallet)

export default ShowWallet;
