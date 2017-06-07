import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, Tab, Row, Col } from 'react-bootstrap';

const Information = React.createClass({

  render() {
    return (
      <Tab.Container id="tokenInfo" defaultActiveKey="prep">
        <Row className="clearfix">
          <Col sm={4}>
            <Nav bsStyle="pills" stacked>
              <NavItem eventKey="prep">
                Preparation
              </NavItem>
              <NavItem eventKey="launch">
                Launch a Token
              </NavItem>
              <NavItem eventKey="crowd">
                Crowdfunding
              </NavItem>
              <NavItem eventKey="more">
                More Info
              </NavItem>
            </Nav>
          </Col>
          <Col sm={8}>
            <Tab.Content animation>
              <Tab.Pane eventKey="Preparation">
                <ul>
                  <li> Decide which Ethereum address you want your new tokens to go to & ensure you have multiple backups of that account. </li>
                  <li> Decide the maximum amount of ETC you are willing to make from your scam (your Number of tokens). Ensure that account has 0.01 ETC or 0.01 ETH for gas, otherwise you will not be able to move your tokens. </li>
                </ul>
              </Tab.Pane>
              <Tab.Pane eventKey="Launching a Token">
                <ul>
                  <li> Make your ERC223 token. Any wallet or exchange that supports the ERC20 standard can support ERC223 tokens. ERC223 simply contains a fix to a bug that prevents tokens from being lost if they are sent to the token address. More information on ERC223 tokn standard can be <a href="https://www.reddit.com/r/ethereum/comments/60ql37/attention_be_careful_using_ethereum_tokens/">found here</a></li>
                  <li> You will enter the Token name, Actual number of tokens, Token symbol for trading on markets, and the number of decimal places that you would like to use and voila! Load your wallet and move on to the crowd sale!</li>
                </ul>
              </Tab.Pane>
              <Tab.Pane eventKey="Crowdfunding *Use at your own risk*">
                <ul>
                  <li> You will unlock your account, enter the price per token, and your fundraising goal. Now those that wish to purchase your token can do so by sending ETC or ETH at your designated price to the contract address.</li>
                  <li> US financial regulations are very strict on how funds can and can not be raised. You are not clever because you are being sneaky and using the blockchain, scammers have been doing the same thing for 100 years.</li>
                  <li> Even though you may not live in the USA. Through international treaties, that doesnt matter if you are still soliciting to its citizens. Your conuntry most likely has similar laws you are violiating such as anti-spamming and reporting rules.</li>
                </ul>              
              </Tab.Pane>
              <Tab.Pane eventKey="References for the Legal Use of Initial Coin Offerings">
                <ul>
                    <li><a href="https://www.sec.gov/news/pressrelease/2015-249.html" target="_blank">Crowdfunding in the USA: Jobs act Title III</a></li>
                    <li><a href="http://securities-law-blog.com/2014/11/25/what-is-a-security-the-howey-test-and-reves-test/" target="_blank">What is a security: the Howey Test</a></li>
                </ul>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
});

export default Information;
