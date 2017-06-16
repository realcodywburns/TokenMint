import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import OpenWallet from '../wallet/open';
import { fetchIco } from '../../store/icoActions';


class RenderIco extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
    };
  }


  componentWillMount() {
    this.props.dispatch(fetchIco(this.state.id));
  }
  
  render() {

    return (
      <Grid>
        {this.props.ico && <Row>
          <Col>
            <h1>{this.props.ico.get("name")}({this.props.ico.get("symbol")})</h1>
            <h3>Sale Address: {this.state.id}</h3>

            <Panel>
          
              <Row>
                <Col sm={4}>Token Contract</Col>
                <Col sm={8}>
                  <a href={`"http://gastracker.io/addr/${this.props.ico.get("tokenAddress")}"`} 
                    rel="noopener noreferrer"
                    target="_blank">
                    {this.props.ico.get("tokenAddress")}
                  </a>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>Total Token Supply</Col>
                <Col sm={8}>{this.props.ico.get("initialSupply")}</Col>
              </Row>
              <Row>
                <Col sm={4}>Funding Goal</Col>
                <Col sm={8}>{(this.props.ico.get("fundingGoal") || 0).toString(10)}</Col>
              </Row>
              <Row>
                <Col sm={4}>Amount Raised</Col>
                <Col sm={8}>{(this.props.ico.get("amountRaised") || 0).toString(10)}</Col>
              </Row>
              <Row>
                <Col sm={4}>Token Price</Col>
                <Col sm={8}>{(this.props.ico.get("tokenPrice") || 0).toString(10)}</Col>
              </Row>
            </Panel>


          </Col>
        </Row>}
        {!this.props.ico && <Row>
          <Col>
            <h1>Loading...</h1>
          </Col>
        </Row>}
      </Grid>
    );

  }
}

const ViewIco = connect(
    (state, ownProps) => {
      return {
        ico: state.ico.get('ico'),
      }
    },
    (dispatch, ownProps) => ({
      dispatch,
    })
)(RenderIco);

export default ViewIco;
