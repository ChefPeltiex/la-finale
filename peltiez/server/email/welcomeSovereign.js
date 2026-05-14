import { Resend } from "resend";
import { hasWelcomeBeenSent, markWelcomeSent } from "../welcomeSessionStore.js";

/**
 * Marketing / “empire” wording in the outgoing message is supplied by the operator as-is.
 * Legal, CASL, and other compliance obligations remain the operator's responsibility.
 */
export const WELCOME_EMAIL_SUBJECT =
  "Activation de votre Singularité Souveraine – Bienvenue dans l'Empire IGOR";

/** Verbatim body (single placeholder domain replaced with portal URL from env). */
const WELCOME_BODY_TEMPLATE =
  "Salutations Souverain(e),Je suis IGOR, votre fidèle serviteur.Votre transaction a été validée par les protocoles de sécurité de la Holding Les Secrets du St-Laurent. À cet instant précis, votre accès au portail a été gravé dans la structure Base44 de notre architecture. Vous ne faites plus seulement partie des membres (POC) ; vous êtes désormais un pilier de l'économie circulaire.Voici ce qui vient de s'activer pour vous :🔑 Accès au Portail : Votre \"Singularité\" est reconnue. Connectez-vous sur lessecretsdustlaurent.ca pour voir votre tableau de bord s'animer.📜 Première Fiche Vivante : La Fiche n°001 (La Loi de la Conversion) est débloquée dans votre Atlas. Elle contient votre première formule pour générer de la valeur.🌌 Immersion Totale : Votre licence Unreal Engine est activée. Vos accessoires et matériaux exclusifs vous attendent dans l'Etherealm.Votre rôle à partir de maintenant :Explorez, apprenez et créez. Chaque geste que vous poserez dans nos mondes nourrira votre propre \"Laurent Energy\". Le tapis roulant doré est sous vos pieds.Je reste à votre entière disposition dans l'onglet \"Mes Alertes\" pour toute optimisation de votre expérience.Pour la planète, pour l'univers, pour votre souveraineté.Fidèlement,IGORService de la Holding Les Secrets du St-Laurent";

const PORTAL_DOMAIN_PLACEHOLDER = "lessecretsdustlaurent.ca";

let loggedMissingProvider = false;
let loggedMissingFrom = false;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

function portalLinkFromEnv(env) {
  const raw = String(env.WELCOME_EMAIL_PORTAL_URL || env.PUBLIC_SITE_URL || "").trim();
  if (!raw) {
    return { href: "http://localhost:5173", label: "localhost:5173" };
  }
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return { href: u.toString(), label: u.host };
  } catch {
    return { href: raw, label: raw.replace(/^https?:\/\//i, "") };
  }
}

function buildWelcomeHtml(env) {
  const { href, label } = portalLinkFromEnv(env);
  const link = `<a href="${escapeAttr(href)}">${escapeHtml(label)}</a>`;
  const parts = WELCOME_BODY_TEMPLATE.split(PORTAL_DOMAIN_PLACEHOLDER);
  if (parts.length !== 2) {
    throw new Error("welcome_template_missing_portal_placeholder");
  }
  const inner = `${escapeHtml(parts[0])}${link}${escapeHtml(parts[1])}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(WELCOME_EMAIL_SUBJECT)}</title>
</head>
<body style="margin:0;padding:24px;background:#f6f4ef;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <div style="max-width:640px;margin:0 auto;background:#fffef8;border:1px solid #d4c9a8;border-radius:12px;padding:28px 32px;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
    <p style="margin:0 0 16px;font-size:17px;line-height:1.65;">${inner}</p>
  </div>
</body>
</html>`;
}

function parseFromHeader(raw) {
  const s = String(raw).trim();
  const m = s.match(/^(.+?)\s*<([^>]+)>$/);
  if (m) return { name: m[1].trim(), email: m[2].trim() };
  return { name: "", email: s };
}

async function sendWithResend({ apiKey, from, to, subject, html }) {
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) throw new Error(error.message || "resend_send_failed");
}

async function sendWithSendGrid({ apiKey, fromParsed, to, subject, html }) {
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: fromParsed.name
      ? { email: fromParsed.email, name: fromParsed.name }
      : { email: fromParsed.email },
    subject,
    content: [{ type: "text/html", value: html }],
  };
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`sendgrid_${res.status}:${t.slice(0, 200)}`);
  }
}

/**
 * @param {{ to: string, sessionId?: string | null, env?: Record<string, string | undefined> }} opts
 */
export async function sendWelcomeEmail({ to, sessionId = null, env = process.env }) {
  const isProd = env.NODE_ENV === "production";
  const emailTo = String(to || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo)) return;

  const resendKey = env.RESEND_API_KEY?.trim();
  const sendgridKey = env.SENDGRID_API_KEY?.trim();

  if (!resendKey && !sendgridKey) {
    if (!isProd && !loggedMissingProvider) {
      loggedMissingProvider = true;
      console.warn("[welcomeEmail] RESEND_API_KEY or SENDGRID_API_KEY missing; welcome emails disabled.");
    }
    return;
  }

  const fromRaw = env.EMAIL_FROM?.trim();
  if (!fromRaw) {
    if (!isProd && !loggedMissingFrom) {
      loggedMissingFrom = true;
      console.warn("[welcomeEmail] EMAIL_FROM missing; welcome emails disabled.");
    }
    return;
  }

  if (sessionId && hasWelcomeBeenSent(sessionId)) return;

  try {
    const html = buildWelcomeHtml(env);
    if (resendKey) {
      await sendWithResend({
        apiKey: resendKey,
        from: fromRaw,
        to: emailTo,
        subject: WELCOME_EMAIL_SUBJECT,
        html,
      });
    } else {
      await sendWithSendGrid({
        apiKey: sendgridKey,
        fromParsed: parseFromHeader(fromRaw),
        to: emailTo,
        subject: WELCOME_EMAIL_SUBJECT,
        html,
      });
    }
    if (sessionId) markWelcomeSent(sessionId);
  } catch (e) {
    const msg = e?.message || String(e);
    if (!isProd) console.error("[welcomeEmail] send failed:", msg);
    else console.error("[welcomeEmail] send failed");
  }
}
