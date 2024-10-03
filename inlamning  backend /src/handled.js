import fs from "fs/promises";
// Function to retrieve top 5 high scores

async function getTop5Points() {

   try {

       const rawData = await fs.readFile('./src/highscoredb.json', 'utf-8');

       return JSON.parse(rawData);

   } catch (error) {

       console.error('Error reading highscore file:', error);

       return [];

   }

}

// Function to add a score to the highscore list

async function addScoreToHighscoreList(playerAndScore) {

   try {

       let top5Points = await getTop5Points();

   // Add the new score to the list

       top5Points.push(playerAndScore);

// Sort the list in descending order by score

       top5Points.sort((a, b) => b.score - a.score);

 // Keep only the top 5 scores

       top5Points = top5Points.slice(0, 5);

// Write the updated list to the JSON file

       await fs.writeFile('./src/highscoredb.json', JSON.stringify(top5Points, null, 4));

   } catch (error) {

       console.error('Error writing to highscore file:', error);

   }

}

export { getTop5Points, addScoreToHighscoreList };




