import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

const NAVY = rgb(15 / 255, 61 / 255, 115 / 255);
const ORANGE = rgb(245 / 255, 166 / 255, 35 / 255);
const SLATE = rgb(71 / 255, 85 / 255, 105 / 255);

export async function generateCertificatePdf(params: {
  studentName: string;
  courseTitle: string;
  partnerLabel: string | null;
  issuedAt: Date;
  verifyUrl: string;
}) {
  const { studentName, courseTitle, partnerLabel, issuedAt, verifyUrl } = params;

  const pdfDoc = await PDFDocument.create();
  // Format paysage, proportions A4
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Cadre extérieur sobre
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: NAVY,
    borderWidth: 1.5,
  });
  page.drawRectangle({
    x: 34,
    y: 34,
    width: width - 68,
    height: height - 68,
    borderColor: ORANGE,
    borderWidth: 0.75,
  });

  // En-tête : nom de la plateforme
  const brand = "E-CLASSE RDC";
  const brandSize = 16;
  const brandWidth = bold.widthOfTextAtSize(brand, brandSize);
  page.drawText(brand, {
    x: (width - brandWidth) / 2,
    y: height - 90,
    size: brandSize,
    font: bold,
    color: NAVY,
  });

  // Titre
  const title = "CERTIFICAT DE RÉUSSITE";
  const titleSize = 28;
  const titleWidth = bold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: height - 150,
    size: titleSize,
    font: bold,
    color: NAVY,
  });

  // Sous-texte
  const sub = "Ce certificat est décerné à";
  const subSize = 12;
  const subWidth = regular.widthOfTextAtSize(sub, subSize);
  page.drawText(sub, {
    x: (width - subWidth) / 2,
    y: height - 210,
    size: subSize,
    font: regular,
    color: SLATE,
  });

  // Nom de l'étudiant
  const nameSize = 30;
  const nameWidth = bold.widthOfTextAtSize(studentName, nameSize);
  page.drawText(studentName, {
    x: (width - nameWidth) / 2,
    y: height - 255,
    size: nameSize,
    font: bold,
    color: ORANGE,
  });

  // Ligne sous le nom
  page.drawLine({
    start: { x: width / 2 - 160, y: height - 268 },
    end: { x: width / 2 + 160, y: height - 268 },
    thickness: 0.75,
    color: SLATE,
  });

  // Description de la formation
  const desc = `pour avoir complété avec succès la formation`;
  const descWidth = regular.widthOfTextAtSize(desc, subSize);
  page.drawText(desc, {
    x: (width - descWidth) / 2,
    y: height - 300,
    size: subSize,
    font: regular,
    color: SLATE,
  });

  const courseSize = 18;
  const courseWidth = bold.widthOfTextAtSize(courseTitle, courseSize);
  page.drawText(courseTitle, {
    x: (width - courseWidth) / 2,
    y: height - 328,
    size: courseSize,
    font: bold,
    color: NAVY,
  });

  if (partnerLabel) {
    const partnerSize = 11;
    const partnerWidth = regular.widthOfTextAtSize(partnerLabel, partnerSize);
    page.drawText(partnerLabel, {
      x: (width - partnerWidth) / 2,
      y: height - 350,
      size: partnerSize,
      font: regular,
      color: SLATE,
    });
  }

  // Date
  const dateStr = issuedAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  page.drawText(`Délivré le ${dateStr}`, {
    x: 70,
    y: 70,
    size: 10,
    font: regular,
    color: SLATE,
  });

  // QR code de vérification
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 200 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrSize = 70;
  page.drawImage(qrImage, {
    x: width - 70 - qrSize,
    y: 55,
    width: qrSize,
    height: qrSize,
  });
  page.drawText("Vérifier l'authenticité", {
    x: width - 70 - qrSize,
    y: 45,
    size: 7,
    font: regular,
    color: SLATE,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
