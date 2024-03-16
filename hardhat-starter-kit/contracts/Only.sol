// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OnlyToken is ERC20 {
    constructor() ERC20("Only", "ONLY") {
        _mint(msg.sender, 1_000_000_000 * (10 ** 18) );
    }
}