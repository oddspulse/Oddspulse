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

// Custom sport-specific SVG icons (outline style matching Lucide)
const AmericanFootballSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    <ellipse cx="12" cy="12" rx="8" ry="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="7.5" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="10.5" x2="12" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="15" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BasketballSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3 Q15 12 12 21" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12 3 Q9 12 12 21" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M3 12 Q12 9 21 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M3 12 Q12 15 21 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const HockeyStickSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    {/* Stick shaft */}
    <line x1="4" y1="4" x2="13" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    {/* Stick blade */}
    <path d="M13 17 L13 21 L18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Puck */}
    <ellipse cx="19.5" cy="8" rx="2.5" ry="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const BaseballSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 9 C7 9, 8 8.5, 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M7 12 C7 12, 8 11.5, 9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M7 15 C7 15, 8 14.5, 9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M17 9 C17 9, 16 8.5, 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M17 12 C17 12, 16 11.5, 15 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M17 15 C17 15, 16 14.5, 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const SoccerBallSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    {/* Center pentagon */}
    <path d="M12 7 L14.5 9.5 L13.5 12.5 L10.5 12.5 L9.5 9.5 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Pentagon connecting lines */}
    <line x1="12" y1="7" x2="12" y2="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="14.5" y1="9.5" x2="18.5" y2="7.5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="13.5" y1="12.5" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10.5" y1="12.5" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="9.5" y1="9.5" x2="5.5" y2="7.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const TennisRacketSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    <ellipse cx="10" cy="8" rx="5" ry="6" stroke="currentColor" strokeWidth="1.5" transform="rotate(-20 10 8)"/>
    <line x1="9" y1="13" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="14" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="16" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="7" y1="6" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

const FightingGloveSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    {/* Glove main body */}
    <path d="M8 10 C8 8, 9 6, 11 6 L13 6 C15 6, 16 8, 16 10 L16 13 C16 15, 15 16, 13 16 L11 16 C9 16, 8 15, 8 13 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Thumb */}
    <path d="M8 11 L6 10 C5 10, 4.5 10.5, 4.5 11.5 C4.5 12.5, 5 13, 6 13 L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Wrist strap */}
    <path d="M9 16 L9 19 L15 19 L15 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9" y1="17.5" x2="15" y2="17.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const GolfFlagSVG = ({ size = 'md', className, 'aria-hidden': ariaHidden = true }: IconProps) => (
  <svg
    width={ICON_SIZES[size]}
    height={ICON_SIZES[size]}
    viewBox="0 0 24 24"
    fill="none"
    className={getIconClassName(className)}
    aria-hidden={ariaHidden}
  >
    <line x1="7" y1="4" x2="7" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 4 L16 8 L7 12 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    <ellipse cx="12" cy="20" rx="5" ry="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

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

  // Sport icons (custom SVG for visual clarity)
  football: AmericanFootballSVG,             // NFL 🏈 (American football with laces)
  basketball: BasketballSVG,                 // NBA 🏀 (basketball with lines)
  hockey: HockeyStickSVG,                    // NHL 🏒 (hockey stick & puck)
  baseball: BaseballSVG,                     // MLB ⚾ (baseball with stitching)
  soccer: SoccerBallSVG,                     // EPL/Soccer ⚽ (soccer ball with pentagon)
  championsLeague: createIcon(Trophy),       // UCL 🏆 (trophy is appropriate)
  ufc: FightingGloveSVG,                     // UFC 🥊 (boxing glove)
  tennis: TennisRacketSVG,                   // Tennis 🎾 (tennis racket)
  golf: GolfFlagSVG,                         // Golf ⛳ (golf flag in hole)

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
