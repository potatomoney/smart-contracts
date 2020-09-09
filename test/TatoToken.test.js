const { expectRevert } = require('@openzeppelin/test-helpers');
const TatoToken = artifacts.require('TatoToken');

contract('TatoToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.tato = await TatoToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.tato.name();
        const symbol = await this.tato.symbol();
        const decimals = await this.tato.decimals();
        assert.equal(name.valueOf(), 'TatoToken');
        assert.equal(symbol.valueOf(), 'TATO');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.tato.mint(alice, '100', { from: alice });
        await this.tato.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.tato.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.tato.totalSupply();
        const aliceBal = await this.tato.balanceOf(alice);
        const bobBal = await this.tato.balanceOf(bob);
        const carolBal = await this.tato.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.tato.mint(alice, '100', { from: alice });
        await this.tato.mint(bob, '1000', { from: alice });
        await this.tato.transfer(carol, '10', { from: alice });
        await this.tato.transfer(carol, '100', { from: bob });
        const totalSupply = await this.tato.totalSupply();
        const aliceBal = await this.tato.balanceOf(alice);
        const bobBal = await this.tato.balanceOf(bob);
        const carolBal = await this.tato.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.tato.mint(alice, '100', { from: alice });
        await expectRevert(
            this.tato.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.tato.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
