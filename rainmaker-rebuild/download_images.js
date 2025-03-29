#!/usr/bin/env node

/**
 * Rainmaker Sport Fishing Image Downloader
 * 
 * This script downloads images from the original Rainmaker Sport Fishing website
 * and organizes them for use in the new mobile-friendly site.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { exec } = require('child_process');

// Define base URLs and directories
const BASE_URL = 'http://www.rainmakersportfishing.com';
const GALLERY_URL = 'https://rainmakersportfishing.com/wp-content/gallery/photo-gallery';
const IMAGES_DIR = path.join(__dirname, 'rainmaker-rebuild', 'images');
const MAIN_IMAGES = [
  '/wp-content/uploads/2017/02/rainmakers_hdr.jpg', // Header image
  '/images/captain_about_sml.jpg', // Captain Al
  '/images/rainmaker_about.jpg', // Boat photo
  '/wp-content/gallery/photo-gallery/20150824_063113.jpg', // Action shot
  '/wp-content/gallery/photo-gallery/20160820_070320.jpg', // Action shot 2
  '/wp-content/gallery/photo-gallery/5-guys-and-fish.jpg', // Group shot
  '/wp-content/gallery/photo-gallery/6-fun-and-fish-1.jpg', // Another group
  '/wp-content/gallery/photo-gallery/al-with-fish-5.jpg', // Captain with fish
  '/wp-content/gallery/photo-gallery/coed-group-with-fish.jpg', // Group shot
  '/wp-content/gallery/photo-gallery/cute-kid-with-his-fish.jpg', // Family friendly
  '/wp-content/gallery/photo-gallery/dion-and-al.jpg', // Captain and friend
  '/wp-content/gallery/photo-gallery/kids-fishing.jpg', // Kids fishing
  '/wp-content/gallery/photo-gallery/mikes-work-group.jpg', // Corporate group
  '/wp-content/uploads/2015/05/uscglc.png', // USCG logo
  '/wp-content/uploads/2015/05/nofish_nopay.jpg', // No fish no pay logo
  '/images/browntrout.jpg', // Brown trout
  '/images/group1.jpg', // Group image
  '/wp-content/uploads/2021/04/Rampage-300x279.jpg', // Boat image
  '/wp-content/uploads/2021/07/al-139x300.jpg', // Captain Al portrait
];

// Create the images directory
function createImageDirectory() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`Created directory: ${IMAGES_DIR}`);
  }
}

// Download an image from URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    // Choose http or https based on URL
    const client = url.startsWith('https') ? https : http;
    
    console.log(`Downloading: ${url}`);
    
    client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Redirecting to: ${response.headers.location}`);
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Check if the response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image. Status code: ${response.statusCode}`));
        return;
      }
      
      // Create a write stream to save the image
      const fileStream = fs.createWriteStream(path.join(IMAGES_DIR, filename));
      
      // Pipe the response to the file
      response.pipe(fileStream);
      
      // Handle completion and errors
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(path.join(IMAGES_DIR, filename), () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Process a list of images
async function processImageList(images) {
  for (const imagePath of images) {
    try {
      // Extract the filename from the path
      const filename = path.basename(imagePath);
      
      // Create the full URL
      const imageUrl = imagePath.startsWith('http') ? imagePath : BASE_URL + imagePath;
      
      // Download the image
      await downloadImage(imageUrl, filename);
    } catch (error) {
      console.error(`Error downloading ${imagePath}: ${error.message}`);
    }
  }
}

// Create placeholder images if we can't get the real ones
function createPlaceholderImages() {
  const placeholders = [
    { name: 'hero-boat.jpg', width: 800, height: 500, text: 'Rainmaker Charter Boat' },
    { name: 'rainmaker-iv.jpg', width: 600, height: 400, text: 'Rainmaker IV' },
    { name: 'total-chaos.jpg', width: 600, height: 400, text: 'Total Chaos' },
    { name: 'reel-deal.jpg', width: 600, height: 400, text: 'Reel Deal' },
    { name: 'fishing-action.jpg', width: 600, height: 400, text: 'Fishing Action' },
    { name: 'logo.png', width: 200, height: 80, text: 'Rainmaker Logo' },
    { name: 'logo-white.png', width: 200, height: 80, text: 'Rainmaker Logo' },
    { name: 'weather-icon.png', width: 100, height: 100, text: 'Weather' },
    { name: 'favicon.png', width: 32, height: 32, text: 'R' }
  ];

  // Create an SVG for each placeholder
  for (const placeholder of placeholders) {
    const svgContent = `<svg width="${placeholder.width}" height="${placeholder.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0d6efd"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">${placeholder.text}</text>
    </svg>`;
    
    fs.writeFileSync(path.join(IMAGES_DIR, placeholder.name), svgContent);
    console.log(`Created placeholder: ${placeholder.name}`);
  }
}

// Main function to orchestrate the process
async function main() {
  try {
    // Create the images directory
    createImageDirectory();
    
    // Download the main images
    console.log('Downloading main images...');
    await processImageList(MAIN_IMAGES);
    
    // Create placeholder images for any that might be missing
    console.log('Creating placeholder images...');
    createPlaceholderImages();
    
    console.log('Image download process completed successfully!');
  } catch (error) {
    console.error(`Error in main process: ${error.message}`);
  }
}

// Run the main function
main();
