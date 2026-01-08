import * as React from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import type { CSSProperties } from 'react';

export interface AGBoxProps extends BoxProps {
    padding?: number;
    backgroundMode?: 'solid' | 'gradient' | 'image';
    bgColor?: string; // palette token or color
    bgGradient?: string | string[]; // tokens or colors
    bgGradientDirection?: number; // degrees
    bgImage?: string; // url or path
    bgImageSize?: CSSProperties['backgroundSize'];
    bgImagePosition?: CSSProperties['backgroundPosition'];
    bgImageRepeat?: CSSProperties['backgroundRepeat'];
    gradientAnimate?: boolean;
    gradientAnimationDuration?: number; // ms
    pulse?: boolean;
    pulseIntensity?: number; // 0..1
    pulseDuration?: number; // ms
    rounded?: CSSProperties['borderRadius'];
    shadow?: CSSProperties['boxShadow'];

    // Background pulse overlay (radial) options
    backgroundPulse?: boolean;
    backgroundPulseOrigin?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | 'center';
    backgroundPulseColor?: string; // palette token or color
    backgroundPulseIntensity?: number; // target overlay opacity (0..1)
    backgroundPulseDuration?: number; // ms
    backgroundPulseMode?: 'increase' | 'decrease'; // pulse more or less subtle
}

type StyledExtras = {
    agPadding?: number;
    agSolid?: string;
    agGradient?: string;
    agImage?: string;
    agImageSize?: CSSProperties['backgroundSize'];
    agImagePosition?: CSSProperties['backgroundPosition'];
    agImageRepeat?: CSSProperties['backgroundRepeat'];
    agGradientAnim?: boolean;
    agGradientAnimMs?: number;
    agPulse?: boolean;
    agPulseIntensity?: number;
    agPulseMs?: number;
    agRounded?: CSSProperties['borderRadius'];
    agShadow?: CSSProperties['boxShadow'];

    // background pulse overlay extras
    agBgPulse?: boolean;
    agBgPulsePos?: string; // e.g., '0% 0%'
    agBgPulseColor?: string; // resolved color
    agBgPulseOpacity?: number; // target opacity
    agBgPulseMs?: number; // duration
};

const gradientShift = keyframes`
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
`;

const pulseKeyframes = keyframes`
	0% { filter: brightness(1); }
	50% { filter: brightness(var(--ag-pulse-brightness)); }
	100% { filter: brightness(1); }
`;

