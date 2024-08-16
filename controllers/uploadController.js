const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const featureModel = require('../models/featureModel'); // Import the Feature model

// Function to calculate Euclidean distance between two feature vectors
const euclideanDistance = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    throw new Error('Input vectors must be arrays of the same length');
  }
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
};

const contentBased = async (req, res) => {
  try {
    const { base64, style } = req.body;
    
    const timestamp = Date.now();
    const imagePath = path.join(__dirname, '..', 'static', 'uploaded', `${timestamp}.jpg`);
    const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFileSync(imagePath, base64Data, 'base64');
    
    const scriptPath = path.join(__dirname, '..', 'scripts', 'feature.py');
    const venvPath = path.join(__dirname, '..', 'scripts', 'env', 'Scripts', 'python.exe');
    const options = { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } };

    exec(`${venvPath} "${scriptPath}" "${imagePath}"`, options, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).send({ 
          error: 'Error executing Python script', 
          details: error.message 
        });
      }
      
      if (stderr) {
        console.log(`Python script stderr: ${stderr}`);
      }

      let uploadedFeature;
      try {
        const cleanedOutput = stdout.split('\n').filter(line => {
          try {
            JSON.parse(line);
            return true;
          } catch {
            return false;
          }
        }).join('');
        
        uploadedFeature = JSON.parse(cleanedOutput);
      } catch (parseError) {
        console.error('Error parsing Python script output:', parseError);
        return res.status(500).send({ 
          error: 'Error parsing Python script output', 
          details: parseError.message 
        });
      }

      const features = await featureModel.find({ category: style });
      
      const distances = features.map(f => ({
        fileName: f.fileName,
        distance: euclideanDistance(uploadedFeature, f.feature)
      }));

      distances.sort((a, b) => a.distance - b.distance);
      const top3Matches = distances.slice(0, 3);

      const baseUrl = 'http://192.168.1.26:8080/static/img/';
      
      const results = top3Matches.map(match => ({
        fileName: match.fileName,
        url: `${baseUrl}${style}/${match.fileName}`,
        score: match.distance
      }));

      res.status(200).send({
        success: true,
        similarImages: results
      });
    });

  } catch (error) {
    console.error(`Error in contentBased function: ${error.message}`);
    res.status(500).send({ 
      error: 'Server error', 
      details: error.message 
    });
  }
};      

const generateImages = async (req, res) => {
  try {
    const { base64, style } = req.body;

    const timestamp = Date.now();
    const imagePath = path.join(__dirname, '..', 'static', 'uploaded', `${timestamp}.jpg`);
    const base64Data = base64.replace(/^data:image\/jpeg;base64,/, ""); // Adjust prefix if needed
    fs.writeFileSync(imagePath, base64Data, 'base64');

    const scriptPath = path.join(__dirname, '..', 'scripts', 'generate.py');
    const venvPath = path.join(__dirname, '..', 'scripts', 'env', 'Scripts', 'python.exe'); // For Windows

    exec(`${venvPath} ${scriptPath} ${imagePath} '${style}'`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send({
          success: false,
          message: 'Error running script',
          error,
        });
      }

      const generatedImages = stdout.trim().split('\n').filter(line => !line.includes('Using device:')).map(line => `http://192.168.1.26:8080/static/generate/${line.trim()}`);

      res.status(200).send({
        success: true,
        message: 'API Generated',
        generatedImages,
      });
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error in API',
      error,
    });
  }
};

module.exports = {
  generateImages,
  contentBased
};