
const Deed = artifacts.require("Deed");

module.exports = function(deployer, accounts){
    const law = "0xB37886973b3bbb4d9a2CcAb2a9Ab0914a46F3b60";
    const ben = "0x16cC187AF3bc8fce7AEF43007f4d5Daf93E022BD";
    deployer.deploy(Deed, law, ben, 1000, {value: 100000});
}