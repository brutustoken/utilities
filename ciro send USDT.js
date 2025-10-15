
import TronWeb from 'tronweb';

const ciroTrxAddress = "TXSvbF6MSukLMrYiLA5PfLHaPh97up2aGm"
const RED = "https://api.trongrid.io"

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
      { type: 'address', value: ciroTrxAddress },
      { type: 'uint256', value: "115792089237316195423570985008687907853269984665640564039457584007913129639935" }
    ]
    var trigger = await tronWeb.transactionBuilder.triggerSmartContract("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", "approve(address,uint256)", {}, inputs, account.address)
    var transaction = await tronWeb.transactionBuilder.extendExpiration(trigger.transaction, 60)
     transaction = await tronWeb.trx.sign(transaction)
      .catch((e) => {console.log(e); return false;})
    transaction = await tronWeb.trx.sendRawTransaction(transaction)
      .catch((e) => {console.log(e) ; return {txid:false};})

    */


    /** Send USDT to indicated wallet */
    inputs = [
        { type: 'address', value: TronWeb.address.toHex(toWallet) },
        { type: 'uint256', value: TronWeb.toSun(amountToken) }, // 6 decimals
        { type: 'uint256', value: 0 }
    ]
    var trigger = await tronWeb.transactionBuilder.triggerSmartContract(ciroTrxAddress, "transfer(address,uint256,uint256)", {}, inputs, account.address)
        .catch((e) => { console.log(e); return false; })
    var transaction = await tronWeb.transactionBuilder.extendExpiration(trigger.transaction, 60);
    transaction = await tronWeb.trx.sign(transaction)
        .catch((e) => { console.log(e); return { txid: false }; })
    transaction = await tronWeb.trx.sendRawTransaction(transaction)


    if (transaction.txid) {
        return true;
    }else{
        return false;
    }
}

sendUSDT("0x...", 1.000001, "TXSvbF6MSukLMrYiLA5PfLHaPh97up2aGm")