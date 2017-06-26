import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { toFiat, toEther } from '../../lib/etherUnits';
import { gotoTab } from '../../store/tabActions';
import { wrap } from '../../lib/styles';


class RenderWallet extends React.Component {

  render() {
    return (        
        <Panel>
          
          <Panel header="Account Address" bsStyle="success">
            <span style={wrap}>
              {this.props.wallet.getAddressString()}
            </span>
          </Panel>
          <Panel bsStyle="info">
            <h4>Balance</h4>
            {this.props.balance || '?'} ETC
          </Panel>
          {this.props.token && <ListGroup>            
              <ListGroupItem header={`${this.props.token.get("name")}(${this.props.token.get("symbol")})`}>
              Token Contract: 
              <a href={`http://gastracker.io/addr/${this.props.token.get("tokenAddress")}`} 
                rel="noopener noreferrer"
                target="_blank">
                <span style={wrap}>{this.props.token.get("tokenAddress")}</span>
              </a>
              </ListGroupItem>
              <ListGroupItem>
              Crowdsale Status: 
              {this.props.token.get("saleAddress") && 
                <Button bsSize="small" bsStyle="info" href={`/ico/${this.props.token.get("saleAddress")}`}>
                Active
              </Button>}
              {!this.props.token.get("saleAddress") && 
                <Button bsSize="small" bsStyle="success" onClick={this.props.gotoIco}>Launch ICO
                </Button>}
            </ListGroupItem>
            {this.props.ico && 
              <ListGroupItem header={`${this.props.token.get("name")} Crowdsale`}>
              Funding Goal: {this.props.ico.get("fundingGoal")}
              </ListGroupItem>}
            {this.props.ico && 
            <ListGroupItem>
              Amount Raised: {this.props.ico.get("amountRaised")}
            </ListGroupItem>}
          </ListGroup>}
          <Panel>
            <h4>Equivalent Values</h4>
            <hr />  
            {this.props.fiatValues.map((v) =>
              <Row key={v.currency}><Col smOffset={1}>{v.value} {v.currency.toUpperCase()}</Col>
              </Row>)}
          </Panel>
          <Panel bsStyle="warning">
            <h4>Tokens</h4>
            Coming soon...
          </Panel>
          {this.props.showClose && <Button onClick={this.props.closeWallet}>Close Wallet</Button>}
        </Panel>
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
      token: state.tokens.get('token'),
      ico: state.tokens.get('ico'),
    };
  },
  (dispatch, ownProps) => ({
    gotoIco: () => 
      dispatch(gotoTab('ico'))
  })
)(RenderWallet)

export default ShowWallet;
