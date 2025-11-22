// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Timelock
 * @dev Time-delayed execution of governance proposals
 * Provides security by requiring a delay between proposal approval and execution
 */
contract Timelock is AccessControl {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");

    // Timelock parameters
    uint256 public constant MINIMUM_DELAY = 1 days;
    uint256 public constant MAXIMUM_DELAY = 30 days;
    uint256 public constant GRACE_PERIOD = 14 days;

    uint256 public delay;
    uint256 public gracePeriod;

    // Transaction states
    enum TransactionState {
        Nonexistent,
        Queued,
        Executed,
        Cancelled
    }

    // Queued transaction structure
    struct QueuedTransaction {
        bytes32 txHash;
        address target;
        uint256 value;
        string signature;
        bytes data;
        uint256 eta;
        TransactionState state;
    }

    // Storage
    mapping(bytes32 => QueuedTransaction) public queuedTransactions;
    bytes32[] public transactionHashes;

    // Events
    event TransactionQueued(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );

    event TransactionExecuted(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 executionTime
    );

    event TransactionCancelled(bytes32 indexed txHash);

    event DelayUpdated(uint256 oldDelay, uint256 newDelay);

    constructor(uint256 _delay) {
        require(
            _delay >= MINIMUM_DELAY && _delay <= MAXIMUM_DELAY,
            "Timelock: Invalid delay"
        );

        delay = _delay;
        gracePeriod = GRACE_PERIOD;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(PROPOSER_ROLE, msg.sender);
        _setupRole(EXECUTOR_ROLE, msg.sender);
        _setupRole(CANCELLER_ROLE, msg.sender);
    }

    /**
     * @dev Queue a transaction for execution after delay
     */
    function queueTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) external onlyRole(PROPOSER_ROLE) returns (bytes32) {
        require(target != address(0), "Timelock: Invalid target");
        require(
            eta >= block.timestamp + delay,
            "Timelock: ETA must satisfy delay"
        );

        bytes32 txHash = keccak256(
            abi.encode(target, value, signature, data, eta)
        );

        require(
            queuedTransactions[txHash].state == TransactionState.Nonexistent,
            "Timelock: Transaction already queued"
        );

        queuedTransactions[txHash] = QueuedTransaction({
            txHash: txHash,
            target: target,
            value: value,
            signature: signature,
            data: data,
            eta: eta,
            state: TransactionState.Queued
        });

        transactionHashes.push(txHash);

        emit TransactionQueued(txHash, target, value, signature, data, eta);

        return txHash;
    }

    /**
     * @dev Execute a queued transaction after the delay has passed
     */
    function executeTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) external payable onlyRole(EXECUTOR_ROLE) returns (bytes memory) {
        bytes32 txHash = keccak256(
            abi.encode(target, value, signature, data, eta)
        );

        QueuedTransaction storage queuedTx = queuedTransactions[txHash];

        require(
            queuedTx.state == TransactionState.Queued,
            "Timelock: Transaction not queued"
        );
        require(
            block.timestamp >= eta,
            "Timelock: Transaction hasn't surpassed time lock"
        );
        require(
            block.timestamp <= eta + gracePeriod,
            "Timelock: Transaction is stale"
        );

        queuedTx.state = TransactionState.Executed;

        bytes memory callData;

        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(
                bytes4(keccak256(bytes(signature))),
                data
            );
        }

        (bool success, bytes memory returnData) = target.call{value: value}(
            callData
        );
        require(success, "Timelock: Transaction execution reverted");

        emit TransactionExecuted(
            txHash,
            target,
            value,
            signature,
            data,
            block.timestamp
        );

        return returnData;
    }

    /**
     * @dev Cancel a queued transaction
     */
    function cancelTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) external onlyRole(CANCELLER_ROLE) {
        bytes32 txHash = keccak256(
            abi.encode(target, value, signature, data, eta)
        );

        QueuedTransaction storage queuedTx = queuedTransactions[txHash];

        require(
            queuedTx.state == TransactionState.Queued,
            "Timelock: Transaction not queued"
        );

        queuedTx.state = TransactionState.Cancelled;

        emit TransactionCancelled(txHash);
    }

    /**
     * @dev Get transaction state
     */
    function getTransactionState(
        bytes32 txHash
    ) external view returns (TransactionState) {
        return queuedTransactions[txHash].state;
    }

    /**
     * @dev Check if transaction is queued
     */
    function isQueued(bytes32 txHash) external view returns (bool) {
        return queuedTransactions[txHash].state == TransactionState.Queued;
    }

    /**
     * @dev Get queued transaction details
     */
    function getQueuedTransaction(
        bytes32 txHash
    )
        external
        view
        returns (
            address target,
            uint256 value,
            string memory signature,
            bytes memory data,
            uint256 eta,
            TransactionState state
        )
    {
        QueuedTransaction storage queuedTx = queuedTransactions[txHash];
        return (
            queuedTx.target,
            queuedTx.value,
            queuedTx.signature,
            queuedTx.data,
            queuedTx.eta,
            queuedTx.state
        );
    }

    /**
     * @dev Get all queued transaction hashes
     */
    function getAllTransactionHashes()
        external
        view
        returns (bytes32[] memory)
    {
        return transactionHashes;
    }

    /**
     * @dev Get total number of transactions
     */
    function getTransactionCount() external view returns (uint256) {
        return transactionHashes.length;
    }

    /**
     * @dev Update delay (requires timelock itself)
     */
    function updateDelay(uint256 newDelay) external {
        require(
            msg.sender == address(this),
            "Timelock: Call must come from Timelock"
        );
        require(
            newDelay >= MINIMUM_DELAY && newDelay <= MAXIMUM_DELAY,
            "Timelock: Invalid delay"
        );

        uint256 oldDelay = delay;
        delay = newDelay;

        emit DelayUpdated(oldDelay, newDelay);
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {}

    /**
     * @dev Fallback function
     */
    fallback() external payable {}
}
