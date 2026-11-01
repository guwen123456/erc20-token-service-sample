// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title DemoToken (DEMO) — testnet demonstration token
/// @notice Fixed supply of 1,000,000,000 tokens minted once to the deployer
///         in the constructor. There is NO mint function, no tax, no
///         blacklist, no pause and no transfer limits. Holders may burn
///         their own tokens (ERC20Burnable). Ownable is present only so
///         ownership can be renounced; it gates no token functionality.
contract DemoToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor() ERC20("Demo Token", "DEMO") Ownable(msg.sender) {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}
