
async function rentEnergy({ wallet, amount, duration, resource, id_api, token }) {
	let res = { result: false, error: false, msg: "" }
	let url = "https://e-bot.brutusservices.com/main/energy" //energy : bandwidth

	let body = {
		"id_api": id_api,
		"wallet": wallet,
		"amount": amount,
		"time": duration
	}

	let request = await fetch(url, {
		method: "POST",
		headers: {
			'token-api': token,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})
		.then((r) => r.json())
		.catch((e) => {
			console.log(e)
			return { response: 0, msg: "Error-API: Asignation Energy" }
		})

	if (request.response === 1) {

		res.result = true

	} else {
		res.error = true
		res.msg = request.msg
	}
	
	return res
}