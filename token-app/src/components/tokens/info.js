import React from 'react';
import { connect } from 'react-redux';
import { Tab, Row, Col } from 'react-bootstrap';

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
              <Tab.Pane eventKey="prep">
                <ul>
                  <li> Decide which account you wish all your free money to go to & ensure you have multiple backups of that account.</li>
                  <li> Decide the maximum amount of ETC you are willing to make from your scam (your <u>Number of tokens</u>). Ensure that account has 0.01 ETC for gas.</li>
                  <li> Start thinking of a name! The less vowels the better. Be sure to use j's, z's, and as many q's as you can . <strong> this is an important step </strong></li>
                  <li> Do a roadshow! This means spam everyones slack, wechat, telegram and twitter relentlessly. Email people on lists you bought on the darknet or scraped from slack. Post an ANN on btctal. Really make everyone think that your product needs a token somehow instead of just using bitcoin or ether.</li>
                </ul>
              </Tab.Pane>
              <Tab.Pane eventKey="launch">
                <ul>
                  <li> Make your <strong>magic</strong>ERC20 token. The code is open to review so you wont be blamed for the 10's of thousands that get lost due to a bug that could be fixed with using the <a href="https://www.reddit.com/r/ethereum/comments/6c68mw/new_record_holder_appears_lets_congratulate/?st=j3edi4n2&sh=18d46ab0">simple fix in EIP223</a></li>
                  <li> You will enter the <u>Token name</u>, <u>Actual number of tokens</u>, <u>Token symbol</u> for trading on markets, and the <u>decimal places</u>.</li>
                  <li> That's it! load your wallet and move on the crowd sale! (Now is a good time to go test drive a new lambo, your doing great.)</li>
                </ul>
              </Tab.Pane>
              <Tab.Pane eventKey="crowd">
                <ul>
                  <li class="strong">THIS IS WHERE THE REAL MAGIC HAPPENS!</strong> </li>
                  <li> Set a price per token and a funding goal (make sure that you leave your self a ton of tokens so you can be rich)  </li>
                  <li> You will unlock your account, enter the <u>Price per token</u>, and the <u>funding goal</u>.</li>
                  <li> Start the ICO and pump, Pump, PUMP IT UP!!!!!</li>
                  <li> Be sure to post how much money you are making everywher to bring the ICO machine more users</li>
                </ul>              
              </Tab.Pane>
              <Tab.Pane eventKey="more">
                <ul>
                   <li>What you are doing is most likely a crime. US financial regulations are very strict on how funds can and can not be raised. You are not clever because you are being sneaky and using the blockchain, scammers have been doing the same thing for 100 years.</li>
                   <li> I get it, you don't <underline>live</underline> in the USA. Through international treaties, that doesnt matter as you are still soliciting to its citizens. Your conuntry most likely has similar laws you are violiating such as anti0spamming and reporting rules.</li>
                    <li><a href="https://www.sec.gov/news/pressrelease/2015-249.html" target="_blank">Crowdfunding in the USA: Jobs act Title III</a></li>
                    <li><a href="http://consumer.findlaw.com/securities-law/what-is-the-howey-test.html" target="_blank">What is a security: the Howey Test</a></li>
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
