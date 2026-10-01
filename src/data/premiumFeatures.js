import {
  Bot, BookOpen, Crosshair, Target, Sparkles, Video, Save, UserCog, Palette, ListChecks,
} from 'lucide-react'
import { FREE_AI_COACH_LIMIT } from '../lib/entitlement.js'

// One row per feature in the Premium comparison. `status: 'live'` rows are
// gated today and name their `entitlement` key in src/lib/entitlement.js
// (each is enforced server-side); `'coming-soon'` rows are honest about not
// being wired up yet. Copy only — access is never decided from this file.
export const premiumFeatures = [
  {
    id: 'ai-coach',
    icon: Bot,
    title: 'AI Coach',
    freeDescription: `${FREE_AI_COACH_LIMIT} messages every 24 hours`,
    premiumDescription: 'Unlimited AI conversations',
    status: 'live',
    entitlement: 'ai-coach-unlimited',
  },
  {
    id: 'guides',
    icon: BookOpen,
    title: 'Guides',
    freeDescription: 'Core guides library',
    premiumDescription: 'Full library, including advanced Premium guides',
    status: 'live',
    entitlement: 'premium-guides',
  },
  {
    id: 'crosshair',
    icon: Crosshair,
    title: 'Crosshair Generator',
    freeDescription: 'Basic functionality',
    premiumDescription: 'Advanced Crosshair Generator',
    status: 'coming-soon',
  },
  {
    id: 'aim-settings',
    icon: Target,
    title: 'Aim & Settings',
    freeDescription: 'Not available',
    premiumDescription: 'Advanced aim/settings analysis',
    status: 'coming-soon',
  },
  {
    id: 'ai-analysis',
    icon: Sparkles,
    title: 'AI Analysis',
    freeDescription: 'Not available',
    premiumDescription: 'Advanced AI-powered analysis',
    status: 'coming-soon',
  },
  {
    id: 'match-vod',
    icon: Video,
    title: 'Match / VOD',
    freeDescription: 'Limited functionality',
    premiumDescription: 'Full Match and VOD analysis',
    status: 'coming-soon',
  },
  {
    id: 'saved-configs',
    icon: Save,
    title: 'Saved Configurations',
    freeDescription: 'Limited',
    premiumDescription: 'Unlimited saved configurations',
    status: 'coming-soon',
  },
  {
    id: 'profile-customization',
    icon: UserCog,
    title: 'Profile Customization',
    freeDescription: 'Not available',
    premiumDescription: 'Premium profile customization',
    status: 'coming-soon',
  },
  {
    id: 'theme-customization',
    icon: Palette,
    title: 'Theme Customization',
    freeDescription: 'Default STRATIX theme only',
    premiumDescription: 'Unlock exclusive STRATIX themes',
    status: 'live',
    entitlement: 'premium-themes',
  },
  {
    id: 'quizzes',
    icon: ListChecks,
    title: 'Quizzes',
    freeDescription: 'Not available',
    premiumDescription: 'Premium-exclusive quizzes',
    status: 'coming-soon',
  },
]
