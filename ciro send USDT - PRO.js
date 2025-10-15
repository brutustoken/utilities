
import TronWeb from 'tronweb';

const ciroTrxAddress = "TU7B67Bf6C4yMWzMP7sjDNFsp4nL4QGLbz";
const TokenToSend = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT
const RED = "https://api.trongrid.io";

async function sendUSDT(privateKey, amountToken, toWallet) {

    const tronWeb = new TronWeb({
        fullHost: RED,
        //headers: { "TRON-PRO-API-KEY": "XXXXXXXXXXXXXXX" },
        privateKey
    })

    let account = await tronWeb.trx.getAccount();

    /** Aproval spend USDT to CIRO contract */
    /**
    let inputs = [
      { type: 'address', value: tronWeb.address.toHex(ciroTrxAddress) },
      { type: 'uint256', value: "115792089237316195423570985008687907853269984665640564039457584007913129639935" }
    ]
    var trigger = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(TokenToSend), "approve(address,uint256)", {}, inputs, tronWeb.address.toHex(account.address))
    var transaction = await tronWeb.transactionBuilder.extendExpiration(trigger.transaction, 60)
     transaction = await tronWeb.trx.sign(transaction)
      .catch((e) => {console.log(e); return false;})
    transaction = await tronWeb.trx.sendRawTransaction(transaction)
      .catch((e) => {console.log(e) ; return {txid:false};})

    */


    /** Send USDT to indicated wallet */
    inputs = [
        { type: 'address', value: tronWeb.address.toHex(toWallet) },
        { type: 'uint256', value: tronWeb.toSun(amountToken) }, // 6 decimals
        { type: 'address', value: tronWeb.address.toHex(TokenToSend) }
    ]
    var trigger = await tronWeb.transactionBuilder.triggerSmartContract(tronWeb.address.toHex(ciroTrxAddress), "transfer(address,uint256,address)", {}, inputs, tronWeb.address.toHex(account.address))
        .catch((e) => { console.log(e); return false; })
    var transaction = await tronWeb.transactionBuilder.extendExpiration(trigger.transaction, 60);
    transaction = await tronWeb.trx.sign(transaction)
        .catch((e) => { console.log(e); return { txid: false }; })
    transaction = await tronWeb.trx.sendRawTransaction(transaction)


    if (transaction.txid) {
        console.log("Transaction ID: " + transaction.txid)
        return true;
    }else{
        return false;
    }
}

sendUSDT("0x...", 1.000001, "TXSvbF6MSukLMrYiLA5PfLHaPh97up2aGm")