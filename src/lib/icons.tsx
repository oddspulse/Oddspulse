/**
 * Icon Mapping Utility
 *
 * Centralized icon system using Lucide outline icons
 * Replaces emoji-based icons with professional monochrome outline SVGs
 *
 * All icons use:
 * - Outline style (no fills)
 * - Consistent stroke weight
 * - Cream/off-white color (#F2F1ED or rgba(242,241,237,0.85))
 * - Accessible (aria-hidden by default)
 */

import {
  Home,
  TrendingUp,
  Sparkles,
  DollarSign,
  Newspaper,
  Settings,
  ChevronRight,
  AlertTriangle,
  Search,
  X,
  Check,
  RefreshCw,
  Clock,
  Hourglass,
  Zap,
  Target,
  Building2,
  Calendar,
  Lightbulb,
  Mail,
  Inbox,
  Disc,
  Lock,
  XCircle,
  TimerReset,
  CircleDollarSign,
  Award,
  // Sport icons
  Goal,        // Soccer ⚽
  Trophy,      // Champions League 🏆
  Dumbbell,    // UFC 🥊
  Glasses,     // Tennis 🎾
  Flag,        // Golf ⛳
  type LucideIcon,
} from 'lucide-react';

// Icon size type
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Icon size mapping (in pixels)
const ICON_SIZES: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

// Icon props interface
export interface IconProps {
  size?: IconSize;
  className?: string;
  'aria-hidden'?: boolean;
}

// Default icon styling
export const getIconClassName = (className?: string) => {
  return `stroke-[#F2F1ED] opacity-85 ${className || ''}`.trim();
};

// Icon component wrapper
export const createIcon = (Icon: LucideIcon) => {
  return ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
    <Icon
      size={ICON_SIZES[size]}
      className={getIconClassName(className)}
      aria-hidden={ariaHidden}
      strokeWidth={1.5}
    />
  );
};

// Exported icons with consistent styling
export const Icons = {
  // Navigation icons (replacing emojis)
  home: createIcon(Home),                    // Replaces 🏠
  chart: createIcon(TrendingUp),             // Replaces 📊
  crystal: createIcon(Sparkles),             // Replaces 🔮 (prediction/crystal ball)
  dollar: createIcon(DollarSign),            // Replaces 💰
  casino: createIcon(Disc),                  // Replaces 🎰 (professional casino chip)
  news: createIcon(Newspaper),               // Replaces 📰
  settings: createIcon(Settings),            // Replaces ⚙️

  // Action icons
  check: createIcon(Check),                  // Replaces ✓
  search: createIcon(Search),                // Replaces 🔍
  close: createIcon(X),                      // Replaces ✕
  refresh: createIcon(RefreshCw),            // Replaces 🔄
  chevronRight: createIcon(ChevronRight),    // Replaces →

  // Status/Info icons
  warning: createIcon(AlertTriangle),        // Replaces ⚠️
  clock: createIcon(Clock),                  // Replaces 🕐
  hourglass: createIcon(Hourglass),          // Replaces ⏳ ⏰
  zap: createIcon(Zap),                      // Replaces ⚡ (live indicator)
  target: createIcon(Target),                // Replaces 🎯
  lightbulb: createIcon(Lightbulb),          // Replaces 💡

  // Category icons
  building: createIcon(Building2),           // Replaces 🏢 (sportsbooks)
  calendar: createIcon(Calendar),            // Replaces 📅
  inbox: createIcon(Inbox),                  // Replaces 📭

  // Auth icons
  lock: createIcon(Lock),                    // Replaces 🔐
  mail: createIcon(Mail),                    // Replaces ✉️
  xCircle: createIcon(XCircle),              // Replaces 🚫
  timerReset: createIcon(TimerReset),        // Replaces ⏰

  // Sport icons (generic shapes for NFL/NBA/NHL/MLB/etc)
  football: createIcon(Target),              // NFL 🏈 (generic)
  basketball: createIcon(Disc),              // NBA 🏀 (circular)
  hockey: createIcon(Zap),                   // NHL 🏒 (angular)
  baseball: createIcon(Disc),                // MLB ⚾ (circular)
  soccer: createIcon(Goal),                  // EPL/Soccer ⚽
  championsLeague: createIcon(Trophy),       // UCL 🏆
  ufc: createIcon(Dumbbell),                 // UFC 🥊
  tennis: createIcon(Target),                // Tennis 🎾
  golf: createIcon(Flag),                    // Golf ⛳

  // Market type icons
  moneyline: createIcon(CircleDollarSign),   // 💰
  spread: createIcon(TrendingUp),            // 📊 (already exists as chart)
  total: createIcon(Target),                 // 🎯 (already exists)

  // Section header icons
  trophyIcon: createIcon(Trophy),            // 🏆
  chartLineIcon: createIcon(TrendingUp),     // 📈
  gearIcon: createIcon(Settings),            // ⚙️
  searchCircleIcon: createIcon(Search),      // 🔍
  awardIcon: createIcon(Award),              // For achievements/highlights
};

// Direct icon components for use in JSX
export const HomeIcon = Icons.home;
export const ChartIcon = Icons.chart;
export const CrystalIcon = Icons.crystal;
export const DollarIcon = Icons.dollar;
export const CasinoIcon = Icons.casino;
export const NewsIcon = Icons.news;
export const SettingsIcon = Icons.settings;
export const CheckIcon = Icons.check;
export const SearchIcon = Icons.search;
export const CloseIcon = Icons.close;
export const RefreshIcon = Icons.refresh;
export const WarningIcon = Icons.warning;
export const ClockIcon = Icons.clock;
export const HourglassIcon = Icons.hourglass;
export const ZapIcon = Icons.zap;
export const TargetIcon = Icons.target;
export const LightbulbIcon = Icons.lightbulb;
export const BuildingIcon = Icons.building;
export const CalendarIcon = Icons.calendar;
export const InboxIcon = Icons.inbox;
export const ChevronRightIcon = Icons.chevronRight;
export const LockIcon = Icons.lock;
export const MailIcon = Icons.mail;
export const XCircleIcon = Icons.xCircle;
export const TimerResetIcon = Icons.timerReset;

// Sport icons
export const FootballIcon = Icons.football;
export const BasketballIcon = Icons.basketball;
export const HockeyIcon = Icons.hockey;
export const BaseballIcon = Icons.baseball;
export const SoccerIcon = Icons.soccer;
export const ChampionsLeagueIcon = Icons.championsLeague;
export const UfcIcon = Icons.ufc;
export const TennisIcon = Icons.tennis;
export const GolfIcon = Icons.golf;

// Market type icons
export const MoneylineIcon = Icons.moneyline;
export const SpreadIcon = Icons.spread;
export const TotalIcon = Icons.total;

// Section icons
export const TrophyIconExport = Icons.trophyIcon;
export const ChartLineIcon = Icons.chartLineIcon;
export const GearIcon = Icons.gearIcon;
export const SearchCircleIcon = Icons.searchCircleIcon;
export const AwardIcon = Icons.awardIcon;
