

const Deed = artifacts.require("Deed");


contract("Deed", (accounts) => {
    let deed = null;
    before(async() => {
        deed = await Deed.deployed();
    })

    it('Should withdraw', async() =>{
        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        await new Promise(resolve => setTimeout(resolve, 5000));

        await deed.withdraw({from: accounts[0]});
        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
        assert(finalBalance.sub(initialBalance).toNumber() == 100);
    })

    it('Should NOT withdraw - too early', async() =>{
        //mesmos valores do migrations
        const deed = await Deed.new(accounts[0], accounts[1], 5, {value:100});
        try {
            await deed.withdraw({from: accounts[0]});    
        } catch (error) {
            assert(e.message.includes("Too early"));
            return;
        }
        assert(false);

    })

    it('Should NOT withdraw - Is not lawyer', async() =>{
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            await deed.withdraw({from: accounts[3]});    
        } catch (error) {
            assert(e.message.includes("Lawyer Only can do it"));
            return;
        }
        assert(false);
    })
})