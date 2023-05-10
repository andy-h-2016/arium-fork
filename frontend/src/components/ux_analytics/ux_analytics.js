import reactGA4 from "react-ga4";
import tagManager from "react-gtm-module";

export const EVENTS = {
  INCREMENT_CUP_CONSUMED: 'increment_cup_consumed',
  DECREMENT_CUP_CONSUMED: 'decrement_cup_consumed',
  INCREMENT_GOAL: 'increment_goal',
  DECREMENT_GOAL: 'decrement_goal',
  INCREASE_LEVEL: 'increase_level',
  MAINTAIN_LEVEL: 'maintain_level',
  DECREASE_LEVEL: 'decrease_level',
  SIGN_IN: 'sign_in',
  REGISTER: 'register', 
  DEMO_SIGN_IN: 'demo_sign_in'
}

export default class UxAnalytics {
  static init() {
    reactGA4.initialize("G-KP275WET8C", {
      testMode: false,
      gaOptions: {
        anonymizeIp: false,
      },
    });

    tagManager.initialize({ gtmId: "GTM-TX65LWC" });
    window.reactGA4 = reactGA4;
  }

  static logEvent(event, properties) {
    try {
      window.reactGA4.event({
        category: 'Website',
        action: event,
      })
    } catch (err) {
      console.log('ERROR LOGGING EVENT. CHECK ERROR LOG.')
      console.error(err)
    }
  }
}
