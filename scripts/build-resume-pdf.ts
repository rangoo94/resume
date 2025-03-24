import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import puppeteer from "puppeteer";
import mime from "mime";
import PDFParser, { type Output as PDFOutput } from "pdf2json";

// Configuration

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESUME_FILE_PATH = path.resolve(
  path.join(__dirname, "../dist/resume.html"),
);
const OUTPUT_RESUME_FILE_PATH = path.join(__dirname, "../dist/resume.pdf");
const OUTPUT_NO_PHOTO_RESUME_FILE_PATH = path.join(__dirname, "../dist/resume-no-photo.pdf");
const OUTPUT_MASKED_RESUME_FILE_PATH = path.join(
  __dirname,
  "../dist/masked-resume.pdf",
);
const STATIC_SERVER_ROOT = path.dirname(RESUME_FILE_PATH);

// Pre-validation

if (!fs.existsSync(RESUME_FILE_PATH)) {
  throw new Error("Resume HTML file doesn't exist.");
}

// Prepare helpers

function getPdfData(filePath: string): Promise<PDFOutput> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", reject);
    parser.on("pdfParser_dataReady", resolve);

    parser.loadPDF(filePath);
  });
}

// Prepare procedure

async function main() {
  // Show log that it will build
  process.stdout.write("Building PDFs...\n");

  // Prepare headless Chrome through Puppeteer tool
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--font-render-hinting=none", "--lang=en-GB,en"],
  });
  const page = await browser.newPage();

  // Debug information about Chrome version
  process.stdout.write(`Browser version: ${await page.browser().version()}\n`);

  // Set-up PDF settings
  const settings = { preferCSSPageSize: true, printBackground: true };

  // Create static HTTP server
  const srv = createServer(async (req, res) => {
    let filePath = path.join(STATIC_SERVER_ROOT, req.url!.substring(1));
    if (!fs.existsSync(filePath) || filePath == STATIC_SERVER_ROOT) {
      filePath = RESUME_FILE_PATH;
    }
    try {
      const contents = await readFile(filePath);
      res.writeHead(200, { "Content-Type": mime.getType(filePath)! });
      res.write(contents);
    } catch (e) {
      console.log(e);
      res.writeHead(500);
    }

    res.end();
  });
  await new Promise((resolve) => srv.listen(0, () => resolve(undefined)));
  const srvAddress = srv.address()!;
  if (typeof srvAddress !== "object") {
    throw new Error(`invalid server address: ${srvAddress}`);
  }
  process.stdout.write(`Started server at localhost:${srvAddress.port}\n`);

  // Open resume and load required resources
  await page.goto(`http://localhost:${srvAddress.port}`, {
    waitUntil: "networkidle2",
  });

  // Render PDF of basic resume
  await page.pdf({ ...settings, path: OUTPUT_RESUME_FILE_PATH });

  // Avoid photo
  // @ts-expect-error: custom function exposed
  await page.evaluate(() => window.deletePhotos());

  // Render PDF of resume without photo
  await page.pdf({ ...settings, path: OUTPUT_NO_PHOTO_RESUME_FILE_PATH });

  // Add mask to vulnerable data
  // @ts-expect-error: custom function exposed
  await page.evaluate(() => window.maskResume());

  // Render PDF of masked resume
  await page.pdf({ ...settings, path: OUTPUT_MASKED_RESUME_FILE_PATH });

  // Close browser session
  await browser.close();

  // Retrieve PDF data
  const resumeData = await getPdfData(OUTPUT_RESUME_FILE_PATH);
  const resumeNoPhotoData = await getPdfData(OUTPUT_NO_PHOTO_RESUME_FILE_PATH);
  const maskedResumeData = await getPdfData(OUTPUT_MASKED_RESUME_FILE_PATH);

  // Validate PDFs, that they have only single page each
  if (resumeData.Pages.length !== 1) {
    throw new Error(
      `Base resume has ${resumeData.Pages.length} pages instead of 1.`,
    );
  }
  if (resumeNoPhotoData.Pages.length !== 1) {
    throw new Error(
      `Resume without photo has ${resumeNoPhotoData.Pages.length} pages instead of 1.`,
    );
  }
  if (maskedResumeData.Pages.length !== 1) {
    throw new Error(
      `Masked resume has ${maskedResumeData.Pages.length} pages instead of 1.`,
    );
  }

  // Show log that it's successful
  process.stdout.write("Built resume PDFs correctly.\n");

  // Stop the static server
  srv.close();
}

// Run procedure

main().catch(async (error) => {
  await setTimeout();
  throw error;
});
