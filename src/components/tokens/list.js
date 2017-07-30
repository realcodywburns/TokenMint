import React from 'react';
import { connect } from 'react-redux';
import { Media, Button, Grid, Row, Col } from 'react-bootstrap';
import TOKENS from '../../TOKENS';
import DefaultIcon from '../../img/default-icon.png';

class ListRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  gotoIco = () => {
    this.setState({ modalSuccess: false });
  }

  render() {

    return (
      <Grid>
      <Row>
        <Col>
          <h2>TokenMint Tokens</h2>
          {TOKENS.map((token) => 
            <Media>
              <Media.Left align="top">
                {token.icon && <img width={80} height={80} src={token.icon} alt={token.name} />}
                {!token.icon && <img width={80} height={80} src={DefaultIcon} alt={token.name} />}
              </Media.Left>
              <Media.Body>
                <Media.Heading>
                {token.name}
                    &nbsp; <small>({token.symbol})</small>
                </Media.Heading>
                Token Contract: <a href="https://gastracker.io/addr/{token.address}" rel="noopener noreferrer"
                    target="_blank">
                  {token.address}</a><br />
                {token.crowdsale &&
                  <a href={`/#/ico/${token.crowdsale}`}>
                    <Button bsSize="small" bsStyle="success">
                    View Crowdsale
                    </Button>
                  </a> }
              </Media.Body>
            </Media>
              )}
        </Col>
      </Row>
    </Grid>
    );
  }
};


const TokenList = connect(
  (state, ownProps) => {
    return {
      wallet: state.wallet.get('wallet')
    }
  },
  (dispatch, ownProps) => ({
  })
)(ListRender)

export default TokenList;
