// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataMarketplace is Ownable {

    uint256 public constant PRICE = 10 ether; // Price for accessing data (10,000 EUR equivalent in ETH)
    uint256 public sellerCount = 0; // Number of sellers in the marketplace

    // Structure to store seller information
    struct Seller {
        address sellerAddress;
        uint256 earnings;
        string dataHash;  // Encrypted data stored off-chain (Filecoin, IPFS, etc.)
    }

    // Mapping from seller ID to Seller struct
    mapping(uint256 => Seller) public sellers;

    // Mapping from buyer addresses to whether they have purchased access
    mapping(address => bool) public hasPurchased;

    // Events
    event DataPurchased(address indexed buyer, uint256 sellerId);
    event SellerRegistered(address indexed seller, uint256 sellerId, string dataHash);
    event FundsWithdrawn(address indexed seller, uint256 amount);

    // Register a new seller with their encrypted data (stored off-chain)
    function registerSeller(string memory _dataHash) external {
        sellers[sellerCount] = Seller({
            sellerAddress: msg.sender,
            earnings: 0,
            dataHash: _dataHash
        });
        emit SellerRegistered(msg.sender, sellerCount, _dataHash);
        sellerCount++;
    }

    // Buyer purchases access to a seller's data
    function purchaseData(uint256 _sellerId) external payable {
        require(msg.value == PRICE, "Incorrect payment amount.");
        require(!hasPurchased[msg.sender], "You have already purchased access.");
        require(_sellerId < sellerCount, "Invalid seller ID.");

        // Mark the buyer as having purchased data
        hasPurchased[msg.sender] = true;

        // Increment the seller's earnings
        sellers[_sellerId].earnings += msg.value;

        // Emit event for the purchase
        emit DataPurchased(msg.sender, _sellerId);
    }

    // Sellers can withdraw their earnings
    function withdrawEarnings() external {
        uint256 totalEarnings = 0;

        for (uint256 i = 0; i < sellerCount; i++) {
            if (sellers[i].sellerAddress == msg.sender) {
                totalEarnings += sellers[i].earnings;
                sellers[i].earnings = 0;
            }
        }

        require(totalEarnings > 0, "No earnings to withdraw.");
        payable(msg.sender).transfer(totalEarnings);

        emit FundsWithdrawn(msg.sender, totalEarnings);
    }

    // Function to get the decryption key for buyers
    function getDecryptionKey(uint256 _sellerId) external view returns (string memory) {
        require(hasPurchased[msg.sender], "You must purchase data to get the decryption key.");
        require(_sellerId < sellerCount, "Invalid seller ID.");

        // Return the off-chain stored data hash (this could be used to fetch the decryption key)
        return sellers[_sellerId].dataHash;
    }

    // Fallback function to prevent accidental ETH transfers to contract
    receive() external payable {
        revert("Cannot send ETH directly.");
    }
}
