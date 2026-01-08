import * as React from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export interface AGDividerProps extends Omit<BoxProps, 'color'> {
    /** Top color - palette token or CSS color/gradient */
    topColor?: string | string[];
    /** Bottom color - palette token or CSS color/gradient */
    bottomColor?: string | string[];
    /** Gradient angle for multi-color arrays (default 90 = left to right) */
    gradientAngle?: number;
    /** Height of the wave in px (default 60) */
    height?: number;
    /** Wave style variant */
    variant?: 'wave' | 'wave-smooth' | 'tilt' | 'curve' | 'zigzag';
    /** Flip the divider vertically */
    flip?: boolean;
    /** Flip the divider horizontally */
    flipX?: boolean;
}

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

    const directGroup = palette[token];
    if (directGroup && typeof directGroup === 'object' && 'main' in directGroup) {
        return directGroup.main;
    }

    return token;
}

function buildGradient(theme: Theme, color?: string | string[], angle: number = 90): string {
    if (!color) return 'transparent';

    if (Array.isArray(color)) {
        const stops = color.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${angle}deg, ${stops})`;
    }

    // Check if it's already a gradient
    if (color.includes('gradient(')) return color;

    // Check for comma-separated colors
    if (color.includes(',')) {
        const parts = color.split(',').map((s) => s.trim());
        const stops = parts.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${angle}deg, ${stops})`;
    }

    // Single color
    return resolveThemeColor(theme, color) ?? color;
}

// SVG wave paths for different variants
const wavePaths: Record<string, string> = {
    'wave': 'M0,0 C320,100 420,0 640,50 C860,100 960,0 1280,50 L1280,0 L0,0 Z',
    'wave-smooth': 'M0,0 C200,80 400,0 640,40 C880,80 1080,0 1280,40 L1280,0 L0,0 Z',
    'tilt': 'M0,0 L1280,60 L1280,0 L0,0 Z',
    'curve': 'M0,0 Q640,120 1280,0 L1280,0 L0,0 Z',
    'zigzag': 'M0,0 L160,50 L320,0 L480,50 L640,0 L800,50 L960,0 L1120,50 L1280,0 L1280,0 L0,0 Z',
};

const AGDivider = React.forwardRef<HTMLDivElement, AGDividerProps>(function AGDivider(props, ref) {
    const theme = useTheme();
    const {
        topColor = 'transparent',
        bottomColor = 'primary.main',
        gradientAngle = 90,
        height = 60,
        variant = 'wave-smooth',
        flip = false,
        flipX = false,
        sx,
        ...rest
    } = props;

    const topFill = buildGradient(theme, topColor, gradientAngle);
    const bottomFill = buildGradient(theme, bottomColor, gradientAngle);

    const wavePath = wavePaths[variant] || wavePaths['wave-smooth'];

    // Generate unique gradient IDs for this instance
    const gradientId = React.useId().replace(/:/g, '');

    const isTopGradient = topFill.includes('gradient');
    const isBottomGradient = bottomFill.includes('gradient');

    // Parse gradient stops for SVG linearGradient
    const parseGradientStops = (gradientStr: string): { color: string; offset: string }[] => {
        // Extract colors from linear-gradient(angle, color1, color2, ...)
        const match = gradientStr.match(/linear-gradient\([^,]+,\s*(.+)\)/);
        if (!match) return [{ color: gradientStr, offset: '0%' }];

        const colorsStr = match[1];
        const colors = colorsStr.split(',').map((s) => s.trim());
        return colors.map((color, i) => ({
            color,
            offset: `${(i / (colors.length - 1)) * 100}%`,
        }));
    };

    const topStops = parseGradientStops(topFill);
    const bottomStops = parseGradientStops(bottomFill);

    // Transform for flipping
    const transforms: string[] = [];
    if (flip) transforms.push('scaleY(-1)');
    if (flipX) transforms.push('scaleX(-1)');
    const transform = transforms.length > 0 ? transforms.join(' ') : undefined;

    return (
        <Box
            ref={ref}
            sx={{
                position: 'relative',
                width: '100%',
                height: height,
                lineHeight: 0,
                fontSize: 0,
                overflow: 'visible',
                display: 'block',
                marginTop: '-2px', // Overlap to prevent subpixel gaps
                marginBottom: '-2px',
                transform,
                ...sx,
            }}
            {...rest}
        >
            <svg
                viewBox="0 0 1280 62"
                preserveAspectRatio="none"
                style={{
                    position: 'absolute',
                    top: '-2px',
                    left: 0,
                    width: '100%',
                    height: 'calc(100% + 4px)', // Generous bleed to cover gaps
                    display: 'block',
                }}
            >
                <defs>
                    {/* Top gradient definition */}
                    {isTopGradient && (
                        <linearGradient id={`${gradientId}-top`} x1="0%" y1="0%" x2="100%" y2="0%">
                            {topStops.map((stop, i) => (
                                <stop key={i} offset={stop.offset} stopColor={stop.color} />
                            ))}
                        </linearGradient>
                    )}
                    {/* Bottom gradient definition */}
                    {isBottomGradient && (
                        <linearGradient id={`${gradientId}-bottom`} x1="0%" y1="0%" x2="100%" y2="0%">
                            {bottomStops.map((stop, i) => (
                                <stop key={i} offset={stop.offset} stopColor={stop.color} />
                            ))}
                        </linearGradient>
                    )}
                </defs>

                {/* Background rectangle (top color) - extended beyond bounds */}
                <rect
                    x="-1"
                    y="-2"
                    width="1282"
                    height="32"
                    fill={isTopGradient ? `url(#${gradientId}-top)` : topFill}
                />

                {/* Wave shape (bottom color) - with extended base */}
                <path
                    d={wavePath}
                    fill={isBottomGradient ? `url(#${gradientId}-bottom)` : bottomFill}
                    transform="translate(0, 62) scale(1, -1)"
                />
                {/* Bottom bleed rectangle to ensure full coverage */}
                <rect
                    x="-1"
                    y="58"
                    width="1282"
                    height="6"
                    fill={isBottomGradient ? `url(#${gradientId}-bottom)` : bottomFill}
                />
            </svg>
        </Box>
    );
});

AGDivider.displayName = 'AGDivider';

export default AGDivider;
