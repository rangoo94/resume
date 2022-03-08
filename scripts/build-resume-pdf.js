const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const PDFParser = require('pdf2json')

// Configuration

const RESUME_FILE_PATH = path.resolve(path.join(__dirname, '../dist/resume.html'))
const OUTPUT_RESUME_FILE_PATH = path.join(__dirname, '../dist/resume.pdf')
const OUTPUT_MASKED_RESUME_FILE_PATH = path.join(__dirname, '../dist/masked-resume.pdf')

// Pre-validation

if (!fs.existsSync(RESUME_FILE_PATH)) {
  throw new Error('Resume HTML file doesn\'t exist.')
}

// Prepare helpers

function getPdfData (filePath) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser()

    parser.on('pdfParser_dataError', reject)
    parser.on('pdfParser_dataReady', resolve)

    parser.loadPDF(filePath)
  })
}

// Prepare procedure

async function main () {
  // Show log that it will build
  process.stdout.write('Building PDFs...\n')

  // Prepare headless Chrome through Puppeteer tool
  const browser = await puppeteer.launch({ args: [ '--no-sandbox', '--lang=en-GB,en' ] })
  const page = await browser.newPage()

  // Set-up PDF settings
  const settings = { preferCSSPageSize: true, printBackground: true }

  // Open resume and load required resources
  await page.goto(`file:${RESUME_FILE_PATH}`, { waitUntil: 'networkidle2' })

  // Render PDF of basic resume
  await page.pdf({ ...settings, path: OUTPUT_RESUME_FILE_PATH })

  // Add mask to vulnerable data
  await page.evaluate(() => window.maskResume())

  // Render PDF of masked resume
  await page.pdf({ ...settings, path: OUTPUT_MASKED_RESUME_FILE_PATH })

  // Close browser session
  await browser.close()

  // Retrieve PDF data
  const resumeData = await getPdfData(OUTPUT_RESUME_FILE_PATH)
  const maskedResumeData = await getPdfData(OUTPUT_MASKED_RESUME_FILE_PATH)

  // Validate PDFs, that they have only single page each
  if (resumeData.Pages.length !== 1) {
    throw new Error(`Base resume has ${resumeData.Pages.length} pages instead of 1.`)
  }

  if (maskedResumeData.Pages.length !== 1) {
    throw new Error(`Masked resume has ${maskedResumeData.Pages.length} pages instead of 1.`)
  }

  // Show log that it's successful
  process.stdout.write('Built resume PDFs correctly.\n')
}

// Run procedure

main().catch(error => setTimeout(() => { throw error }))
