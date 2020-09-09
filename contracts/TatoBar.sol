pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract TatoBar is ERC20("TatoBar", "xTATO"){
    using SafeMath for uint256;
    IERC20 public tato;

    constructor(IERC20 _tato) public {
        tato = _tato;
    }

    // Enter the bar. Pay some TATOs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalTato = tato.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalTato == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalTato);
            _mint(msg.sender, what);
        }
        tato.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your TATOs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(tato.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        tato.transfer(msg.sender, what);
    }
}