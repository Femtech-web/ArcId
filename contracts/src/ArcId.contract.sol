// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { Ownable } from "openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "openzeppelin/contracts/token/ERC721/ERC721.sol";

error ZeroAddress();
error OnlyVerifier();
error IdentityExists();
error NoIdentity();
error NotAuthorized();
error TokenDoesNotExist();
error SoulboundTransferBlocked();

contract ArcID is ERC721, Ownable {
  uint256 private _tokenIds;
  address public verifier;

  struct Identity {
    bytes32 dataHash;
    bool verified;
    uint16 creditScore;
    uint64 issuedAt;
    string metadataURI;
  }

  mapping(uint256 tokenId => Identity identity) public identities;
  mapping(address userAddress => uint256 tokenId) public identityOf;

  event VerifierUpdated(address indexed oldVerifier, address indexed newVerifier);
  event IdentityMinted(address indexed user, uint256 indexed tokenId, bytes32 dataHash);
  event IdentityUpdated(address indexed user, uint256 indexed tokenId, bytes32 dataHash);
  event IdentityReverified(address indexed user, uint256 indexed tokenId, bytes32 newHash);
  event IdentityRevoked(address indexed user, uint256 indexed tokenId);

  modifier onlyVerifier() {
    _onlyVerifier();
    _;
  }

  function _onlyVerifier() internal view {
    if (msg.sender != verifier) revert OnlyVerifier();
  }

  constructor(address _verifier, address _owner) ERC721("ArcID", "ARCID") Ownable(_owner) {
    if (_verifier == address(0)) revert ZeroAddress();
    verifier = _verifier;
  }

  function setVerifier(address _verifier) external onlyOwner {
    if (_verifier == address(0)) revert ZeroAddress();
    address old = verifier;
    verifier = _verifier;
    emit VerifierUpdated(old, _verifier);
  }

  function mintIdentity(
    address to,
    bytes32 dataHash,
    string calldata metadataURI,
    uint16 creditScore
  ) external onlyVerifier returns (uint256) {
    if (to == address(0)) revert ZeroAddress();
    if (identityOf[to] != 0) revert IdentityExists();

    _tokenIds += 1;
    uint256 newId = _tokenIds;

    _safeMint(to, newId);

    identities[newId] = Identity({
      dataHash: dataHash,
      verified: true,
      creditScore: creditScore,
      issuedAt: uint64(block.timestamp),
      metadataURI: metadataURI
    });

    identityOf[to] = newId;
    emit IdentityMinted(to, newId, dataHash);
    return newId;
  }

  function updateIdentity(
    address user,
    bytes32 newDataHash,
    string calldata newMetadataURI,
    uint16 newCreditScore,
    bool verifiedFlag
  ) external onlyVerifier {
    uint256 tokenId = identityOf[user];
    if (tokenId == 0) revert NoIdentity();

    Identity storage rec = identities[tokenId];
    rec.dataHash = newDataHash;
    rec.metadataURI = newMetadataURI;
    rec.creditScore = newCreditScore;
    rec.verified = verifiedFlag;
    rec.issuedAt = uint64(block.timestamp);

    emit IdentityUpdated(user, tokenId, newDataHash);
  }

  function reverifyIdentity(
    address user,
    bytes32 refreshedHash,
    string calldata refreshedURI,
    uint16 refreshedScore
  ) external onlyVerifier {
    uint256 tokenId = identityOf[user];
    if (tokenId == 0) revert NoIdentity();

    Identity storage rec = identities[tokenId];
    rec.dataHash = refreshedHash;
    rec.metadataURI = refreshedURI;
    rec.creditScore = refreshedScore;
    rec.verified = true;
    rec.issuedAt = uint64(block.timestamp);

    emit IdentityReverified(user, tokenId, refreshedHash);
  }

  function revokeIdentity(address user) external {
    uint256 tokenId = identityOf[user];
    if (tokenId == 0) revert NoIdentity();
    if (msg.sender != verifier && msg.sender != owner()) revert NotAuthorized();

    identities[tokenId].verified = false;
    identityOf[user] = 0;
    emit IdentityRevoked(user, tokenId);
  }

  function isVerified(address user) external view returns (bool) {
    uint256 tokenId = identityOf[user];
    if (tokenId == 0) return false;
    return identities[tokenId].verified;
  }

  function getCreditScore(address user) external view returns (uint16) {
    uint256 tokenId = identityOf[user];
    if (tokenId == 0) revert NoIdentity();
    return identities[tokenId].creditScore;
  }

  function getIdentityData(address user) external view returns (Identity memory) {
    uint256 tokenId = identityOf[user];
    if (tokenId == 0) revert NoIdentity();
    return identities[tokenId];
  }

  function tokenDataHash(uint256 tokenId) external view returns (bytes32) {
    if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
    return identities[tokenId].dataHash;
  }

  function tokenMetadataURI(uint256 tokenId) public view returns (string memory) {
    if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
    return identities[tokenId].metadataURI;
  }

  function _update(address to, uint256 tokenId, address auth)
    internal
    virtual
    override
    returns (address)
  {
    // Disallow transfers between wallets
    address from = _ownerOf(tokenId);
    if (from != address(0) && to != address(0)) revert SoulboundTransferBlocked();

    // Allow minting (from == 0) and burning (to == 0)
    return super._update(to, tokenId, auth);
  }

  function approve(address, uint256) public virtual override {
    revert SoulboundTransferBlocked();
  }

  function setApprovalForAll(address, bool) public virtual override {
    revert SoulboundTransferBlocked();
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
    return identities[tokenId].metadataURI;
  }
}
