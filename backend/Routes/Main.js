import express from "express";
const appMain = express.Router();
import Tesseract from "tesseract.js";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import fetch, { Headers } from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fromPath } from "pdf2pic";
import multer from 'multer'; // Import multer for file handling
globalThis.fetch = fetch;
globalThis.Headers = Headers;

// Set up multer for file upload handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp to avoid filename conflicts
  }
});

const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "AIzaSyBehbPHBFHzn-CFudfzHTyOFNhN-MEMMW8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Google Generative AI with fetch

const extractTxt = async (req, res) => {
    const pdfFile = req.file?.path; // Access the uploaded file path
    if (!pdfFile) {
        return res.status(400).send("No file uploaded");
    }
    console.log("Pdf file :", pdfFile);

    const options = {
        density: 100, // DPI (dots per inch)
        saveFilename: "converted", // Base filename
        savePath: ".",   // Directory to save images
        format: "png",          // Image format (png, jpeg)
        width: 800,             // Width of the image
        height: 1200            // Height of the image
    };

    // Path to your PDF file
    const pdfConverter = fromPath(pdfFile, options);

    try {
        // Convert all pages
        const result = await pdfConverter.bulk(-1); // `-1` means all pages
        console.log("Conversion completed:", result);
        res.send("File converted to .png");
    } catch (error) {
        console.error("Error converting PDF to image:", error);
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Example image file path
    const imagePath = path.join(__dirname, "converted.1.png");

    // Step 4: Call the analyzeImage function
    const requirements = "I am looking for world's best fullstack developer";

    try {
        // Step 1: Extract text from image using Tesseract
        const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
        console.log("Extracted Text:", text);

        // Step 2: Generate a prompt for the AI model
        const prompt = `From 1 to 10 just give a score and person's name no extra lines and be very very strict with the marking I am hiring it's not a place for kids to play., ${requirements}, ${text}`;

        const result = await model.generateContent(prompt);
        console.log("response:", await result.response.text());

    } catch (err) {
        console.error("Error during image analysis:", err);
    }
}

appMain.post("/extract", upload.single('file'), extractTxt); // Use multer to handle file upload




export default app

