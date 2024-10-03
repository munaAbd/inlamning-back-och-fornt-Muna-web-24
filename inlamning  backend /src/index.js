import express from "express";

import cors from "cors";

import * as db from "./handled.js";

import { body, validationResult } from "express-validator";

const PORT = 3003;

const app = express();

let appGeneratedNumber = Math.floor(Math.random() * 3) + 1;  // Random number between 1 and 3

let currentScore = 0;  // Track the score for the player in this session

// Validation middleware

const validations = [

   body("name").exists().notEmpty().isString(),

   body("score").exists().notEmpty().isInt({ min: 1, max: 3 }),

];
app.use(express.json());

app.use(cors());

// Route to get top 5 high scores

app.get('/top5points', async (req, res) => {

   const top5Points = await db.getTop5Points();

   res.json(top5Points);

});

app.post('/top5points', validations, async (req, res) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {

       console.log(errors.array());

       return res.status(400).json({ message: 'Invalid value' });

   }

 const { name, score: guessedNumber } = req.body;

// Check if the guess is correct

   if (guessedNumber === appGeneratedNumber) {

       currentScore++;

       appGeneratedNumber = Math.floor(Math.random() * 3) + 1;  // Generate a new random number

       return res.json({ message: `Correct guess! Your score is now ${currentScore}` });

   } else {

       const top5Points = await db.getTop5Points();

       const minScore = Math.min(...top5Points.map(p => p.score));




       if (currentScore > minScore || top5Points.length < 5) {

           await db.addScoreToHighscoreList({ name, score: currentScore });

           res.json({ message: 'Wrong guess, but you made it to the highscore!' });

       } else {

           res.json({ message: 'Wrong guess. Try again!' });

       }

       currentScore = 0;  // Reset the player's score

       appGeneratedNumber = Math.floor(Math.random() * 3) + 1;  // Generate a new random number

   }

});

app.listen(PORT, () => {

   console.log('Listening on port', PORT);

});


