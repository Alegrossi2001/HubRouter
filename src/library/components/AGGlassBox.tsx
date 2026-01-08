import * as React from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export interface AGGlassBoxProps extends BoxProps {
    /** Enable glassmorphism effect (blur + transparency) */
    glass?: boolean;
    /** Blur intensity for glass effect in px (default 12) */
    glassBlur?: number;
    /** Glass background opacity (0-1, default 0.15) */
    glassOpacity?: number;
    /** Glass tint color - palette token or CSS color (default white) */
    glassTint?: string;

    /** Border width in px (default 1) */
    borderWidth?: number;
    /** Border color - palette token or CSS color */
    borderColor?: string;
    /** Border style (default 'solid') */
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';

    /** Border radius - number (px) or CSS value */
    rounded?: number | string;

    /** Base box shadow */
    shadow?: string;
    /** Enable shadow on hover */
    shadowOnHover?: boolean;
    /** Custom hover shadow (defaults to elevated version of shadow) */
    hoverShadow?: string;

    /** Enable lift effect on hover */
    liftOnHover?: boolean;
    /** Lift amount in px (default 4) */
    liftAmount?: number;

    /** Transition duration in ms (default 200) */
    transitionDuration?: number;

    /** Padding shorthand */
    padding?: number | string;
}

interface StyledExtras {
    $glass: boolean;
    $glassBlur: number;
    $glassOpacity: number;
    $glassTint: string;
    $borderWidth: number;
    $borderColor: string;
    $borderStyle: string;
    $rounded: number | string;
    $shadow: string;
    $shadowOnHover: boolean;
    $hoverShadow: string;
    $liftOnHover: boolean;
    $liftAmount: number;
    $transitionMs: number;
    $padding?: number | string;
    $hasHoverEffect: boolean;
}

const StyledGlassBox = styled(Box, {
    name: 'AGGlassBox',
    slot: 'Root',
    shouldForwardProp: (prop) =>
        ![
            '$glass',
            '$glassBlur',
            '$glassOpacity',
            '$glassTint',
            '$borderWidth',
            '$borderColor',
            '$borderStyle',
            '$rounded',
            '$shadow',
            '$shadowOnHover',
            '$hoverShadow',
            '$liftOnHover',
            '$liftAmount',
            '$transitionMs',
            '$padding',
            '$hasHoverEffect',
        ].includes(String(prop)),
})<StyledExtras>(
    ({
        $glass,
        $glassBlur,
        $glassOpacity,
        $glassTint,
        $borderWidth,
        $borderColor,
        $borderStyle,
        $rounded,
        $shadow,
        $shadowOnHover,
        $hoverShadow,
        $liftOnHover,
        $liftAmount,
        $transitionMs,
        $padding,
        $hasHoverEffect,
    }) => {
        // Determine if border should fade in on hover (only when hover effects are active)
        const borderOnHover = $hasHoverEffect && $borderStyle !== 'none' && $borderWidth > 0;
        const borderTransitionMs = Math.min($transitionMs, 100); // rapid fade for border

        return {
            position: 'relative',
            display: 'inline-block', // Don't stretch to full container width by default
            ...($padding != null ? { padding: $padding } : {}),

            // Glass effect
            ...($glass
                ? {
                    backdropFilter: `blur(${$glassBlur}px)`,
                    WebkitBackdropFilter: `blur(${$glassBlur}px)`,
                    backgroundColor: `color-mix(in srgb, ${$glassTint} ${Math.round($glassOpacity * 100)}%, transparent)`,
                }
                : {}),

            // Border: show immediately if no hover effects, otherwise start transparent
            ...(borderOnHover
                ? {
                    border: `${$borderWidth}px ${$borderStyle} transparent`,
                }
                : $borderStyle !== 'none' && $borderWidth > 0
                    ? {
                        border: `${$borderWidth}px ${$borderStyle} ${$borderColor}`,
                    }
                    : {}),

            // Rounded corners
            borderRadius: typeof $rounded === 'number' ? `${$rounded}px` : $rounded,

            // Shadow
            boxShadow: $shadow,

            // Transitions (include border-color for fade-in)
            transition: `transform ${$transitionMs}ms ease, box-shadow ${$transitionMs}ms ease, border-color ${borderTransitionMs}ms ease`,

            // Hover state
            '&:hover': {
                ...($shadowOnHover ? { boxShadow: $hoverShadow } : {}),
                ...($liftOnHover ? { transform: `translateY(-${$liftAmount}px)` } : {}),
                ...(borderOnHover ? { borderColor: $borderColor } : {}),
            },
        };
    }
);

function resolveThemeColor(theme: Theme, token?: string): string | undefined {
    if (!token) return undefined;
    if (typeof token !== 'string') return String(token);

    const palette = theme.palette as unknown as Record<string, Record<string, string> | undefined>;
    const parts = token.split('.');

    if (parts.length === 2) {
        const group = palette[parts[0]];
        if (group && group[parts[1]]) {
            return group[parts[1]];
        }
    }

    // Check for direct palette group with 'main'
    const directGroup = palette[token];
    if (directGroup && typeof directGroup === 'object' && 'main' in directGroup) {
        return directGroup.main;
    }

    return token;
}

const AGGlassBox = React.forwardRef<HTMLDivElement, AGGlassBoxProps>(function AGGlassBox(props, ref) {
    const theme = useTheme();
    const {
        glass = false,
        glassBlur = 12,
        glassOpacity = 0.25,
        glassTint = '#ffffff',
        borderWidth = 1,
        borderColor = 'rgba(255,255,255,0.18)',
        borderStyle = 'solid',
        rounded = 12,
        shadow = '0 4px 16px rgba(0,0,0,0.08)',
        shadowOnHover = false,
        hoverShadow,
        liftOnHover = false,
        liftAmount = 4,
        transitionDuration = 200,
        padding,
        sx,
        ...rest
    } = props;

    const resolvedBorderColor = resolveThemeColor(theme, borderColor) ?? borderColor;
    const resolvedGlassTint = resolveThemeColor(theme, glassTint) ?? glassTint;

    // Default hover shadow is a more elevated version
    const defaultHoverShadow = '0 8px 32px rgba(0,0,0,0.16)';
    const resolvedHoverShadow = hoverShadow ?? defaultHoverShadow;

    // Determine if any hover effect is enabled
    const hasHoverEffect = shadowOnHover || liftOnHover;

    return (
        <StyledGlassBox
            ref={ref}
            $glass={glass}
            $glassBlur={glassBlur}
            $glassOpacity={glassOpacity}
            $glassTint={resolvedGlassTint}
            $borderWidth={borderWidth}
            $borderColor={resolvedBorderColor}
            $borderStyle={borderStyle}
            $rounded={rounded}
            $shadow={shadow}
            $shadowOnHover={shadowOnHover}
            $hoverShadow={resolvedHoverShadow}
            $liftOnHover={liftOnHover}
            $liftAmount={liftAmount}
            $transitionMs={transitionDuration}
            $padding={padding}
            $hasHoverEffect={hasHoverEffect}
            sx={sx}
            {...rest}
        />
    );
});

AGGlassBox.displayName = 'AGGlassBox';

export default AGGlassBox;
