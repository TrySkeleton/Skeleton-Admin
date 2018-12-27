const REQUEST = "REQUEST"

const request = (topic, payload) => {

    // TODO: Get app session
    const session = { token: "" }

    return new Promise((resolve, reject) => {

        fetch('/skeleton/api/connect', {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${session.token}`
            },
            body: JSON.stringify({
                topic, payload
            })
        }).then(res => {

            const status = res.status

            if (status === 401) {
                reject(new Error("Unauthorized"))
                return
            }

            return res.json()

        }).then(data => {

            const type = data.type

            if (type === "SUCCESS") {
                resolve(data.payload)
            } else if (type === "ERROR") {
                reject(new Error(data.error))
            }

        }).catch(err => {
            console.log(`Network error: ${err.message}`)
            reject(err)
        })
    })
}

export default { request, REQUEST }

