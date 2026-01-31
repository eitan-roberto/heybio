/**
 * Analytics Service
 * Product events for user behavior tracking
 * MVP: console.log, Production: Mixpanel/Amplitude/PostHog
 */

interface AnalyticsEvent {
  event_id: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

function track(event_id: string, properties?: Record<string, unknown>): AnalyticsEvent {
  const event: AnalyticsEvent = {
    event_id,
    properties,
    timestamp: new Date().toISOString(),
  };

  // MVP: Console logging
  // Production: Send to Mixpanel, Amplitude, PostHog, etc.
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ANALYTICS] ${event_id}`, properties || '');
  }

  return event;
}

function identify(userId: string, traits?: Record<string, unknown>) {
  // MVP: Console logging
  // Production: Identify user in analytics platform
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ANALYTICS] identify:`, { userId, traits });
  }
}

function page(pageName: string, properties?: Record<string, unknown>) {
  return track('page_viewed', { page_name: pageName, ...properties });
}

export const analyticsService = {
  track,
  identify,
  page,
  
  // Common events
  events: {
    // Onboarding
    ONBOARDING_STARTED: 'onboarding_started',
    USERNAME_SELECTED: 'username_selected',
    LINK_ADDED: 'link_added',
    THEME_SELECTED: 'theme_selected',
    SIGNUP_COMPLETED: 'signup_completed',
    
    // Page
    PAGE_CREATED: 'page_created',
    PAGE_UPDATED: 'page_updated',
    PAGE_VIEWED: 'page_viewed',
    
    // Links
    LINK_CLICKED: 'link_clicked',
    LINK_DELETED: 'link_deleted',
    LINK_REORDERED: 'link_reordered',
    
    // Pro
    PRO_UPGRADE_STARTED: 'pro_upgrade_started',
    PRO_UPGRADE_COMPLETED: 'pro_upgrade_completed',
    
    // Auth
    LOGIN_COMPLETED: 'login_completed',
    LOGOUT_COMPLETED: 'logout_completed',
  },
};
