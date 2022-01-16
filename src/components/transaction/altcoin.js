import React from 'react';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem, Image } from 'react-bootstrap';
import { loadSSCoins } from '../../store/ssActions';

class RenderButton extends React.Component {

    componentWillMount = () => {
        this.props.dispatch(loadSSCoins());
    }

    render() {
        return (
            <DropdownButton 
                disabled={true}
                id="ssCoins"
                bsStyle="success"
                title="PAY WITH...">
                {this.props.coins.valueSeq().map((coin) => 
                    <Dropdown.Menu> 
                     <Dropdown.Item
                      key={coin.get('symbol')} 
                      onClick={(e)=>this.props.getExchangeRate(coin)}
                    >
                        <Image src={coin.get('imageSmall')} /> 
                        {coin.get('name')}
                    </Dropdown.Item>
                    </Dropdown.Menu>)
                }
            </DropdownButton>
        );

    }
}

const AltcoinButton = connect(
    (state, ownProps) => {
        const coins = state.shapeshift.get('coins').sort();
        return {
            coins,
        }
    },
    (dispatch, ownProps) => ({
      dispatch,

    })
)(RenderButton);

export default AltcoinButton;
