async function calcularRecurso(resource, amount, time) {

    var ok = true;

    var url = process.env.REACT_APP_BOT_URL + "prices"

    time = time.split("d")

    if (time.length >= 2) {

        if (parseInt(time[0]) < 1 || parseInt(time[0]) > 14) {
            this.setState({
                titulo: "Error Range",
                body: "Please enter a range of values between 1 and 14 days"
            })

            ok = false;

            window.$("#mensaje-ebot").modal("show");
        }
    } else {

        if (parseInt(time[0]) !== 1) {
            this.setState({
                titulo: "Error Range",
                body: "It is only available for 1 hour operations",
                periodo: "1"
            })

            ok = false;

            window.$("#mensaje-ebot").modal("show");
        }

    }


    time = time[0]

    if (parseInt(time) > 0 && ok) {
        var body = { "resource": resource, "amount": amount, "duration": time }

        var consulta2 = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        consulta2 = (await consulta2.json())

        var precio = consulta2.price * 1.1
        precio = parseInt(precio * 10 ** 6) / 10 ** 6

        return precio
    } else {

        return 0
    }
}

async function compra() {
    var precio = await this.calcularRecurso( "energy" ,"32000", "1h")
    var account = window.tronWeb.trx.getAccount();

    var wallet_orden = tronWeb.address.fromHex(account.address)
    
    var si = window.confirm("really buy " + "32000" + " Energy " + "1h" + " for " + precio + " TRX to " + wallet_orden + ", please sing the next transacction")

    if (si) {

        var hash = await window.tronWeb.trx.sendTransaction("TMY...Send to your Wallet pre payed", window.tronWeb.toSun(this.state.precio));

        await delay(3);

        var envio = hash.transaction.raw_data.contract[0].parameter.value

        if (hash.result && envio.amount + "" === window.tronWeb.toSun(precio) && window.tronWeb.address.fromHex(envio.to_address) === "TMY...Send to your Wallet pre payed") {

            hash = await window.tronWeb.trx.getTransaction(hash.txid);

            if (hash.ret[0].contractRet === "SUCCESS") {

                var url =  process.env.REACT_APP_BOT_URL + "energy"

                var body = {
                    "id_api": process.env.REACT_APP_USER_ID,
                    "wallet": wallet_orden,
                    "amount": cantidad,
                    "time": "1h",
                    "user_id": "5678"
                }

                var consulta2 = await fetch(url, {
                    method: "POST",
                    headers: {
                        'token-api': process.env.REACT_APP_TOKEN,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })

                consulta2 = (await consulta2.json())

                if (consulta2) {
                    window.alert("Completed successfully")
                } else {
                    window.alert("fail")
                }
            } else {
                window.alert("fail")
            }
        } else {
            window.alert("fail")
        }
    }
}

return () => {

    <div className="btn  btn-success text-white mb-2" onClick={() => this.compra()}>
        BUY &nbsp; <i className="bi bi-bag"></i>
    </div>
}