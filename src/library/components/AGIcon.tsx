import * as React from 'react';
import { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

type HoverRotate = 'left' | 'right' | false;
type SizePreset = 'sm' | 'md' | 'lg';
type Shape = 'rounded' | 'circular' | 'square';

export interface AGIconProps extends Omit<BoxProps, 'color'> {
    children: React.ReactNode; // Usually a MUI SvgIcon (e.g., <Bolt />)
    size?: number | SizePreset; // Overall box size in px or preset
    shape?: Shape; // Corner style

    // Background appearance
    variant?: 'solid' | 'gradient';
    color?: string; // Solid background color or theme token (e.g., "primary.main")
    gradient?: string | string[]; // One or more colors for gradient
    gradientAngle?: number; // Angle in degrees for linear-gradient

    // Hover animations
    hoverRotate?: HoverRotate; // Rotate +/-45° on hover
    expandOnHover?: boolean; // Scale up on hover
    expandScale?: number; // Scale factor for expandOnHover

    // Icon sizing
    iconScale?: number; // Icon size as fraction of box (0-1)

    sx?: SxProps<Theme>;
}

const sizeFromPreset = (preset: SizePreset): number => {
    switch (preset) {
        case 'sm':
            return 32;
        case 'lg':
            return 56;
        case 'md':
        default:
            return 40;
    }
};

const resolveThemeColor = (theme: Theme, input?: string): string | undefined => {
    if (!input) return undefined;
    // Allow tokens like "primary.main" or "secondary.light"
    const parts = input.split('.');
    const palette = theme.palette as unknown as Record<string, Record<string, string> | undefined>;
    const group = palette[parts[0]];
    if (parts.length === 2 && group && group[parts[1]]) {
        return group[parts[1]];
    }
    return input;
};

const buildGradient = (theme: Theme, gradient?: string | string[], angle: number = 135): string | undefined => {
    if (!gradient) return undefined;
    const colors = Array.isArray(gradient) ? gradient : gradient.split(',').map(s => s.trim());
    const resolved = colors.map(c => resolveThemeColor(theme, c) || c);
    const stops = resolved.join(', ');
    return `linear-gradient(${angle}deg, ${stops})`;
};

interface StyledRootProps {
    $boxSize: number;
    $shape: Shape;
    $bg: string | undefined;
    $hoverRotate: HoverRotate;
    $expandOnHover: boolean;
    $expandScale: number;
    $iconScale: number;
}

const Root = styled(Box, {
    shouldForwardProp: (prop) => !(
        prop === '$boxSize' ||
        prop === '$shape' ||
        prop === '$bg' ||
        prop === '$hoverRotate' ||
        prop === '$expandOnHover' ||
        prop === '$expandScale' ||
        prop === '$iconScale'
    )
})<StyledRootProps>(({ theme, $boxSize, $shape, $bg, $hoverRotate, $expandOnHover, $expandScale, $iconScale }) => ({
    width: $boxSize,
    height: $boxSize,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: $bg,
    color: '#fff', // inverted: icon is white
    // shape
    borderRadius:
        $shape === 'circular' ? '50%'
            : $shape === 'square' ? 0
                : (theme.shape.borderRadius as number) * 1.5,
    // subtle elevation
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
    transition: 'transform 160ms ease, box-shadow 160ms ease',
    transform: 'translateZ(0)',
    // Icon sizing for MUI SvgIcon
    '& .MuiSvgIcon-root': {
        fontSize: Math.round($boxSize * $iconScale),
    },
    // Hover interactions
    '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        transform: [
            $expandOnHover ? `scale(${$expandScale})` : null,
            $hoverRotate === 'left' ? 'rotate(-30deg)' : null,
            $hoverRotate === 'right' ? 'rotate(30deg)' : null,
        ].filter(Boolean).join(' ') || 'none',
    },
}));

const AGIcon = forwardRef<HTMLDivElement, AGIconProps>(function AGIcon(props, ref) {
    const {
        children,
        size = 'md',
        shape = 'rounded',
        variant = 'solid',
        color = 'primary.main',
        gradient,
        gradientAngle = 135,
        hoverRotate = false,
        expandOnHover = false,
        expandScale = 1.06,
        iconScale = 0.6,
        sx,
        ...rest
    } = props;

    const boxSize = typeof size === 'number' ? size : sizeFromPreset(size);

    const theme = useTheme();
    const bg = variant === 'gradient'
        ? (buildGradient(
            theme,
            gradient || [
                resolveThemeColor(theme, 'primary.main') || '#1976d2',
                resolveThemeColor(theme, 'secondary.main') || '#9c27b0'
            ],
            gradientAngle
        ) as string)
        : (resolveThemeColor(theme, color) || color);

    return (
        <Root
            ref={ref}
            $boxSize={boxSize}
            $shape={shape}
            $bg={bg}
            $hoverRotate={hoverRotate}
            $expandOnHover={expandOnHover}
            $expandScale={expandScale}
            $iconScale={iconScale}
            sx={sx}
            {...rest}
        >
            {children}
        </Root>
    );
});

export default AGIcon;

