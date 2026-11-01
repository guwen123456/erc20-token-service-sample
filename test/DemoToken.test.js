const assert = require("node:assert");
const { ethers } = require("hardhat");

const SUPPLY = 1_000_000_000n * 10n ** 18n;

describe("DemoToken", function () {
  let token, owner, alice, bob;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("DemoToken");
    token = await Factory.deploy();
    await token.waitForDeployment();
  });

  it("has correct name, symbol and decimals", async function () {
    assert.equal(await token.name(), "Demo Token");
    assert.equal(await token.symbol(), "DEMO");
    assert.equal(await token.decimals(), 18n);
  });

  it("mints the full fixed supply to the deployer exactly once", async function () {
    assert.equal(await token.totalSupply(), SUPPLY);
    assert.equal(await token.balanceOf(owner.address), SUPPLY);
    assert.equal(await token.TOTAL_SUPPLY(), SUPPLY);
  });

  it("exposes no mint function", async function () {
    assert.equal(token.mint, undefined);
  });

  it("transfers tokens between accounts", async function () {
    const amount = ethers.parseEther("1000");
    await token.transfer(alice.address, amount);
    assert.equal(await token.balanceOf(alice.address), amount);
    assert.equal(await token.balanceOf(owner.address), SUPPLY - amount);
  });

  it("reverts when transferring more than the balance", async function () {
    await assert.rejects(token.connect(alice).transfer(bob.address, 1n));
  });

  it("supports approve + transferFrom", async function () {
    const amount = ethers.parseEther("500");
    await token.approve(alice.address, amount);
    await token.connect(alice).transferFrom(owner.address, bob.address, amount);
    assert.equal(await token.balanceOf(bob.address), amount);
    assert.equal(await token.allowance(owner.address, alice.address), 0n);
  });

  it("lets a holder burn their own tokens, reducing total supply", async function () {
    const amount = ethers.parseEther("100");
    await token.transfer(alice.address, amount);
    await token.connect(alice).burn(ethers.parseEther("40"));
    assert.equal(await token.balanceOf(alice.address), ethers.parseEther("60"));
    assert.equal(await token.totalSupply(), SUPPLY - ethers.parseEther("40"));
  });

  it("does not let anyone burn another holder's tokens without allowance", async function () {
    await token.transfer(alice.address, ethers.parseEther("10"));
    await assert.rejects(token.connect(bob).burnFrom(alice.address, 1n));
  });

  it("charges zero tax: receiver gets the exact sent amount", async function () {
    const amount = ethers.parseEther("12345.678");
    await token.transfer(alice.address, amount);
    assert.equal(await token.balanceOf(alice.address), amount);
  });

  it("renouncing ownership sets owner to the zero address", async function () {
    await token.renounceOwnership();
    assert.equal(await token.owner(), ethers.ZeroAddress);
  });
});
