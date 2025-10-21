import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const { toEmail, subject, htmlSummary, pdfBase64, filename = "Result.pdf" } = req.body || {};
  if (!toEmail) return res.status(400).json({ ok: false, error: "Missing toEmail" });

  const attachments = pdfBase64 ? [{
    content: pdfBase64,
    filename,
    type: "application/pdf",
    disposition: "attachment"
  }] : [];

  await sgMail.send({
    to: toEmail,
    from: { email: process.env.SENDGRID_FROM_EMAIL, name: "THE FIX STUDIOS" },
    subject: subject || "Fitzpatrick Result",
    html: htmlSummary || "<p>Your result is attached.</p>",
    attachments
  });

  res.json({ ok: true });
}
