const express = require('express');
const app = express();
const port = 3000; 

// Import fs and csv-parse 
const fs = require("fs");
const { parse } = require("csv-parse");

// Create 
const albumArr = [];
const genreArr = [];
const artistsArr = [];
const tracksArr = [];


// Parse albums
fs.createReadStream("./lab3-data/raw_albums.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // push the object row into the array
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  });
  

  // Parse artists
  fs.createReadStream("./lab3-data/raw_artists.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // push the object row into the array
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  });
 

  // Parse tracks
  fs.createReadStream("./lab3-data/raw_tracks.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // push the object row into the array
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  });   
  


  // Parse genres
  fs.createReadStream("./lab3-data/genres.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // push the object row into the array
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  });


 
// Setup serving front end code 
app.use('/', express.static('static'));

app.get('/',(req,res) => {
    res.send('Hello World!');
}); 

app.listen(port,() => {
    console.log(`Listening on port ${port}`);   
});