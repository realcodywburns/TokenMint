import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, FormControl, ControlLabel, DropdownButton, Button } from 'react-bootstrap';
import { Grid, Panel, MenuItem } from 'react-bootstrap';
import { loadSSCoins, getMarketData } from '../../store/ssActions';

class RenderSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
        };
    }

    componentWillMount = () => {
        this.props.dispatch(loadSSCoins());
    }

    getExchangeRate = (coin) => {
        this.props.dispatch(getMarketData(coin))
            .then((result) => {
                this.setState({ modalShow: true });
            });
    }

    render() {
        return (
            <Grid>
            <DropdownButton 
                id="ssCoins"
                bsStyle="success"
                title="PAY WITH...">
                {this.props.coins.valueSeq().map((coin) => 
                    <MenuItem key={coin.get('symbol')} onClick={(e)=>this.getExchangeRate(coin.get('symbol'))}>
                        {coin.get('name')}
                    </MenuItem>)
                }
            </DropdownButton>
            <FormGroup controlId="returnAddress" >
            <ControlLabel>Return Address (for refunds)</ControlLabel>
            <FormControl type="text"/>
            </FormGroup>
            {/* this should be a modal
            
            <Panel header="Pay with BLAH">
                    <div>Deposit Limit: {{marketData.limit}}</div>
                    <div>Minimum Amount: {{marketData.minimum}}</div>
                    <div>MinerFee: {{marketData.minerFee}}</div>
                    <div>Rate: {{marketData.rate}}</div>
                    <Button 
                      bsStyle="primary"
                      onClick={ShiftIt} >
                      ACCEPT
                    </Button>
            </Panel>*/}
          </Grid>

        );

    }
}

const ShapeShift = connect(
    (state, ownProps) => {
        const coins = state.shapeshift.get('coins');
        return {
            coins,
        }
    },
    (dispatch, ownProps) => ({
      dispatch,

    })
)(RenderSS);

export default ShapeShift;