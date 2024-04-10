const readline = require("readline")

module.exports = function prompt(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise(resolve => rl.question(query, ans => {
        rl.close()
        resolve(ans)
    }))
}