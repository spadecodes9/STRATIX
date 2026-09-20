import {
  Bot, BookOpen, Crosshair, Target, Sparkles, Video, Save, UserCog, Palette, ListChecks,
} from 'lucide-react'

// Each entry is one Premium Hub feature card. `status: 'gated'` means the
// free/premium split is actually enforced in the app today (see AI Coach
// and Guides); everything else is `'coming-soon'` — visible and honest
// about not being wired up yet, per the free/premium table in the spec.
export const premiumFeatures = [
  {
    id: 'ai-coach',
    icon: Bot,
    title: 'AI Coach',
    freeDescription: 'Limited to 3 chats',
    premiumDescription: 'Unlimited AI conversations',
    status: 'gated',
  },
  {
    id: 'guides',
    icon: BookOpen,
    title: 'Guides',
    freeDescription: 'Limited selection of guides',
    premiumDescription: 'Full Guides Library',
    status: 'gated',
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
    status: 'gated',
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
