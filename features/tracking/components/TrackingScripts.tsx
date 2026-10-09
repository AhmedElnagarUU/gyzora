import { TrackingConfig } from '@/features/tracking/model'
import { connectToDatabase } from '@/shared/lib/db/mongoose'
import Script from 'next/script'

interface TrackerScript {
  id: string
  strategy: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive'
  tagName: 'script'
  src?: string
  content?: string
  onError?: string
}

async function getTenantTrackers(
  tenantSlug: string
): Promise<any[]> {
  await connectToDatabase()
  const Tenant = (await import('@/features/tenants/model')).Tenant
  const tenant = await Tenant.findOne({ slug: tenantSlug, status: 'ACTIVE' }).lean()
  if (!tenant) return []

  const config = await TrackingConfig.findOne({ tenantId: tenant._id }).lean()
  if (!config) return []

  return config.trackers.filter((t: any) => t.enabled)
}

export async function TrackingScripts({ tenantSlug }: { tenantSlug: string }) {
  const trackers = await getTenantTrackers(tenantSlug)

  const scripts: TrackerScript[] = []

  for (const tracker of trackers) {
    if (tracker.provider === 'meta-pixel' && tracker.pixelId) {
      scripts.push({
        id: `fb-pixel-${tracker.pixelId}`,
        strategy: 'afterInteractive',
        tagName: 'script',
        content: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=2;
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${tracker.pixelId}');
          fbq('track', 'PageView');
        `,
      })
    }

    if (tracker.provider === 'google-analytics' && tracker.trackingId) {
      scripts.push({
        id: `ga-${tracker.trackingId}`,
        strategy: 'afterInteractive',
        tagName: 'script',
        src: `https://www.googletagmanager.com/gtag/js?id=${tracker.trackingId}`,
      })
      scripts.push({
        id: `ga-init-${tracker.trackingId}`,
        strategy: 'afterInteractive',
        tagName: 'script',
        content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${tracker.trackingId}');
        `,
      })
    }

    if (tracker.provider === 'custom' && tracker.scriptUrl) {
      scripts.push({
        id: `custom-${tracker._id}`,
        strategy: 'afterInteractive',
        tagName: 'script',
        src: tracker.scriptUrl,
      })
    }
  }

  if (scripts.length === 0) return null

  return (
    <>
      {scripts.map((s) => (
        <Script
          key={s.id}
          id={s.id}
          strategy={s.strategy}
          src={s.src}
          onError={s.onError}
        >
          {s.content}
        </Script>
      ))}
    </>
  )
}
