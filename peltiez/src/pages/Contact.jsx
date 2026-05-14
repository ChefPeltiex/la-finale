import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SITE_TAGLINE, SUPPORT_EMAIL } from '@/lib/site';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const body = `Nom: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
      const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(formData.subject || 'Contact Egor69')}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Impossible d’ouvrir le client mail. Écrivez-nous directement à support@egor69.ca');
      console.error('Contact form error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Nous contacter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {SITE_TAGLINE}. Écrivez-nous pour partenariats, presse ou souveraineté technique.
            Le formulaire ouvre votre messagerie — aucune donnée captée par un tiers fantôme.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Mail,
              title: 'Email',
              content: SUPPORT_EMAIL,
              link: `mailto:${SUPPORT_EMAIL}`
            },
            {
              icon: Phone,
              title: 'Téléphone',
              content: '+1 (438) 888-CIRC',
              link: 'tel:+14388888247'
            },
            {
              icon: MapPin,
              title: 'Localisation',
              content: 'Montréal, Québec',
              link: 'https://maps.google.com/?q=Montreal'
            }
          ].map((method, i) => (
            <a
              key={i}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card rounded-2xl border border-border p-8 text-center hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <method.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{method.title}</h3>
              <p className="text-sm text-muted-foreground hover:text-primary transition-colors">{method.content}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-card rounded-2xl border border-border p-10 mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">Envoyez-nous un message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Nom</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="rounded-xl h-11"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                className="rounded-xl h-11"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Sujet</label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Sujet de votre message"
                required
                className="rounded-xl h-11"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Votre message..."
                required
                rows="6"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            {/* Alerts */}
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Message envoyé avec succès!</p>
                  <p className="text-sm text-emerald-800">Nous vous répondrons très bientôt.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Erreur</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 border-0"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</>
              ) : (
                <><Send className="h-4 w-4" /> Envoyer le message</>
              )}
            </Button>
          </form>
        </div>

        {/* Social Links */}
        <div className="text-center rounded-2xl border border-border bg-card/50 p-6">
          <p className="text-sm text-muted-foreground mb-2">Réseaux officiels</p>
          <p className="text-xs text-muted-foreground mb-4">Liens publics publiés uniquement quand validés — pas de pages fantômes.</p>
          <a href="https://egor69.ca" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">egor69.ca</a>
        </div>
      </section>

      {/* Spacing */}
      <div className="flex-1" />
    </div>
  );
}