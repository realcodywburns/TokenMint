import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { toFiat, toEther } from '../../lib/etherUnits';
import { gotoTab } from '../../store/tabActions';
import { viewWallet } from '../../store/walletActions';
import { wrap } from '../../lib/styles';

class RenderWallet extends React.Component {

  constructor(props) {
    super(props);
    const address = (this.props.match) ? this.props.match.params.addr : null;
    this.state = {
      address,
    };
  }

  componentWillMount = () => {
    if (this.state.address)
      this.props.dispatch(viewWallet(this.state.address));
  }

  render() {
    return (        
        <Panel>
          
          <Panel header="Account Address" bsStyle="success">
            <span style={wrap}>
              {this.props.address}
            </span>
          </Panel>
          <Panel bsStyle="info">
            <h4>Balance</h4>
            {this.props.balance || '?'} ETC
            <hr />
            <h6>Equivalent Values</h6>
            {this.props.fiatValues.map((v) =>
              <span key={v.currency}>
                {v.value} {v.currency.toUpperCase()}<br />
              </span>)}
          </Panel>
          <Panel bsStyle="warning">
            <h4>Tokens</h4>
            <hr />
            {this.props.tokens.entrySeq().map((tok) => {
              return  (tok[1] > 0) && 
                <span key={tok[0]}>
                  {tok[1].toString(10)} {tok[0].toUpperCase()}<br />
                </span>
              })}
          </Panel>
          <ListGroup>
          {this.props.tokenList.valueSeq().map((token) => 
            <div key={token.get("tokenAddress")}>
              <ListGroupItem header={`${token.get("name")}(${token.get("symbol")})`}>
              Token Contract: 
              <a href={`http://gastracker.io/addr/${token.get("tokenAddress")}`} 
                rel="noopener noreferrer"
                target="_blank">
                <span style={wrap}>{token.get("tokenAddress")}</span>
              </a>
              </ListGroupItem>
              {(token.get("saleAddress").length === 42) && 
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
      address: state.wallet.get('address'),
      balance,
      fiatValues,
      tokenList: state.tokens.get('tokens'),
      tokens,
    };
  },
  (dispatch, ownProps) => ({
    dispatch,
    gotoIco: () => 
      dispatch(gotoTab('ico'))
  })
)(RenderWallet)

export default ShowWallet;
