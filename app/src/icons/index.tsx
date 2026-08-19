import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

// Every path below is copied from the .dc.html source so the icons stay
// pixel-identical to the design (viewBox 0 0 24 24, stroke-based).

export function FaceIdIcon({ size = 24, color = '#416180', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Path d="M4 8V6a2 2 0 012-2h2" />
      <Path d="M20 8V6a2 2 0 00-2-2h-2" />
      <Path d="M4 16v2a2 2 0 002 2h2" />
      <Path d="M20 16v2a2 2 0 01-2 2h-2" />
      <Circle cx={9} cy={10} r={1} />
      <Circle cx={15} cy={10} r={1} />
      <Path d="M9 15c1 1 5 1 6 0" />
    </Svg>
  );
}

export function BellIcon({ size = 20, color = '#1d1f20', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.7 21a2 2 0 01-3.4 0" />
    </Svg>
  );
}

export function BackChevronIcon({ size = 16, color = '#1d1f20', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SendIcon({ size = 16, color = '#fff', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Path d="M4 20l16-8L4 4v6l10 2-10 2z" strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 20, color = '#1d1f20', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Circle cx={11} cy={11} r={7} />
      <Path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </Svg>
  );
}

export function CalendarIcon({ size = 20, color = '#1d1f20', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Rect x={3} y={4} width={18} height={17} />
      <Path d="M3 9h18M8 2v4M16 2v4" />
    </Svg>
  );
}

// ── Bottom-nav icons ────────────────────────────────────────────────────
export function NavFeedIcon({ size = 21, color = '#7a7a7d', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Rect x={3} y={3} width={7} height={7} />
      <Rect x={14} y={3} width={7} height={7} />
      <Rect x={3} y={14} width={7} height={7} />
      <Rect x={14} y={14} width={7} height={7} />
    </Svg>
  );
}

export function NavScheduleIcon({ size = 21, color = '#7a7a7d', strokeWidth = 1.5 }: IconProps) {
  return <CalendarIcon size={size} color={color} strokeWidth={strokeWidth} />;
}

export function NavMessagesIcon({ size = 21, color = '#7a7a7d', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Path d="M3 5h18v11H7l-4 4V5z" />
    </Svg>
  );
}

export function NavProfileIcon({ size = 21, color = '#7a7a7d', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </Svg>
  );
}
