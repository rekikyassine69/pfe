import nodemailer from "nodemailer";

let transporter = null;

const initializeTransporter = () => {
  if (transporter) return transporter;

  const mailtrapHost = process.env.MAILTRAP_HOST;
  const mailtrapPort = process.env.MAILTRAP_PORT;
  const mailtrapUser = process.env.MAILTRAP_USER;
  const mailtrapPass = process.env.MAILTRAP_PASS;

  if (!mailtrapHost || !mailtrapUser || !mailtrapPass) {
    console.warn("⚠️ MAILTRAP credentials not configured. Email sending disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: mailtrapHost,
    port: mailtrapPort || 2525,
    auth: {
      user: mailtrapUser,
      pass: mailtrapPass,
    },
  });

  return transporter;
};

export const sendPasswordResetEmail = async (userEmail, resetLink) => {
  const transport = initializeTransporter();
  if (!transport) {
    console.log(`[Email Disabled] Reset link for ${userEmail}: ${resetLink}`);
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        .header { color: #2d7d4a; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        .content { color: #333; line-height: 1.6; margin-bottom: 30px; }
        .button { 
          display: inline-block; 
          background: #2d7d4a; 
          color: white; 
          padding: 12px 30px; 
          border-radius: 4px; 
          text-decoration: none;
          font-weight: bold;
        }
        .footer { color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin-bottom: 20px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Smart Plant Care</div>
        
        <div class="content">
          <p>Bonjour,</p>
          <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour continuer :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
          </div>
          
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="background: #f0f0f0; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${resetLink}
          </p>
          
          <div class="warning">
            <strong>⏰ Attention :</strong> Ce lien expire dans 15 minutes. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </div>
        </div>
        
        <div class="footer">
          <p>© 2026 Smart Plant Care Platform</p>
          <p>Projet universitaire IoT • Smart Agriculture</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transport.sendMail({
      from: process.env.MAILTRAP_FROM || "noreply@smartplantcare.com",
      to: userEmail,
      subject: "Réinitialisation de votre mot de passe - Smart Plant Care",
      html: htmlContent,
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
    });

    console.log(`✅ Email de réinitialisation envoyé à ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur d'envoi email à ${userEmail}:`, error.message);
    return false;
  }
};

export const sendWelcomeEmail = async (userName, userEmail) => {
  const transport = initializeTransporter();
  if (!transport) {
    console.log(`[Email Disabled] Welcome email for ${userEmail}`);
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        .header { color: #2d7d4a; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        .content { color: #333; line-height: 1.6; margin-bottom: 30px; }
        .footer { color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">🌿 Bienvenue chez Smart Plant Care</div>
        
        <div class="content">
          <p>Bonjour ${userName},</p>
          <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
          <ul>
            <li>Gérer vos pots connectés IoT</li>
            <li>Suivre la croissance de vos plantes en temps réel</li>
            <li>Accéder aux cours d'agriculture intelligente</li>
            <li>Participer aux jeux éducatifs</li>
          </ul>
          <p>Connectez-vous et commencez votre aventure !</p>
        </div>
        
        <div class="footer">
          <p>© 2026 Smart Plant Care Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transport.sendMail({
      from: process.env.MAILTRAP_FROM || "noreply@smartplantcare.com",
      to: userEmail,
      subject: "Bienvenue sur Smart Plant Care",
      html: htmlContent,
      text: `Bienvenue ${userName}! Votre compte a été créé.`,
    });

    console.log(`✅ Email de bienvenue envoyé à ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur d'envoi email de bienvenue à ${userEmail}:`, error.message);
    return false;
  }
};
