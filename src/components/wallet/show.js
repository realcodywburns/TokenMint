import React from 'react';
import { Link } from 'react-router-dom';
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
            <hr />
            <h6>Equivalent Values</h6>
            {this.props.fiatValues.map((v) =>
              <Row key={v.currency}><Col smOffset={1}>{v.value} {v.currency.toUpperCase()}</Col>
              </Row>)}
          </Panel>
          <Panel bsStyle="warning">
            <h4>Tokens</h4>
            <hr />
            {this.props.tokens.map((val, tok) => {
              return  (val > 0) && 
                <Row key={tok}><Col smOffset={1}>{val.toString(10)} {tok.toUpperCase()}</Col>
                </Row>
              })}
          </Panel>
          <ListGroup>
          {this.props.tokenList.map((token, i) => 
            <div key={token.get("tokenAddress")}>
              <ListGroupItem header={`${token.get("name")}(${token.get("symbol")})`}>
              Token Contract: 
              <a href={`http://gastracker.io/addr/${token.get("tokenAddress")}`} 
                rel="noopener noreferrer"
                target="_blank">
                <span style={wrap}>{token.get("tokenAddress")}</span>
              </a>
              </ListGroupItem>
              {token.get("saleAddress") && 
              <ListGroupItem> 
                <Link to={`/ico/${token.get("saleAddress")}`}>
                <Button bsSize="small" bsStyle="info">Crowdsale</Button>
                </Link>
              </ListGroupItem>}
          </div>)}
          </ListGroup>

          {this.props.showClose && <Button onClick={this.props.closeWallet}>Close Wallet</Button>}
        </Panel>
    );
  }
}

const ShowWallet = connect(
  (state, ownProps) => {
    const tokens = state.wallet.get('tokens');
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
      tokenList: state.tokens.get('token'),
      tokens,
    };
  },
  (dispatch, ownProps) => ({
    gotoIco: () => 
      dispatch(gotoTab('ico'))
  })
)(RenderWallet)

export default ShowWallet;
