import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Circle,
  Compass,
  HardHat,
  Headset,
  Home,
  KeyRound,
  MapPin,
  MessageSquare,
  Paintbrush,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

/**
 * Resolve a lucide icon name → component (DEC-006: lucide only).
 *
 * Icon names in content are strings (user/seed data). Unknown names must
 * never crash rendering: they gracefully fall back to a neutral `Circle`
 * icon (TEMPLATE_SYSTEM §10 — graceful degradation).
 */
const ICON_REGISTRY: Record<string, LucideIcon> = {
  BadgeCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Compass,
  HardHat,
  Headset,
  Home,
  KeyRound,
  MapPin,
  MessageSquare,
  Paintbrush,
  ShieldCheck,
  Wrench,
}

export function getIcon(name: string | undefined): LucideIcon {
  if (!name) return Circle
  return ICON_REGISTRY[name] ?? Circle
}