const StyledBox = styled(Box, {
    name: 'AGBox',
    slot: 'Root',
    shouldForwardProp: (prop) =>
        ![
            'agPadding',
            'agSolid',
            'agGradient',
            'agImage',
            'agImageSize',
            'agImagePosition',
            'agImageRepeat',
            'agGradientAnim',
            'agGradientAnimMs',
            'agPulse',
            'agPulseIntensity',
            'agPulseMs',
            'agRounded',
            'agShadow',
            'agBgPulse',
            'agBgPulsePos',
            'agBgPulseColor',
            'agBgPulseOpacity',
            'agBgPulseMs',
        ].includes(String(prop)),
})<StyledExtras>(({ agPadding, agSolid, agGradient, agImage, agImageSize, agImagePosition, agImageRepeat, agGradientAnim, agGradientAnimMs, agPulse, agPulseIntensity, agPulseMs, agRounded, agShadow, agBgPulse, agBgPulsePos, agBgPulseColor, agBgPulseOpacity, agBgPulseMs }) => ({
    position: 'relative',
    ...(agPadding != null ? { padding: agPadding } : {}),
    ...(agRounded ? { borderRadius: agRounded } : {}),
    ...(agShadow ? { boxShadow: agShadow } : {}),

    // backgrounds
    ...(agSolid ? { backgroundColor: agSolid } : {}),
    ...(agGradient
        ? {
            backgroundImage: agGradient,
            backgroundSize: agGradientAnim ? '200% 200%' : undefined,
        }
        : {}),
    ...(agImage
        ? {
            backgroundImage: agImage.startsWith('url(') ? agImage : `url(${agImage})`,
            backgroundSize: agImageSize ?? 'cover',
            backgroundPosition: agImagePosition ?? 'center',
            backgroundRepeat: agImageRepeat ?? 'no-repeat',
        }
        : {}),

    // animations
    ...(agGradientAnim && agGradient
        ? {
            animation: `${gradientShift} ${agGradientAnimMs ?? 6000}ms ease-in-out infinite`,
        }
        : {}),
    ...(agPulse
        ? {
            '--ag-pulse-brightness': String(1 + (agPulseIntensity ?? 0.06)),
            animation: `${pulseKeyframes} ${agPulseMs ?? 3000}ms ease-in-out infinite${agGradientAnim && agGradient ? `, ${gradientShift} ${agGradientAnimMs ?? 6000}ms ease-in-out infinite` : ''}`,
        }
        : {}),

    // Background radial pulse overlay
    ...(agBgPulse
        ? {
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(circle at ${agBgPulsePos || '50% 50%'}, ${agBgPulseColor || 'rgba(0,0,0,0.12)'} 0%, transparent 60%)`,
                opacity: 0,
                animation: `ag-bg-pulse-opacity ${agBgPulseMs ?? 3000}ms ease-in-out infinite`,
            },
            '@keyframes ag-bg-pulse-opacity': {
                '0%': { opacity: (agBgPulseOpacity ?? 0.0) * 0.4 },
                '50%': { opacity: agBgPulseOpacity ?? 0.12 },
                '100%': { opacity: (agBgPulseOpacity ?? 0.0) * 0.4 },
            },
        }
        : {}),
}));

function resolveThemeColor(theme: Theme, token?: string): string | undefined {
    if (!token) return undefined;
    if (typeof token !== 'string') return String(token);

    const paletteFromVars = (theme as unknown as { vars?: { palette?: unknown } }).vars?.palette;
    const palette: unknown = paletteFromVars ?? (theme.palette as unknown);
    if (!palette) return token;

    if (typeof palette === 'object' && palette !== null) {
        const palRec = palette as Record<string, unknown>;

        const direct = palRec[token];
        if (direct && typeof direct === 'object') {
            const mainVal = (direct as Record<string, unknown>)['main'];
            if (typeof mainVal === 'string') return mainVal;
        }

        if (token.includes('.')) {
            const parts = token.split('.');
            let cur: unknown = palRec;
            for (const p of parts) {
                if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
                    cur = (cur as Record<string, unknown>)[p];
                } else {
                    cur = undefined;
                    break;
                }
            }
            if (typeof cur === 'string') return cur;
        }
    }

    return token;
}

function buildGradient(theme: Theme, gradient?: string | string[], deg: number = 90): string | undefined {
    if (!gradient) return undefined;
    if (Array.isArray(gradient)) {
        const stops = gradient.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${deg}deg, ${stops})`;
    }

    if (gradient.includes('gradient(')) return gradient;

    if (gradient.includes(',')) {
        const parts = gradient.split(',').map((s) => s.trim());
        const stops = parts.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${deg}deg, ${stops})`;
    }

    const color = resolveThemeColor(theme, gradient) ?? gradient;
    return `linear-gradient(${deg}deg, ${color}, ${color})`;
}

const AGBox = React.forwardRef<HTMLDivElement, AGBoxProps>(function AGBox(props, ref) {
    const theme = useTheme();
    const {
        padding,
        backgroundMode = 'solid',
        bgColor,
        bgGradient,
        bgGradientDirection = 90,
        bgImage,
        bgImageSize,
        bgImagePosition,
        bgImageRepeat,
        gradientAnimate = false,
        gradientAnimationDuration = 6000,
        pulse = false,
        pulseIntensity = 0.06,
        pulseDuration = 3000,
        rounded,
        shadow,
        backgroundPulse = false,
        backgroundPulseOrigin = 'center',
        backgroundPulseColor,
        backgroundPulseIntensity = 0.12,
        backgroundPulseDuration = 3000,
        backgroundPulseMode = 'increase',
        sx,
        ...rest
    } = props;

    const solid = backgroundMode === 'solid' ? resolveThemeColor(theme, bgColor) ?? bgColor : undefined;
    const gradient = backgroundMode === 'gradient' ? buildGradient(theme, bgGradient, bgGradientDirection) : undefined;
    const image = backgroundMode === 'image' ? bgImage : undefined;

    // Background pulse overlay setup
    const pulsePosMap: Record<string, string> = {
        topleft: '0% 0%',
        topright: '100% 0%',
        bottomleft: '0% 100%',
        bottomright: '100% 100%',
        center: '50% 50%',
    };
    const bgPulsePos = pulsePosMap[backgroundPulseOrigin] ?? '50% 50%';
    const bgPulseColor = resolveThemeColor(theme, backgroundPulseColor) ?? backgroundPulseColor ?? (theme.vars ? theme.vars.palette.primary.main : theme.palette.primary.main);
    const bgPulseOpacity = Math.max(0, Math.min(1, backgroundPulseIntensity));
    const bgPulseMs = backgroundPulseDuration;
    const bgPulseEffectiveOpacity = backgroundPulseMode === 'decrease' ? bgPulseOpacity * 0.6 : bgPulseOpacity;

    return (
        <StyledBox
            ref={ref}
            agPadding={padding}
            agSolid={solid}
            agGradient={gradient}
            agImage={image}
            agImageSize={bgImageSize}
            agImagePosition={bgImagePosition}
            agImageRepeat={bgImageRepeat}
            agGradientAnim={gradientAnimate}
            agGradientAnimMs={gradientAnimationDuration}
            agPulse={pulse}
            agPulseIntensity={pulseIntensity}
            agPulseMs={pulseDuration}
            agRounded={rounded}
            agShadow={shadow}
            agBgPulse={backgroundPulse}
            agBgPulsePos={bgPulsePos}
            agBgPulseColor={bgPulseColor}
            agBgPulseOpacity={bgPulseEffectiveOpacity}
            agBgPulseMs={bgPulseMs}
            sx={sx}
            {...rest}
        />
    );
});

AGBox.displayName = 'AGBox';

export default AGBox;

