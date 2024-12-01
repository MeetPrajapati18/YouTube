import { asyncHandler } from "../utils/asyncHandler.js";


const jokesList = asyncHandler( async (req, res) => {

    const jokes = [
        {
            "id": 1,
            "joke": "Why was the JavaScript developer sad? Because they didn't null how to handle their promise."
        },
        {
            "id": 2,
            "joke": "Why do programmers prefer dark mode? Because light attracts bugs!"
        },
        {
            "id": 3,
            "joke": "How do JavaScript developers like their coffee? They don't, they prefer Node."
        },
        {
            "id": 4,
            "joke": "Why did the variable break up with the function? Because it didn't get the return it expected."
        },
        {
            "id": 5,
            "joke": "What's a programmer's favorite type of music? Algo-rhythm!"
        }
    ]

    res.send(jokes);
})

export { jokesList }