pragma solidity ^0.4.2;

import "./ERC223.sol";

contract Crowdsale {
    address public beneficiary;
    uint public fundingGoal;
    uint public amountRaised;
    uint public price;
    Token public tokenReward;
    mapping(address => uint256) public balanceOf;
    bool fundingGoalReached = false;
    event GoalReached(address beneficiary, uint amountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);
    event IcoLaunch(address from, uint value, bytes data);
    bool crowdsaleClosed = false;

    /*  at initialization, setup the owner */
    function Crowdsale(
        address ifSuccessfulSendTo,
        uint fundingGoalInEthers,
        uint weiCostOfEachToken,
        address addressOfTokenUsedAsReward
    ) {
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = fundingGoalInEthers * 1 ether;
        price = weiCostOfEachToken;
        tokenReward = Token(addressOfTokenUsedAsReward);
    }

    /* The function without name is the default function that is called whenever anyone sends funds to a contract */
    function () payable {
        if (crowdsaleClosed) throw;
        uint amount = msg.value; //in wei
        balanceOf[msg.sender] = amount;
        amountRaised += amount;
        tokenReward.transfer(msg.sender, amount/price);
        FundTransfer(msg.sender, amount, true);
    }

    /* Buy tokens for address */
    function buyTokens(address buyer) payable {
        if (crowdsaleClosed) throw;
        uint amount = msg.value; //in wei
        balanceOf[buyer] = amount;
        amountRaised += amount;
        tokenReward.transfer(buyer, amount/price);
        FundTransfer(buyer, amount, true);
    }

    modifier afterFundingGoal() { if (amountRaised >= fundingGoal) _; }

    /* checks if the goal or time limit has been reached and ends the campaign */
    function checkGoalReached() afterFundingGoal() {
            fundingGoalReached = true;
            GoalReached(beneficiary, amountRaised);
            //crowdsaleClosed = true;
    }


    function safeWithdrawal() {
        if (!fundingGoalReached) {
            uint amount = balanceOf[msg.sender];
            balanceOf[msg.sender] = 0;
            if (amount > 0) {
                if (msg.sender.send(amount)) {
                    FundTransfer(msg.sender, amount, false);
                } else {
                    balanceOf[msg.sender] = amount;
                }
            }
        }

        if (fundingGoalReached && beneficiary == msg.sender) {
            if (beneficiary.send(amountRaised)) {
                FundTransfer(beneficiary, amountRaised, false);
            } else {
                //If we fail to send the funds to beneficiary, unlock funders balance
                fundingGoalReached = false;
            }
        }
    }

    function tokenFallback(address _from, uint _value, bytes _data){
        IcoLaunch(_from, _value, _data);
    }
}