// // // // // // // import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
// // // // // // // import mammoth from 'mammoth'

// // // // // // // export async function extractTextFromPDF(file) {
// // // // // // //   const arrayBuffer = await file.arrayBuffer()
// // // // // // //   const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
// // // // // // //   const doc = await loadingTask.promise
// // // // // // //   let text = ''
// // // // // // //   for (let i = 1; i <= doc.numPages; i++) {
// // // // // // //     const page = await doc.getPage(i)
// // // // // // //     const content = await page.getTextContent()
// // // // // // //     const pageText = content.items.map(it => it.str).join(' ')
// // // // // // //     text += '\n' + pageText
// // // // // // //   }
// // // // // // //   return text
// // // // // // // }

// // // // // // // export async function extractTextFromDocx(file) {
// // // // // // //   const arrayBuffer = await file.arrayBuffer()
// // // // // // //   const result = await mammoth.extractRawText({ arrayBuffer })
// // // // // // //   return result.value
// // // // // // // }

// // // // // // // export function extractFields(text) {
// // // // // // //   const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
// // // // // // //   const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4})/)
// // // // // // //   const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
// // // // // // //   let name = null
// // // // // // //   if (lines.length) {
// // // // // // //     const candidate = lines[0]
// // // // // // //     if (candidate.split(' ').length <= 4 && /[A-Z]/.test(candidate[0])) name = candidate
// // // // // // //   }
// // // // // // //   return { name: name || null, email: emailMatch ? emailMatch[0] : null, phone: phoneMatch ? phoneMatch[0] : null }
// // // // // // // }


// // // // // // import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// // // // // // import mammoth from 'mammoth';

// // // // // // // Proper PDF worker setup for Vite
// // // // // // pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
// // // // // //   'pdfjs-dist/build/pdf.worker.entry.js',
// // // // // //   import.meta.url
// // // // // // ).href;

// // // // // // /**
// // // // // //  * Extract text from a PDF file
// // // // // //  */
// // // // // // export async function extractTextFromPDF(file) {
// // // // // //   try {
// // // // // //     const arrayBuffer = await file.arrayBuffer();
// // // // // //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// // // // // //     let text = '';
// // // // // //     for (let i = 1; i <= pdf.numPages; i++) {
// // // // // //       const page = await pdf.getPage(i);
// // // // // //       const content = await page.getTextContent();
// // // // // //       text += '\n' + content.items.map(item => item.str).join(' ');
// // // // // //     }
// // // // // //     return text;
// // // // // //   } catch (err) {
// // // // // //     console.error('PDF parsing error:', err);
// // // // // //     throw new Error('Failed to parse PDF. Make sure it is a text-based PDF.');
// // // // // //   }
// // // // // // }

// // // // // // /**
// // // // // //  * Extract text from a DOCX file
// // // // // //  */
// // // // // // export async function extractTextFromDocx(file) {
// // // // // //   try {
// // // // // //     const arrayBuffer = await file.arrayBuffer();
// // // // // //     const result = await mammoth.extractRawText({ arrayBuffer });
// // // // // //     return result.value;
// // // // // //   } catch (err) {
// // // // // //     console.error('DOCX parsing error:', err);
// // // // // //     throw new Error('Failed to parse DOCX. Make sure the file is valid.');
// // // // // //   }
// // // // // // }

// // // // // // /**
// // // // // //  * Extract Name, Email, Phone from raw text
// // // // // //  */
// // // // // // export function extractFields(text) {
// // // // // //   // Email
// // // // // //   const emailMatch = text.match(
// // // // // //     /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
// // // // // //   );

// // // // // //   // Phone (supports international + local formats)
// // // // // //   const phoneMatch = text.match(
// // // // // //     /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})/
// // // // // //   );

// // // // // //   // Name: try "Name: John Doe" pattern first
// // // // // //   const nameRegex = /(?:Name[:\s]*)([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,3})/i;
// // // // // //   let name = null;
// // // // // //   const nameMatch = text.match(nameRegex);
// // // // // //   if (nameMatch) {
// // // // // //     name = nameMatch[1];
// // // // // //   } else {
// // // // // //     // fallback: first line with capital letters
// // // // // //     const lines = text
// // // // // //       .split(/\r?\n/)
// // // // // //       .map(l => l.trim())
// // // // // //       .filter(Boolean);
// // // // // //     for (const line of lines) {
// // // // // //       if (line.split(' ').length <= 4 && /[A-Z]/.test(line[0])) {
// // // // // //         name = line;
// // // // // //         break;
// // // // // //       }
// // // // // //     }
// // // // // //   }

