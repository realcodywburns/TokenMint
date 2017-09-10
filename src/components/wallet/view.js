import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Panel} from 'react-bootstrap';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import { viewWallet } from '../../store/walletActions';
import ShowWallet from './show';

class WalletForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pubKey: '',
      showAccessButton: false,
      showBalance: false,
    };
  }

  resetState = () => {
    this.setState({
      pubKey: '',
      showAccessButton: false,
      showBalance: false,
    });
  }

  viewWallet = () => {
    this.props.viewWallet(this.state.pubKey)
      .then((result) => 
        this.setState({ showBalance: true })
      );
  }

  closeWallet = () => {
    this.resetState();
    this.props.closeWallet();
  }

  handlePubKey = (e) => {
    this.setState({ showAccessButton: false });
    this.setState({ [e.target.id]: e.target.value });
    if (e.target.value.length === 42)
      this.setState({ showAccessButton: true });
  }

  render() {
    return (
      <Panel>
        {!this.state.showBalance && 
          <Row>
            <Col sm={12} md={6} lg={6}>
                <h4>Paste / type your account address.</h4>
                <Form>
                  <FormGroup
                    controlId="pubKey"
                  >
                    <FormControl
                      componentClass="input"
                      placeholder="0x..."
                      onChange={this.handlePubKey}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </Form>
            </Col> 
          <Col sm={12} md={4} lg={3}>
          {this.state.showAccessButton && 
            <Button
              bsStyle="primary"
              bsSize="large"
              style={{marginTop: "20px"}}
              onClick={this.viewWallet}>
              VIEW WALLET
            </Button>}
          </Col>
        </Row>
        }
        {this.state.showBalance &&
          <Row>            
            <Col sm={12} md={12}>
              <ShowWallet showClose={true} closeWallet={this.closeWallet}/>
            </Col>
          </Row>
        }
      </Panel>
    );
  }
}

const ViewWallet = connect(
  (state, ownProps) => {
    return {
      address: state.wallet.get('address'),
    };
  },
  (dispatch, ownProps) => ({
    viewWallet: (pubKey) => {
      return new Promise((resolve, reject) => {
        const w = dispatch(viewWallet(pubKey));
        resolve(w);
      })
    },
  })
)(WalletForm)

export default ViewWallet;
