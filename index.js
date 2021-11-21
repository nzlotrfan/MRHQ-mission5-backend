const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// Express Server Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// IBM Discovery Setup
const DiscoveryV1 = require("ibm-watson/discovery/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const discovery = new DiscoveryV1({
  version: "2019-04-30",
  authenticator: new IamAuthenticator({
    apikey: process.env.APIK,
  }),
  serviceUrl: "https://api.eu-gb.discovery.watson.cloud.ibm.com",
});

// SERVER ENDPOINTS
// Server Connection Status
app.get("/", (req, res) => {
  res.status(200).send("Connected successfully to the server yo");
});

// IBM Discovery Search Request
app.get("/search", (req, res) => {
  console.log(`The search term was: "${req.query.searchString}"`);
  const userQuery = req.query.searchString; //  Search parameters
  const queryParams = {
    environmentId: process.env.ENVIROID,
    collectionId: process.env.COLLECTID,
    query: userQuery,
    count: 2,
    passagesCount: 2,
  };

  discovery
    .query(queryParams)
    .then((queryResponse) => {
      console.log(JSON.stringify(queryResponse, null, 2));
      res.status(200).send(queryResponse);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