// // // // // //   return {
// // // // // //     name: name || null,
// // // // // //     email: emailMatch ? emailMatch[0] : null,
// // // // // //     phone: phoneMatch ? phoneMatch[0] : null,
// // // // // //   };
// // // // // // }

// // // // // // /**
// // // // // //  * Main helper: parse a file and extract fields automatically
// // // // // //  */
// // // // // // export async function parseResumeFile(file) {
// // // // // //   let text = '';
// // // // // //   if (file.type === 'application/pdf') {
// // // // // //     text = await extractTextFromPDF(file);
// // // // // //   } else if (
// // // // // //     file.type ===
// // // // // //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
// // // // // //     file.name.endsWith('.docx')
// // // // // //   ) {
// // // // // //     text = await extractTextFromDocx(file);
// // // // // //   } else {
// // // // // //     throw new Error('Unsupported file type. Use PDF or DOCX.');
// // // // // //   }

// // // // // //   return extractFields(text);
// // // // // // }



// // // // // import * as pdfjsLib from 'pdfjs-dist';
// // // // // import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry?url';
// // // // // import mammoth from 'mammoth';

// // // // // // Proper PDF worker setup for Vite
// // // // // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// // // // // /**
// // // // //  * Extract text from a PDF file
// // // // //  */
// // // // // export async function extractTextFromPDF(file) {
// // // // //   try {
// // // // //     const arrayBuffer = await file.arrayBuffer();
// // // // //     const pdf = await pdfjsLib.getDocument({ 
// // // // //       data: arrayBuffer,
// // // // //       // Enable more text extraction options
// // // // //       cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
// // // // //       cMapPacked: true,
// // // // //     }).promise;
    
// // // // //     let text = '';
// // // // //     for (let i = 1; i <= pdf.numPages; i++) {
// // // // //       const page = await pdf.getPage(i);
// // // // //       const content = await page.getTextContent();
// // // // //       text += content.items.map(item => item.str).join(' ') + '\n';
// // // // //     }
// // // // //     return text.trim();
// // // // //   } catch (err) {
// // // // //     console.error('PDF parsing error:', err);
// // // // //     throw new Error('Failed to parse PDF. Make sure it is a text-based PDF.');
// // // // //   }
// // // // // }

// // // // // /**
// // // // //  * Extract text from a DOCX file
// // // // //  */
// // // // // export async function extractTextFromDocx(file) {
// // // // //   try {
// // // // //     const arrayBuffer = await file.arrayBuffer();
// // // // //     const result = await mammoth.extractRawText({ arrayBuffer });
// // // // //     return result.value;
// // // // //   } catch (err) {
// // // // //     console.error('DOCX parsing error:', err);
// // // // //     throw new Error('Failed to parse DOCX. Make sure the file is valid.');
// // // // //   }
// // // // // }

// // // // // /**
// // // // //  * Extract Name, Email, Phone from raw text
// // // // //  */
// // // // // export function extractFields(text) {
// // // // //   // Email - more comprehensive pattern
// // // // //   const emailMatch = text.match(
// // // // //     /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
// // // // //   );

// // // // //   // Phone - improved patterns
// // // // //   const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{3,4}/g;
// // // // //   const phoneMatch = text.match(phoneRegex);

// // // // //   // Name extraction - improved logic
// // // // //   let name = null;
  
// // // // //   // Pattern 1: Explicit "Name:" pattern
// // // // //   const nameExplicit = text.match(/(?:name|full name|contact)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
// // // // //   if (nameExplicit) {
// // // // //     name = nameExplicit[1].trim();
// // // // //   } else {
// // // // //     // Pattern 2: Look for lines that look like names at the beginning
// // // // //     const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
// // // // //     if (lines.length > 0) {
// // // // //       const firstLine = lines[0];
// // // // //       // Check if first line looks like a name (2-4 words, capitalized, no special chars)
// // // // //       const nameWords = firstLine.split(/\s+/);
// // // // //       if (nameWords.length >= 2 && nameWords.length <= 4) {
// // // // //         const allCapitalized = nameWords.every(word => /^[A-Z][a-z]*$/.test(word));
// // // // //         if (allCapitalized) {
// // // // //           name = firstLine;
// // // // //         }
// // // // //       }
// // // // //     }
// // // // //   }

// // // // //   return {
// // // // //     name: name || null,
// // // // //     email: emailMatch ? emailMatch[0] : null,
// // // // //     phone: phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ').trim() : null,
// // // // //   };
// // // // // }

