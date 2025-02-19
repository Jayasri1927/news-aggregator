require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// Load API Key
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("Error: Missing API key. Make sure the .env file is correctly set up.");
    process.exit(1); // Stop execution if API key is missing
}

// CORS Configuration
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Helper function for API requests
async function makeApiRequest(url) {
  try {
    const response = await axios.get(url);
    return {
      status: 200,
      success: true,
      message: "Successfully fetched the data",
      data: response.data,
    };
  } catch (error) {
    console.error("API request error:", error.response ? error.response.data : error);
    return {
      status: 500,
      success: false,
      message: "Failed to fetch data from the API",
      error: error.response ? error.response.data : error.message,
    };
  }
}

// ✅ Route for fetching all news
app.get("/all-news", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 10;
  let page = parseInt(req.query.page) || 1;
  let q = req.query.q || 'technology'; // Default query

  let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// ✅ Route for fetching top headlines
app.get("/top-headlines", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 10;
  let page = parseInt(req.query.page) || 1;
  let category = req.query.category || "general";

  let url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// ✅ Test Route
app.get("/test-api", async (req, res) => {
  let url = `https://newsapi.org/v2/everything?q=technology&page=1&pageSize=10&apiKey=${API_KEY}`;

  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

app.get("/", (req, res) => {
  res.send("Welcome to the News API Backend! Use /test-api to fetch news.");
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
