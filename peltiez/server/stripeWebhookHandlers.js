import { upsertByEmail } from "./subscriptionLedger.js";
import { tierFromPriceId } from "./lib/stripeTierMap.js";
import { sendWelcomeEmail } from "./email/welcomeSovereign.js";

async function resolveCustomerEmail(stripe, session, customerIdFallback) {
  let email = session.customer_details?.email || session.customer_email;
  const rawCid = customerIdFallback ?? session.customer;
  const cid = typeof rawCid === "string" ? rawCid : rawCid?.id ?? null;
  if (!email && cid) {
    try {
      const customer = await stripe.customers.retrieve(cid);
      email = customer.email;
    } catch {
      return null;
    }
  }
  return email || null;
}

/**
 * Met à jour le registre local à partir des événements Stripe (abonnements).
 * Envoie le courriel de bienvenue une fois par session de paiement réussie (abonnement ou Pass Souverain).
 */
export async function handleStripeSubscriptionEvent(stripe, event, env) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status !== "paid") return;

      if (session.mode === "subscription") {
        const subId = session.subscription;
        if (!subId) return;

        const sub = await stripe.subscriptions.retrieve(typeof subId === "string" ? subId : subId.id);
        const email = await resolveCustomerEmail(stripe, session, sub.customer);
        if (!email) return;

        const priceId = sub.items?.data?.[0]?.price?.id;
        upsertByEmail(email, {
          status: sub.status,
          tier: tierFromPriceId(priceId, env),
          subscriptionId: sub.id,
          priceId: priceId || null,
          source: "checkout.session.completed",
        });

        await sendWelcomeEmail({ to: email, sessionId: session.id, env });
        break;
      }

      if (session.mode === "payment") {
        const passPriceId = env.STRIPE_PASS_SOUVERAIN_PRICE_ID?.trim();
        if (!passPriceId) return;

        const expanded = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items.data.price"],
        });
        const hasPass = expanded.line_items?.data?.some((li) => li.price?.id === passPriceId);
        if (!hasPass) return;

        const email = await resolveCustomerEmail(stripe, session, expanded.customer);
        if (!email) return;

        await sendWelcomeEmail({ to: email, sessionId: session.id, env });
        break;
      }

      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = sub.customer;
      if (!customerId) return;

      let email;
      try {
        const customer = await stripe.customers.retrieve(customerId);
        email = customer.email;
      } catch {
        return;
      }
      if (!email) return;

      const priceId = sub.items?.data?.[0]?.price?.id;
      upsertByEmail(email, {
        status: sub.status,
        tier: tierFromPriceId(priceId, env),
        subscriptionId: sub.id,
        priceId: priceId || null,
        source: event.type,
      });
      break;
    }

    default:
      break;
  }
}
