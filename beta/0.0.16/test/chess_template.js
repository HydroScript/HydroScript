const prompt = require("./prompt.js")
const { Chess } = require("chess.js")

const main = (async () => {

    const game = new Chess()
    let is_white = true
    let flipped = false

    const processBoard = ascii => {
        const board = ascii
            .replace("K", "♚")
            .replace("Q", "♛")
            .replace("R", "♜")
            .replace("R", "♜")
            .replace("B", "♝")
            .replace("B", "♝")
            .replace("N", "♞")
            .replace("N", "♞")
            .replaceAll("P", "♟︎")
            .replace("k", "♔")
            .replace("q", "♕")
            .replace("r", "♖")
            .replace("r", "♖")
            .replace("b", "♗")
            .replace("b", "♗")
            .replace("n", "♘")
            .replace("n", "♘")
            .replaceAll("p", "♙")
            .split("\n")
        board[3] += "  Black"
        board[4] += `  ${is_white && game.inCheck() ? (game.isCheckmate() ? "Checkmate" : "Check") : ""}`
        board[5] += `  ${!is_white && game.inCheck() ? (game.isCheckmate() ? "Checkmate" : "Check") : ""}`
        board[6] += "  White"
        return (flipped ? board.reverse() : board).join("\n")
    }

    const getEndCondition = () => {
        if (game.isStalemate()) return "Draw: Stalemate"
        if (game.isThreefoldRepetition()) return "Draw: Three Fold Repetition"
        if (game.isInsufficientMaterial()) return "Draw: Insufficient Material"
        if (game.isCheckmate()) return is_white ? "Black won: Checkmate" : "White won: Checkmate"
        else return "Game ended"
    }

    while (!game.isGameOver()) {
        console.log(processBoard(game.ascii()))
        const moves = game.moves()
        const moves_display = moves.map(v => (v.endsWith("#") || v.endsWith("+")) ? v.slice(0, -1) : v)
        let move = ""
        while (!moves_display.includes(move)) {
            move = await prompt(`==========\nValid moves: ${moves_display.join(" ")}\n==========\nType "FLIP" to flip the board\nEnter ${is_white ? "white" : "black"}'s move: `)
            if (move == "FLIP") {
                flipped = !flipped
                console.log(processBoard(game.ascii()))
            }
        }
        game.move(moves[moves_display.indexOf(move)])
        is_white = !is_white
    }
    console.log(`==========\n${getEndCondition()}\n==========\n\n${processBoard(game.ascii())}\n==========\nPGN\n==========\n${game.pgn()}`)

})
main()