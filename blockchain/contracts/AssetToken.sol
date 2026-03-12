// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AssetToken is ERC20, Ownable, ReentrancyGuard {
    struct Asset {
        string name;
        string assetType;
        uint256 totalValue;
        uint256 totalSupply;
        uint256 tokenPrice;
        bool isActive;
    }

    mapping(uint256 => Asset) public assets;
    mapping(uint256 => mapping(address => uint256)) public tokenHoldings;
    uint256[] public assetIds;
    uint256 public nextAssetId = 1;

    event AssetCreated(
        uint256 indexed assetId,
        string name,
        string assetType,
        uint256 totalValue,
        uint256 totalSupply,
        uint256 tokenPrice
    );

    event TokensPurchased(
        uint256 indexed assetId,
        address indexed buyer,
        uint256 amount,
        uint256 cost
    );

    event ProfitDistributed(
        uint256 indexed assetId,
        uint256 totalAmount,
        uint256 totalSupply
    );

    constructor() ERC20("FractionFi", "FFI") {}

    function createAssetToken(
        string memory _name,
        string memory _assetType,
        uint256 _totalValue,
        uint256 _totalSupply
    ) external onlyOwner {
        require(_totalValue > 0, "Total value must be greater than 0");
        require(_totalSupply > 0, "Total supply must be greater than 0");

        uint256 tokenPrice = _totalValue / _totalSupply;
        
        assets[nextAssetId] = Asset({
            name: _name,
            assetType: _assetType,
            totalValue: _totalValue,
            totalSupply: _totalSupply,
            tokenPrice: tokenPrice,
            isActive: true
        });

        assetIds.push(nextAssetId);

        emit AssetCreated(nextAssetId, _name, _assetType, _totalValue, _totalSupply, tokenPrice);
        nextAssetId++;
    }

    function buyTokens(uint256 _assetId, uint256 _amount) external payable nonReentrant {
        require(assets[_assetId].isActive, "Asset is not active");
        require(_amount > 0, "Amount must be greater than 0");
        
        uint256 cost = assets[_assetId].tokenPrice * _amount;
        require(msg.value >= cost, "Insufficient payment");

        tokenHoldings[_assetId][msg.sender] += _amount;
        
        emit TokensPurchased(_assetId, msg.sender, _amount, cost);
        
        // Refund excess payment
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
    }

    function getOwnership(uint256 _assetId, address _owner) external view returns (uint256) {
        return tokenHoldings[_assetId][_owner];
    }

    function distributeProfits(uint256 _assetId) external payable onlyOwner nonReentrant {
        require(assets[_assetId].isActive, "Asset is not active");
        require(msg.value > 0, "Profit amount must be greater than 0");

        uint256 totalSupply = assets[_assetId].totalSupply;
        require(totalSupply > 0, "Total supply must be greater than 0");

        uint256 profitPerToken = msg.value / totalSupply;

        for (uint256 i = 0; i < assetIds.length; i++) {
            uint256 currentAssetId = assetIds[i];
            if (currentAssetId == _assetId) {
                // In a real implementation, you'd iterate through token holders
                // For simplicity, this is a basic implementation
                break;
            }
        }

        emit ProfitDistributed(_assetId, msg.value, totalSupply);
    }

    function getAsset(uint256 _assetId) external view returns (Asset memory) {
        return assets[_assetId];
    }

    function getAllAssets() external view returns (Asset[] memory) {
        Asset[] memory allAssets = new Asset[](assetIds.length);
        for (uint256 i = 0; i < assetIds.length; i++) {
            allAssets[i] = assets[assetIds[i]];
        }
        return allAssets;
    }

    function getAvailableTokens(uint256 _assetId) external view returns (uint256) {
        uint256 totalSold = 0;
        // In a real implementation, you'd track total sold tokens
        // For simplicity, returning total supply
        return assets[_assetId].totalSupply - totalSold;
    }
}
