import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import TOKENS from '../../TOKENS';
import { gotoTab } from '../../store/tabActions';

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
          list
          {JSON.stringify(TOKENS)}
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
    gotoIco: () => {
      dispatch(gotoTab('ico'));
    }
  })
)(ListRender)

export default TokenList;
