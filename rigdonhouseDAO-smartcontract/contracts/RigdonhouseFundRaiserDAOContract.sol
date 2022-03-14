// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// The Rigdonhouse DAO Fundraiser: A First Come First Serve Contract

// 1. Anyone may contribute to the DAO fund if they meet minimum contribution requirement of Eth
// 2. Only the Fund Manager can submit a new proposal for a project candidate which identifies:
//    a. Project description
//    b. Funding amount
//    c. Funding recipient
// 3. All contributors may vote by approving a project proposal number
// 4. Only the Fund Manager may issue a proposal to complete the process by tallying up the votes
//    a. Funds are issued to the project recipient by simple majority

contract RigdonhouseFundRaiserDAO {
    
    struct ProposalData {
        uint256 number;
        string description;
        uint256 fundAmount;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
    }

    mapping(uint256 => mapping(address => bool)) public approvals;

    event ProposalEvent (
        uint256 number,
        string description,
        uint256 fundAmount,
        address recipient,
        bool complete,
        uint256 approvalCount
    );

    mapping(uint256 => ProposalData) public proposals;
    string public DAOMascot;
    address public owner;
    address public manager;
    uint256 public minimumContribution;
    uint256 public proposalNumber;
    uint256 public decimals = 18;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    uint256 public DAOBalance;

    constructor ()  {
        owner = msg.sender;
        manager = msg.sender;

        //.01 Eth
        minimumContribution = (1 * (10 ** decimals)) / 100;
    }

    modifier restrictedManager() {
        require(msg.sender == manager, "You must be the manager to make a proposal");
        _;
    }

    modifier restrictedOwner() {
        require(msg.sender == owner, "You must be the owner to set the name of the mascot");
        _;
    }

    function contributeFunds() public payable {
        require(msg.value >= minimumContribution, "You must meet minimum contribution to be an approver");

        DAOBalance += msg.value;

        if (approvers[msg.sender] == false)
        {
          approvers[msg.sender] = true;
          approversCount++;
        }
    }

    function getDAOBalance() public view returns (uint256) {
        return DAOBalance;
    }

    function setDAOMascot(string memory _name) external restrictedOwner {        
        DAOMascot = _name;
    }

    function createProjectProposal(string memory _description, uint256 _fundAmount, address payable _recipient) public restrictedManager {
       proposalNumber++;
       proposals[proposalNumber] = ProposalData(proposalNumber, _description, _fundAmount, _recipient, false, 0);
       emit ProposalEvent(proposalNumber, _description, _fundAmount, _recipient, false, 0);
    }

    function approveProjectProposal(uint256 _proposalNum) public {
        ProposalData storage proposal = proposals[_proposalNum];

        // must be in approver list
        require(approvers[msg.sender]);

        // must not be already approved
        require(approvals[_proposalNum][msg.sender]==false);

        approvals[_proposalNum][msg.sender] = true;
        proposal.approvalCount++;
    }

    function completeProjectProposal(uint256 _proposalNum) public restrictedManager {
        ProposalData storage proposal = proposals[_proposalNum];

        // must be enough funds
        require(DAOBalance >= proposal.fundAmount);

        // must be majority vote
        require(proposal.approvalCount > (approversCount / 2));

        // must be open proposal
        require(!proposal.complete);

        DAOBalance -= proposal.fundAmount;

        // send DAO funds to project recipient
        proposal.recipient.transfer(proposal.fundAmount);
        proposal.complete = true;       
    }
}