// // // // // /**
// // // // //  * Main helper: parse a file and extract fields automatically
// // // // //  */
// // // // // export async function parseResumeFile(file) {
// // // // //   let text = '';
// // // // //   if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')) {
// // // // //     text = await extractTextFromPDF(file);
// // // // //   } else if (
// // // // //     file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
// // // // //     file.name?.toLowerCase().endsWith('.docx')
// // // // //   ) {
// // // // //     text = await extractTextFromDocx(file);
// // // // //   } else {
// // // // //     throw new Error('Unsupported file type. Use PDF or DOCX.');
// // // // //   }

// // // // //   return extractFields(text);
// // // // // }

// // // // import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// // // // import mammoth from 'mammoth';

// // // // // Vite-compatible PDF worker
// // // // pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
// // // //   'pdfjs-dist/build/pdf.worker.min.js',
// // // //   import.meta.url
// // // // ).href;

// // // // /**
// // // //  * Extract text from a PDF file
// // // //  */
// // // // export async function extractTextFromPDF(file) {
// // // //   try {
// // // //     const arrayBuffer = await file.arrayBuffer();
// // // //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// // // //     let text = '';
// // // //     for (let i = 1; i <= pdf.numPages; i++) {
// // // //       const page = await pdf.getPage(i);
// // // //       const content = await page.getTextContent();
// // // //       text += '\n' + content.items.map(item => item.str).join(' ');
// // // //     }
// // // //     return text;
// // // //   } catch (err) {
// // // //     console.error('PDF parsing error:', err);
// // // //     throw new Error('Failed to parse PDF. Make sure it is a text-based PDF.');
// // // //   }
// // // // }

// // // // /**
// // // //  * Extract text from a DOCX file
// // // //  */
// // // // export async function extractTextFromDocx(file) {
// // // //   try {
// // // //     const arrayBuffer = await file.arrayBuffer();
// // // //     const result = await mammoth.extractRawText({ arrayBuffer });
// // // //     return result.value;
// // // //   } catch (err) {
// // // //     console.error('DOCX parsing error:', err);
// // // //     throw new Error('Failed to parse DOCX.');
// // // //   }
// // // // }

// // // // /**
// // // //  * Extract Name, Email, Phone from raw text
// // // //  */
// // // // export function extractFields(text) {
// // // //   const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
// // // //   const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})/);

// // // //   const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
// // // //   let name = null;
// // // //   if (lines.length) {
// // // //     const candidate = lines[0];
// // // //     if (candidate.split(' ').length <= 4 && /[A-Z]/.test(candidate[0])) name = candidate;
// // // //   }

// // // //   return {
// // // //     name: name || null,
// // // //     email: emailMatch ? emailMatch[0] : null,
// // // //     phone: phoneMatch ? phoneMatch[0] : null
// // // //   };
// // // // }

// // // // /**
// // // //  * Main helper to parse a file and return extracted fields
// // // //  */
// // // // export async function parseResumeFile(file) {
// // // //   let text = '';
// // // //   if (file.type === 'application/pdf') {
// // // //     text = await extractTextFromPDF(file);
// // // //   } else if (
// // // //     file.type ===
// // // //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
// // // //     file.name.endsWith('.docx')
// // // //   ) {
// // // //     text = await extractTextFromDocx(file);
// // // //   } else {
// // // //     throw new Error('Unsupported file type. Use PDF or DOCX.');
// // // //   }

// // // //   return extractFields(text);
// // // // }


// // // import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// // // import mammoth from 'mammoth';

// // // // Fix PDF.js worker for Vite environment
// // // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// // // export async function extractTextFromPDF(file) {
// // //   try {
// // //     const arrayBuffer = await file.arrayBuffer();
// // //     const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
// // //     const doc = await loadingTask.promise;
// // //     let text = '';
// // //     for (let i = 1; i <= doc.numPages; i++) {
// // //       const page = await doc.getPage(i);
// // //       const content = await page.getTextContent();
// // //       const pageText = content.items.map((it) => it.str).join(' ');
// // //       text += '\n' + pageText;
// // //     }
// // //     return text;
// // //   } catch (err) {
// // //     console.error('PDF parsing error:', err);
// // //     throw new Error('Failed to parse PDF. Make sure it is a text-based PDF.');
// // //   }
// // // }

