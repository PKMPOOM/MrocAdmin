export interface SiteConfig {
  id: string;
  general_config: GeneralConfig;
  rewards_config: RewardsConfig;
  security_config: SecurityConfig;
}

export type SecurityConfig = {
  id: string;
  user_lockout_time: number;
  max_login_attemp: number;
  cheque_min_cashout: number;
  activity_status: ActivityStatus[];
};

export type ActivityStatus = {
  id: string;
  name: string;
  active_from: number;
  active_until: number;
  reminder_email: boolean;
};

export type GeneralConfig = {
  id: string;
  site_title: string;
  panel_title: string | null;
  city: string | null;
  phone_number: string | null;
  street_address: string | null;
  country: string | null;
  province: string | null;
  postal_code: string | null;
  operation_hours: Date[];
  show_news: boolean;
  show_contact_info: boolean;
  snatch_bot: boolean;
  show_user_avatar: boolean;
  google_analytics: boolean;
  sefe_serve_registration: boolean;
  discussions: boolean;
  allow_user_to_invite_friends: boolean;
  api_intergration: boolean;
  user_export_permission: boolean;
  privacy_policy_on_registration: boolean;
  carousel_speed: number;
  campaign_delay: number;
  privacy_policy_link_text: string | null;
  privacy_policy_agree_text: string | null;
  first_tile_displayed: string | null;
  login_background_speed_ms: number;
  support_email: string | null;
  google_analytics_id: string | null;
  privacy_policy_url: string | null;
  user_email_settings_timezone: string | null;
  meta_pixel: boolean;
  meta_pixel_id: string | null;
};

export type RewardsConfig = {
  id: string;
  boolean_forms: SwitchRewardsSettingsTypes;
  text_forms: InputRewardsSettingsTypes;
};

export type SwitchRewardsSettingsTypes = {
  rewards: boolean;
  cheque_usage: boolean;
  paypal_usage: boolean;
  user_checkout: boolean;
  charities_usage: boolean;
  e_transfer: boolean;
  site_uses_draws: boolean;
  marketplace: boolean;
  checkout_all_users_button: boolean;
  cash_out_alert: boolean;
};

export type InputRewardsSettingsTypes = {
  cap: number;
  max_allowed_survey_points: number;
  points_per_dollar: number;
  cheque_min_cashout: number;
  new_account_credit: number;
  e_transfer_min_cashout: number;
  referral_credit: number;
  paypal_min_cashout: number;
  charity_min_cashout: number;
  trigger_large_cashout_alert_at: number;
  redeem_email: string;
  currency_symbol: string;
  large_cashout_email: string;
  new_member_comment: string;
};
