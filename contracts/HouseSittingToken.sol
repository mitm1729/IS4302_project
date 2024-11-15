// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HouseSittingToken is ERC1155, Ownable {

    // Mapping for token-specific URIs (optional if needed)
    // mapping(uint256 => string) private _tokenURIs;

    constructor() ERC1155("") {
        // Minting initial house-sitting tokens
        _mint(msg.sender, 1, 1000, ""); // 1000 of token ID 1 (fungible)
        // Future reference: 
        // _mint(msg.sender, 2, 500, "");  // 500 of token ID 2 (fungible)
        // _mint(msg.sender, 1001, 1, ""); // 1 of token ID 1001 (non-fungible)
    }
}