// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DateUtils
 * @dev Library for handling date and time operations for credential expiration
 */
library DateUtils {
    
    // Constants for time calculations
    uint256 public constant SECONDS_PER_DAY = 86400;
    uint256 public constant SECONDS_PER_HOUR = 3600;
    uint256 public constant SECONDS_PER_MINUTE = 60;
    uint256 public constant DAYS_PER_YEAR = 365;
    uint256 public constant SECONDS_PER_YEAR = DAYS_PER_YEAR * SECONDS_PER_DAY;

    /**
     * @dev Check if a credential has expired
     * @param expirationDate The expiration timestamp (0 means never expires)
     * @return True if expired, false otherwise
     */
    function isExpired(uint256 expirationDate) internal view returns (bool) {
        // If expiration date is 0, credential never expires
        if (expirationDate == 0) {
            return false;
        }
        return block.timestamp > expirationDate;
    }

    /**
     * @dev Check if a credential is still valid (not expired)
     * @param expirationDate The expiration timestamp
     * @return True if valid, false if expired
     */
    function isValid(uint256 expirationDate) internal view returns (bool) {
        return !isExpired(expirationDate);
    }

    /**
     * @dev Get the current block timestamp
     * @return Current timestamp
     */
    function getCurrentTimestamp() internal view returns (uint256) {
        return block.timestamp;
    }

    /**
     * @dev Calculate expiration date from issue date and duration in days
     * @param issueDate The timestamp when credential was issued
     * @param durationInDays Number of days until expiration
     * @return Expiration timestamp
     */
    function calculateExpirationDate(uint256 issueDate, uint256 durationInDays) 
        internal 
        pure 
        returns (uint256) 
    {
        require(issueDate > 0, "DateUtils: Invalid issue date");
        require(durationInDays > 0, "DateUtils: Duration must be positive");
        
        return issueDate + (durationInDays * SECONDS_PER_DAY);
    }

    /**
     * @dev Calculate expiration date from current time and duration in days
     * @param durationInDays Number of days from now until expiration
     * @return Expiration timestamp
     */
    function calculateExpirationFromNow(uint256 durationInDays) 
        internal 
        view 
        returns (uint256) 
    {
        return calculateExpirationDate(block.timestamp, durationInDays);
    }

    /**
     * @dev Calculate expiration date for a given number of years from issue date
     * @param issueDate The timestamp when credential was issued
     * @param _years Number of years until expiration
     * @return Expiration timestamp
     */
    function calculateExpirationInYears(uint256 issueDate, uint256 _years) 
        internal 
        pure 
        returns (uint256) 
    {
        require(issueDate > 0, "DateUtils: Invalid issue date");
        require(_years > 0, "DateUtils: Years must be positive");
        
        return issueDate + (_years * SECONDS_PER_YEAR);
    }

    /**
     * @dev Get remaining time until expiration in seconds
     * @param expirationDate The expiration timestamp
     * @return Remaining seconds (0 if already expired or never expires)
     */
    function getRemainingTime(uint256 expirationDate) 
        internal 
        view 
        returns (uint256) 
    {
        if (expirationDate == 0 || block.timestamp >= expirationDate) {
            return 0;
        }
        return expirationDate - block.timestamp;
    }

    /**
     * @dev Get remaining days until expiration
     * @param expirationDate The expiration timestamp
     * @return Remaining days (0 if already expired or never expires)
     */
    function getRemainingDays(uint256 expirationDate) 
        internal 
        view 
        returns (uint256) 
    {
        uint256 remainingSeconds = getRemainingTime(expirationDate);
        return remainingSeconds / SECONDS_PER_DAY;
    }

    /**
     * @dev Check if expiration date is within a certain number of days
     * @param expirationDate The expiration timestamp
     * @param daysThreshold Number of days to check against
     * @return True if expiration is within threshold, false otherwise
     */
    function isExpiringWithin(uint256 expirationDate, uint256 daysThreshold) 
        internal 
        view 
        returns (bool) 
    {
        if (expirationDate == 0) {
            return false; // Never expires
        }
        
        uint256 thresholdTimestamp = block.timestamp + (daysThreshold * SECONDS_PER_DAY);
        return expirationDate <= thresholdTimestamp;
    }

    /**
     * @dev Validate that expiration date is in the future
     * @param expirationDate The expiration timestamp to validate
     * @return True if valid (in future or 0), false otherwise
     */
    function isValidExpirationDate(uint256 expirationDate) 
        internal 
        view 
        returns (bool) 
    {
        // 0 means never expires (valid)
        if (expirationDate == 0) {
            return true;
        }
        // Must be in the future
        return expirationDate > block.timestamp;
    }

    /**
     * @dev Validate that issue date is not in the future
     * @param issueDate The issue timestamp to validate
     * @return True if valid (past or present), false otherwise
     */
    function isValidIssueDate(uint256 issueDate) 
        internal 
        view 
        returns (bool) 
    {
        return issueDate > 0 && issueDate <= block.timestamp;
    }

    /**
     * @dev Add days to a given timestamp
     * @param timestamp The base timestamp
     * @param daysToAdd Number of days to add
     * @return New timestamp
     */
    function addDays(uint256 timestamp, uint256 daysToAdd) 
        internal 
        pure 
        returns (uint256) 
    {
        return timestamp + (daysToAdd * SECONDS_PER_DAY);
    }

    /**
     * @dev Add years to a given timestamp
     * @param timestamp The base timestamp
     * @param yearsToAdd Number of years to add
     * @return New timestamp
     */
    function addYears(uint256 timestamp, uint256 yearsToAdd) 
        internal 
        pure 
        returns (uint256) 
    {
        return timestamp + (yearsToAdd * SECONDS_PER_YEAR);
    }
}