// // // export async function extractTextFromDocx(file) {
// // //   try {
// // //     const arrayBuffer = await file.arrayBuffer();
// // //     const result = await mammoth.extractRawText({ arrayBuffer });
// // //     return result.value;
// // //   } catch (err) {
// // //     console.error('DOCX parsing error:', err);
// // //     throw new Error('Failed to parse DOCX file.');
// // //   }
// // // }

// // // export function extractFields(text) {
// // //   const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
// // //   const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4})/);
// // //   const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

// // //   let name = null;
// // //   if (lines.length) {
// // //     const candidate = lines[0];
// // //     if (candidate.split(' ').length <= 4 && /[A-Z]/.test(candidate[0])) name = candidate;
// // //   }

// // //   return {
// // //     name: name || null,
// // //     email: emailMatch ? emailMatch[0] : null,
// // //     phone: phoneMatch ? phoneMatch[0] : null
// // //   };
// // // }


// // import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// // import mammoth from 'mammoth';

// // /**
// //  * Extract text from PDF using pdfjs
// //  */
// // export async function extractTextFromPDF(file) {
// //   const arrayBuffer = await file.arrayBuffer();
// //   const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
// //   const doc = await loadingTask.promise;
// //   let text = '';
// //   for (let i = 1; i <= doc.numPages; i++) {
// //     const page = await doc.getPage(i);
// //     const content = await page.getTextContent();
// //     const pageText = content.items.map(it => it.str).join(' ');
// //     text += '\n' + pageText;
// //   }
// //   return text;
// // }

// // /**
// //  * Extract text from DOCX using mammoth
// //  */
// // export async function extractTextFromDocx(file) {
// //   const arrayBuffer = await file.arrayBuffer();
// //   const result = await mammoth.extractRawText({ arrayBuffer });
// //   return result.value;
// // }

// // /**
// //  * Extract name, email, phone from raw text
// //  */
// // export function extractFields(text) {
// //   const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
// //   const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4})/);

// //   const lines = text
// //     .split(/\r?\n/)
// //     .map(l => l.trim())
// //     .filter(Boolean);

// //   // Try to find a name line: start with uppercase, 2–5 words
// //   let name = null;
// //   for (let line of lines) {
// //     if (/^[A-Z][a-zA-Z]+/.test(line) && line.split(' ').length <= 5) {
// //       name = line;
// //       break;
// //     }
// //   }

// //   return {
// //     name: name || null,
// //     email: emailMatch ? emailMatch[0] : null,
// //     phone: phoneMatch ? phoneMatch[0] : null
// //   };
// // }


import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/build/pdf.worker.entry'; // side-effect import
import mammoth from 'mammoth';

// Set worker source to the minified worker in public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const doc = await loadingTask.promise;

    let text = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }

    return text;
  } catch (err) {
    console.error('PDF parsing error:', err);
    throw new Error('Failed to parse PDF. Make sure it is text-based.');
  }
}

export async function extractTextFromDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (err) {
    console.error('DOCX parsing error:', err);
    throw new Error('Failed to parse DOCX.');
  }
}

export function extractFields(text) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4})/);

  // Heuristic: first non-empty line starting with uppercase as name
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let name = null;
  if (lines.length) {
    const candidate = lines[0];
    if (candidate.split(' ').length <= 4 && /^[A-Z]/.test(candidate[0])) {
      name = candidate;
    }
  }

  return {
    name: name || null,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null
  };
}


// // src/utils/parseResume.js

// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

// // ✅ Ensure PDF parsing runs in a worker, not on the main thread
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// /**
//  * Extracts raw text from a PDF file safely.
//  * @param {File} file - The uploaded PDF file
//  * @returns {Promise<string>} - Extracted text
//  */
// export async function extractTextFromPDF(file) {
//   if (!file) throw new Error("No file provided");

//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

//     let textContent = "";

//     // Read each page asynchronously
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();

//       const pageText = content.items.map((item) => item.str).join(" ");
//       textContent += pageText + "\n";
//     }

//     return textContent.trim();
//   } catch (err) {
//     console.error("PDF parsing error:", err);
//     throw new Error("Failed to parse PDF. Make sure it’s a text-based PDF.");
//   }
// }

// /**
//  * Dummy fallback for other formats (docx, txt, etc.)
//  */
// export async function extractTextFromOther(file) {
//   return "Support for this file type coming soon.";
// }

// /**
//  * Main function to parse resume
//  */
// export async function parseResume(file) {
//   const fileType = file?.type || "";

//   if (fileType.includes("pdf")) {
//     return extractTextFromPDF(file);
//   } else {
//     return extractTextFromOther(file);
//   }
// }
