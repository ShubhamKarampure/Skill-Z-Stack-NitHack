// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IIssuer.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./Timelock.sol";

/**
 * @title IssuerDAO
 * @dev Decentralized Autonomous Organization for governing issuer accreditation
 * Implements proposal-based voting for accrediting, revoking, and suspending issuers
 */
contract IssuerDAO is AccessControl, ReentrancyGuard, Pausable {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    // DAO Configuration
    uint256 public votingPeriod = 7 days;
    uint256 public votingDelay = 1 days;
    uint256 public proposalThreshold = 1; // Minimum votes to create proposal
    uint256 public quorumPercentage = 50; // 50% quorum required

    // Proposal states
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    // Proposal action types
    enum ProposalAction {
        AccreditIssuer,
        RevokeIssuer,
        SuspendIssuer,
        ReactivateIssuer,
        UpdateVotingPeriod,
        UpdateQuorum
    }

    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        ProposalAction action;
        address targetIssuer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 startBlock;
        uint256 endBlock;
        uint256 eta; // Estimated time of execution (after timelock)
        bool canceled;
        bool executed;
        mapping(address => Receipt) receipts;
    }

    // Vote receipt
    struct Receipt {
        bool hasVoted;
        uint8 support; // 0=against, 1=for, 2=abstain
        uint256 votes;
    }

    // Voter structure
    struct Voter {
        address voterAddress;
        uint256 votingPower;
        uint256 proposalsCreated;
        uint256 votesParticipated;
        bool isActive;
    }

    // Storage
    mapping(uint256 => Proposal) public proposals;
    mapping(address => Voter) public voters;
    address[] public voterList;
    uint256 public proposalCount;
    uint256 public totalVotingPower;

    // Contract references
    IIssuer public issuerRegistry;
    Timelock public timelock;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalAction action,
        address targetIssuer,
        uint256 startBlock,
        uint256 endBlock,
        string description
    );

    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        uint8 support,
        uint256 votes,
        string reason
    );

    event ProposalCanceled(uint256 indexed proposalId);

    event ProposalQueued(uint256 indexed proposalId, uint256 eta);

    event ProposalExecuted(uint256 indexed proposalId);

    event VoterAdded(address indexed voter, uint256 votingPower);

    event VoterRemoved(address indexed voter);

    event VotingPowerUpdated(address indexed voter, uint256 newVotingPower);

    modifier onlyVoter() {
        require(hasRole(VOTER_ROLE, msg.sender), "IssuerDAO: Not a voter");
        require(voters[msg.sender].isActive, "IssuerDAO: Voter not active");
        _;
    }

    constructor(address _issuerRegistryAddress, address _timelockAddress) {
        require(
            _issuerRegistryAddress != address(0),
            "IssuerDAO: Invalid registry address"
        );
        require(
            _timelockAddress != address(0),
            "IssuerDAO: Invalid timelock address"
        );

        issuerRegistry = IIssuer(_issuerRegistryAddress);
        timelock = Timelock(payable(_timelockAddress));

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(VOTER_ROLE, msg.sender);

        // Add deployer as initial voter
        voters[msg.sender] = Voter({
            voterAddress: msg.sender,
            votingPower: 100,
            proposalsCreated: 0,
            votesParticipated: 0,
            isActive: true
        });
        voterList.push(msg.sender);
        totalVotingPower = 100;
    }

    /**
     * @dev Create a proposal to accredit a new issuer
     */
    function proposeAccreditIssuer(
        address issuerAddress,
        string memory description
    ) external onlyVoter whenNotPaused returns (uint256) {
        require(
            issuerRegistry.isRegistered(issuerAddress),
            "IssuerDAO: Issuer not registered"
        );
        require(
            !issuerRegistry.isAccredited(issuerAddress),
            "IssuerDAO: Already accredited"
        );
        require(
            voters[msg.sender].votingPower >= proposalThreshold,
            "IssuerDAO: Below proposal threshold"
        );

        return
            _createProposal(
                ProposalAction.AccreditIssuer,
                issuerAddress,
                description
            );
    }

    /**
     * @dev Create a proposal to revoke an issuer
     */
    function proposeRevokeIssuer(
        address issuerAddress,
        string memory description
    ) external onlyVoter whenNotPaused returns (uint256) {
        require(
            issuerRegistry.isAccredited(issuerAddress),
            "IssuerDAO: Issuer not accredited"
        );

        return
            _createProposal(
                ProposalAction.RevokeIssuer,
                issuerAddress,
                description
            );
    }

    /**
     * @dev Create a proposal to suspend an issuer
     */
    function proposeSuspendIssuer(
        address issuerAddress,
        string memory description
    ) external onlyVoter whenNotPaused returns (uint256) {
        require(
            issuerRegistry.isRegistered(issuerAddress),
            "IssuerDAO: Issuer not registered"
        );
        require(
            !issuerRegistry.isSuspended(issuerAddress),
            "IssuerDAO: Already suspended"
        );

        return
            _createProposal(
                ProposalAction.SuspendIssuer,
                issuerAddress,
                description
            );
    }

    /**
     * @dev Create a proposal to reactivate an issuer
     */
    function proposeReactivateIssuer(
        address issuerAddress,
        string memory description
    ) external onlyVoter whenNotPaused returns (uint256) {
        require(
            issuerRegistry.isSuspended(issuerAddress),
            "IssuerDAO: Issuer not suspended"
        );

        return
            _createProposal(
                ProposalAction.ReactivateIssuer,
                issuerAddress,
                description
            );
    }

    /**
     * @dev Internal function to create a proposal
     */
    function _createProposal(
        ProposalAction action,
        address targetIssuer,
        string memory description
    ) internal returns (uint256) {
        proposalCount++;
        uint256 proposalId = proposalCount;

        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.action = action;
        newProposal.targetIssuer = targetIssuer;
        newProposal.description = description;
        newProposal.startBlock = block.number + (votingDelay / 12); // ~12 sec per block
        newProposal.endBlock = newProposal.startBlock + (votingPeriod / 12);
        newProposal.canceled = false;
        newProposal.executed = false;

        voters[msg.sender].proposalsCreated++;

        emit ProposalCreated(
            proposalId,
            msg.sender,
            action,
            targetIssuer,
            newProposal.startBlock,
            newProposal.endBlock,
            description
        );

        return proposalId;
    }

    /**
     * @dev Cast a vote on a proposal
     * @param proposalId The proposal ID
     * @param support 0=against, 1=for, 2=abstain
     * @param reason Reason for the vote
     */
    function castVote(
        uint256 proposalId,
        uint8 support,
        string memory reason
    ) external onlyVoter whenNotPaused {
        require(support <= 2, "IssuerDAO: Invalid support value");
        require(
            state(proposalId) == ProposalState.Active,
            "IssuerDAO: Voting not active"
        );

        Proposal storage proposal = proposals[proposalId];
        Receipt storage receipt = proposal.receipts[msg.sender];

        require(!receipt.hasVoted, "IssuerDAO: Already voted");

        uint256 votes = voters[msg.sender].votingPower;

        if (support == 0) {
            proposal.againstVotes += votes;
        } else if (support == 1) {
            proposal.forVotes += votes;
        } else {
            proposal.abstainVotes += votes;
        }

        receipt.hasVoted = true;
        receipt.support = support;
        receipt.votes = votes;

        voters[msg.sender].votesParticipated++;

        emit VoteCast(msg.sender, proposalId, support, votes, reason);
    }

    /**
     * @dev Queue a successful proposal for execution
     */
    function queueProposal(uint256 proposalId) external whenNotPaused {
        require(
            state(proposalId) == ProposalState.Succeeded,
            "IssuerDAO: Proposal not succeeded"
        );

        Proposal storage proposal = proposals[proposalId];
        uint256 eta = block.timestamp + timelock.delay();
        proposal.eta = eta;

        emit ProposalQueued(proposalId, eta);
    }

    /**
     * @dev Execute a queued proposal
     */
    function executeProposal(
        uint256 proposalId
    ) external nonReentrant whenNotPaused {
        require(
            state(proposalId) == ProposalState.Queued,
            "IssuerDAO: Proposal not queued"
        );

        Proposal storage proposal = proposals[proposalId];
        require(
            block.timestamp >= proposal.eta,
            "IssuerDAO: Timelock not expired"
        );
        require(
            block.timestamp <= proposal.eta + timelock.gracePeriod(),
            "IssuerDAO: Transaction stale"
        );

        proposal.executed = true;

        // Execute the proposal action
        if (proposal.action == ProposalAction.AccreditIssuer) {
            issuerRegistry.accreditIssuer(proposal.targetIssuer);
        } else if (proposal.action == ProposalAction.RevokeIssuer) {
            issuerRegistry.revokeIssuer(
                proposal.targetIssuer,
                proposal.description
            );
        } else if (proposal.action == ProposalAction.SuspendIssuer) {
            issuerRegistry.suspendIssuer(
                proposal.targetIssuer,
                proposal.description
            );
        } else if (proposal.action == ProposalAction.ReactivateIssuer) {
            issuerRegistry.reactivateIssuer(proposal.targetIssuer);
        }

        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Cancel a proposal (only by proposer or admin)
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "IssuerDAO: Proposal already executed");
        require(
            msg.sender == proposal.proposer || hasRole(ADMIN_ROLE, msg.sender),
            "IssuerDAO: Not authorized"
        );

        proposal.canceled = true;

        emit ProposalCanceled(proposalId);
    }

    /**
     * @dev Get proposal state
     */
    function state(uint256 proposalId) public view returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "IssuerDAO: Invalid proposal");

        if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (
            proposal.forVotes <= proposal.againstVotes ||
            !_quorumReached(proposalId)
        ) {
            return ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta + timelock.gracePeriod()) {
            return ProposalState.Expired;
        } else {
            return ProposalState.Queued;
        }
    }

    /**
     * @dev Check if quorum has been reached
     */
    function _quorumReached(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.forVotes +
            proposal.againstVotes +
            proposal.abstainVotes;
        uint256 quorumVotes = (totalVotingPower * quorumPercentage) / 100;
        return totalVotes >= quorumVotes;
    }

    /**
     * @dev Add a new voter
     */
    function addVoter(
        address voterAddress,
        uint256 votingPower
    ) external onlyRole(ADMIN_ROLE) {
        require(voterAddress != address(0), "IssuerDAO: Invalid address");
        require(!voters[voterAddress].isActive, "IssuerDAO: Already a voter");
        require(votingPower > 0, "IssuerDAO: Invalid voting power");

        grantRole(VOTER_ROLE, voterAddress);

        voters[voterAddress] = Voter({
            voterAddress: voterAddress,
            votingPower: votingPower,
            proposalsCreated: 0,
            votesParticipated: 0,
            isActive: true
        });

        voterList.push(voterAddress);
        totalVotingPower += votingPower;

        emit VoterAdded(voterAddress, votingPower);
    }

    /**
     * @dev Remove a voter
     */
    function removeVoter(address voterAddress) external onlyRole(ADMIN_ROLE) {
        require(
            voters[voterAddress].isActive,
            "IssuerDAO: Not an active voter"
        );

        revokeRole(VOTER_ROLE, voterAddress);

        totalVotingPower -= voters[voterAddress].votingPower;
        voters[voterAddress].isActive = false;

        emit VoterRemoved(voterAddress);
    }

    /**
     * @dev Update voter's voting power
     */
    function updateVotingPower(
        address voterAddress,
        uint256 newVotingPower
    ) external onlyRole(ADMIN_ROLE) {
        require(
            voters[voterAddress].isActive,
            "IssuerDAO: Not an active voter"
        );
        require(newVotingPower > 0, "IssuerDAO: Invalid voting power");

        uint256 oldPower = voters[voterAddress].votingPower;
        totalVotingPower = totalVotingPower - oldPower + newVotingPower;
        voters[voterAddress].votingPower = newVotingPower;

        emit VotingPowerUpdated(voterAddress, newVotingPower);
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(
        uint256 proposalId
    )
        external
        view
        returns (
            uint256 id,
            address proposer,
            ProposalAction action,
            address targetIssuer,
            string memory description,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            uint256 startBlock,
            uint256 endBlock,
            uint256 eta,
            bool canceled,
            bool executed
        )
    {
        Proposal storage p = proposals[proposalId];
        return (
            p.id,
            p.proposer,
            p.action,
            p.targetIssuer,
            p.description,
            p.forVotes,
            p.againstVotes,
            p.abstainVotes,
            p.startBlock,
            p.endBlock,
            p.eta,
            p.canceled,
            p.executed
        );
    }

    /**
     * @dev Get voter's receipt for a proposal
     */
    function getReceipt(
        uint256 proposalId,
        address voter
    ) external view returns (bool hasVoted, uint8 support, uint256 votes) {
        Receipt storage receipt = proposals[proposalId].receipts[voter];
        return (receipt.hasVoted, receipt.support, receipt.votes);
    }

    /**
     * @dev Get all voters
     */
    function getAllVoters() external view returns (address[] memory) {
        return voterList;
    }

    /**
     * @dev Update voting period
     */
    function updateVotingPeriod(
        uint256 newPeriod
    ) external onlyRole(ADMIN_ROLE) {
        require(
            newPeriod >= 1 days && newPeriod <= 30 days,
            "IssuerDAO: Invalid period"
        );
        votingPeriod = newPeriod;
    }

    /**
     * @dev Update quorum percentage
     */
    function updateQuorum(uint256 newQuorum) external onlyRole(ADMIN_ROLE) {
        require(newQuorum > 0 && newQuorum <= 100, "IssuerDAO: Invalid quorum");
        quorumPercentage = newQuorum;
    }

    /**
     * @dev Pause DAO
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause DAO
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
