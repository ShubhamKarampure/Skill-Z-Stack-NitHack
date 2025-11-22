// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IssuerDAO.sol";
import "./Timelock.sol";
import "../interfaces/IIssuer.sol";

/**
 * @title GovernanceHelper
 * @dev Helper contract for governance operations
 */
contract GovernanceHelper {
    IssuerDAO public dao;
    Timelock public timelock;
    IIssuer public issuerRegistry;

    event GovernanceSetup(
        address indexed dao,
        address indexed timelock,
        address indexed issuerRegistry
    );

    constructor(
        address _daoAddress,
        address _timelockAddress,
        address _issuerRegistryAddress
    ) {
        require(
            _daoAddress != address(0),
            "GovernanceHelper: Invalid DAO address"
        );
        require(
            _timelockAddress != address(0),
            "GovernanceHelper: Invalid timelock address"
        );
        require(
            _issuerRegistryAddress != address(0),
            "GovernanceHelper: Invalid registry address"
        );

        dao = IssuerDAO(_daoAddress);
        timelock = Timelock(payable(_timelockAddress));
        issuerRegistry = IIssuer(_issuerRegistryAddress);

        emit GovernanceSetup(
            _daoAddress,
            _timelockAddress,
            _issuerRegistryAddress
        );
    }

    /**
     * @dev Get complete proposal info with state
     */
    function getProposalInfo(
        uint256 proposalId
    )
        external
        view
        returns (
            uint256 id,
            address proposer,
            IssuerDAO.ProposalAction action,
            address targetIssuer,
            string memory description,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            IssuerDAO.ProposalState currentState,
            uint256 eta
        )
    {
        IssuerDAO.ProposalView memory p = dao.getProposal(proposalId);
        currentState = dao.state(proposalId);

        return (
            p.id,
            p.proposer,
            p.action,
            p.targetIssuer,
            p.description,
            p.forVotes,
            p.againstVotes,
            p.abstainVotes,
            currentState,
            p.eta
        );
    }

    /**
     * @dev Check if address can create proposals
     */
    function canCreateProposal(address voter) external view returns (bool) {
        (, uint256 votingPower, , , bool isActive) = dao.voters(voter);
        return isActive && votingPower >= dao.proposalThreshold();
    }

    /**
     * @dev Get voting stats for an address
     */
    function getVotingStats(
        address voter
    )
        external
        view
        returns (
            uint256 votingPower,
            uint256 proposalsCreated,
            uint256 votesParticipated,
            bool isActive
        )
    {
        (, votingPower, proposalsCreated, votesParticipated, isActive) = dao
            .voters(voter);
        return (votingPower, proposalsCreated, votesParticipated, isActive);
    }
}
