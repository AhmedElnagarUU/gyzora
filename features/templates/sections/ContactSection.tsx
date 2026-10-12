import { resolveLocalized, uiCopy } from '../lib/text'
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'
import type { SectionProps } from './types'

/**
 * Contact — the real contact details from `content.contact` (phone, email,
 * address, optional map embed, social links). No detail present → omitted.
 */
export function ContactSection({ content, locale, type }: SectionProps) {
  const { contact } = content
  const address = resolveLocalized(contact.address, locale)
  const hasAny = Boolean(
    contact.phone || contact.email || address || contact.mapUrl || contact.social
  )

  if (!hasAny) return null

  const socialEntries = Object.entries(contact.social ?? {}).filter(
    ([, url]) => Boolean(url)
  )

  return (
    <section
      data-section={type}
      id="contact"
      className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20"
      style={{ backgroundColor: 'var(--tp-background)' }}
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2
            className="mb-6 text-3xl font-bold tracking-tight"
            style={{
              color: 'var(--tp-foreground)',
              fontFamily: 'var(--tp-font-heading)',
            }}
          >
            {uiCopy(locale, 'contactHeading')}
          </h2>

          <ul className="space-y-4">
            {contact.phone ? (
              <li>
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center gap-3 font-medium"
                  style={{ color: 'var(--tp-foreground)' }}
                >
                  <Phone className="h-5 w-5" style={{ color: 'var(--tp-primary)' }} aria-hidden />
                  <span dir="ltr">{contact.phone}</span>
                </a>
              </li>
            ) : null}
            {contact.email ? (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-3 font-medium"
                  style={{ color: 'var(--tp-foreground)' }}
                >
                  <Mail className="h-5 w-5" style={{ color: 'var(--tp-primary)' }} aria-hidden />
                  <span dir="ltr">{contact.email}</span>
                </a>
              </li>
            ) : null}
            {address ? (
              <li className="inline-flex items-start gap-3 font-medium" style={{ color: 'var(--tp-foreground)' }}>
                <MapPin className="mt-1 h-5 w-5 shrink-0" style={{ color: 'var(--tp-primary)' }} aria-hidden />
                <span>{address}</span>
              </li>
            ) : null}
          </ul>

          {socialEntries.length ? (
            <ul className="mt-6 flex flex-wrap gap-3">
              {socialEntries.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium"
                    style={{
                      color: 'var(--tp-primary)',
                      borderColor: 'var(--tp-border)',
                    }}
                  >
                    {name}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {contact.mapUrl ? (
          <div>
            <iframe
              title={uiCopy(locale, 'contactHeading')}
              src={contact.mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full rounded-xl border"
              style={{ borderColor: 'var(--tp-border)' }}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}