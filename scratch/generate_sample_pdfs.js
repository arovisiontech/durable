const fs = require('fs');
const path = require('path');

const pdfDir = path.join(__dirname, '..', 'public', 'pdf');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

function createSamplePdf(title, subtitle) {
  const contentStream = `BT
/F1 22 Tf
40 730 Td
(DURABLE HOSPITAL SUPPLIES) Tj
0 -32 Td
/F1 16 Tf
(${title}) Tj
0 -24 Td
/F1 12 Tf
(${subtitle}) Tj
0 -20 Td
(Contact: info@durablehospitalsupplies.com | www.durablehospitalsupplies.com) Tj
0 -20 Td
(Certified ISO 13485 & CE Quality Standards) Tj
ET`;

  const streamLength = Buffer.byteLength(contentStream);

  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${contentStream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000331 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
580
%%EOF`;
}

fs.writeFileSync(
  path.join(pdfDir, 'general-surgical-instruments-catalogue.pdf'),
  createSamplePdf('General Surgical Instruments Catalogue 2026', 'Precision Forceps, Scissors, Scalpels & Retractors')
);

fs.writeFileSync(
  path.join(pdfDir, 'dental-maxillofacial-catalogue.pdf'),
  createSamplePdf('Dental & Maxillofacial Instruments Guide', 'Extracting Forceps, Elevators, Orthodontic Pliers & Curettes')
);

fs.writeFileSync(
  path.join(pdfDir, 'orthopedic-instruments-catalogue.pdf'),
  createSamplePdf('Orthopedic & Bone Surgery Instruments', 'Bone Cutters, Osteotomes, Mallets & Rongeurs')
);

console.log('Sample PDF catalogues created successfully!');
