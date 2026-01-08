import * as React from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export interface EmbellishmentConfig {
    content: React.ReactNode;
    /** Horizontal offset from corner in px (default 0) */
    offsetX?: number;
    /** Vertical offset from corner in px (default 0) */
    offsetY?: number;
    /** Position at corner diagonally (true) or centered on edge (false, default) */
    corner?: boolean;
}

export interface AGPictureFrameProps extends Omit<BoxProps, 'children'> {
    /** Image source URL */
    src: string;
    /** Alt text for accessibility */
    alt?: string;
    /** Frame width - number (px) or CSS value */
    width?: number | string;
    /** Frame height - number (px) or CSS value */
    height?: number | string;
    /** Border width in px (default 4) */
    borderWidth?: number;
    /** Border color - single color, theme token, or array for gradient */
    borderColor?: string | string[];
    /** Gradient angle for border (default 135) */
    borderGradientAngle?: number;
    /** Border radius in px (default 16) */
    rounded?: number;
    /** Shadow for the frame */
    shadow?: string;

    /** Embellishment for top-left corner - ReactNode or config object */
    topLeft?: React.ReactNode | EmbellishmentConfig;
    /** Embellishment for top-right corner - ReactNode or config object */
    topRight?: React.ReactNode | EmbellishmentConfig;
    /** Embellishment for bottom-left corner - ReactNode or config object */
    bottomLeft?: React.ReactNode | EmbellishmentConfig;
    /** Embellishment for bottom-right corner - ReactNode or config object */
    bottomRight?: React.ReactNode | EmbellishmentConfig;

    /** Image object-fit (default 'cover') */
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    /** Image aspect ratio (e.g., '16/9', '4/3', '1/1') - used when only width or height is set */
    aspectRatio?: string;
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

function buildGradientBorder(
    theme: Theme,
    color?: string | string[],
    angle: number = 135
): string {
    if (!color) return 'transparent';

    if (Array.isArray(color)) {
        const stops = color.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${angle}deg, ${stops})`;
    }

    if (color.includes('gradient(')) return color;

    if (color.includes(',')) {
        const parts = color.split(',').map((s) => s.trim());
        const stops = parts.map((c) => resolveThemeColor(theme, c) ?? c).join(', ');
        return `linear-gradient(${angle}deg, ${stops})`;
    }

    return resolveThemeColor(theme, color) ?? color;
}

interface FrameWrapperProps {
    $borderWidth: number;
    $borderBg: string;
    $rounded: number;
    $shadow?: string;
    $width?: number | string;
    $height?: number | string;
    $aspectRatio?: string;
}

const FrameWrapper = styled(Box, {
    shouldForwardProp: (prop) =>
        !['$borderWidth', '$borderBg', '$rounded', '$shadow', '$width', '$height', '$aspectRatio'].includes(String(prop)),
})<FrameWrapperProps>(({ $borderWidth, $borderBg, $rounded, $shadow, $width, $height, $aspectRatio }) => ({
    position: 'relative',
    display: 'inline-block',
    padding: $borderWidth,
    borderRadius: $rounded,
    background: $borderBg,
    boxShadow: $shadow,
    ...($width != null ? { width: typeof $width === 'number' ? `${$width}px` : $width } : {}),
    ...($height != null ? { height: typeof $height === 'number' ? `${$height}px` : $height } : {}),
    ...($aspectRatio && !$height ? { aspectRatio: $aspectRatio } : {}),
}));

const ImageContainer = styled(Box)<{ $rounded: number; $borderWidth: number }>(
    ({ $rounded, $borderWidth }) => ({
        display: 'block',
        width: '100%',
        height: '100%',
        borderRadius: Math.max(0, $rounded - $borderWidth),
        overflow: 'hidden',
    })
);

interface EmbellishmentWrapperProps {
    $position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    $offsetX: number;
    $offsetY: number;
    $corner: boolean; // true = diagonal corner overlap, false = edge-centered
}

const EmbellishmentWrapper = styled(Box, {
    shouldForwardProp: (prop) =>
        !['$position', '$offsetX', '$offsetY', '$corner'].includes(String(prop)),
})<EmbellishmentWrapperProps>(({ $position, $offsetX, $offsetY, $corner }) => {
    // Corner mode: positioned at corner with diagonal offset outward
    // Edge mode: positioned along edge, centered vertically on the border

    const baseStyles: React.CSSProperties = {
        position: 'absolute',
        zIndex: 2,
    };

    if ($corner) {
        // Corner positioning: element anchored at corner, offset moves it inward
        const cornerMap: Record<string, React.CSSProperties> = {
            topLeft: { top: -$offsetY, left: -$offsetX },
            topRight: { top: -$offsetY, right: -$offsetX },
            bottomLeft: { bottom: -$offsetY, left: -$offsetX },
            bottomRight: { bottom: -$offsetY, right: -$offsetX },
        };
        return { ...baseStyles, ...cornerMap[$position] };
    }

    // Edge positioning: element centered on the border line
    const edgeMap: Record<string, React.CSSProperties> = {
        topLeft: { top: 0, left: $offsetX, transform: 'translateY(-50%)' },
        topRight: { top: 0, right: $offsetX, transform: 'translateY(-50%)' },
        bottomLeft: { bottom: 0, left: $offsetX, transform: 'translateY(50%)' },
        bottomRight: { bottom: 0, right: $offsetX, transform: 'translateY(50%)' },
    };
    return { ...baseStyles, ...edgeMap[$position] };
});

// Helper to normalize embellishment prop
function parseEmbellishment(emb?: React.ReactNode | EmbellishmentConfig): {
    content: React.ReactNode;
    offsetX: number;
    offsetY: number;
    corner: boolean;
} | null {
    if (!emb) return null;
    if (typeof emb === 'object' && emb !== null && 'content' in emb) {
        const config = emb as EmbellishmentConfig;
        return {
            content: config.content,
            offsetX: config.offsetX ?? 0,
            offsetY: config.offsetY ?? 0,
            corner: config.corner ?? false,
        };
    }
    // Simple ReactNode - use defaults (edge-centered, no offset)
    return {
        content: emb as React.ReactNode,
        offsetX: 16,
        offsetY: 0,
        corner: false,
    };
}

const AGPictureFrame = React.forwardRef<HTMLDivElement, AGPictureFrameProps>(
    function AGPictureFrame(props, ref) {
        const theme = useTheme();
        const {
            src,
            alt = '',
            width,
            height,
            borderWidth = 4,
            borderColor = ['#4B8DBA', '#27A36F'],
            borderGradientAngle = 135,
            rounded = 16,
            shadow = '0 8px 32px rgba(0,0,0,0.15)',
            topLeft,
            topRight,
            bottomLeft,
            bottomRight,
            objectFit = 'cover',
            aspectRatio,
            sx,
            ...rest
        } = props;

        const borderBg = buildGradientBorder(theme, borderColor, borderGradientAngle);

        const topLeftConfig = parseEmbellishment(topLeft);
        const topRightConfig = parseEmbellishment(topRight);
        const bottomLeftConfig = parseEmbellishment(bottomLeft);
        const bottomRightConfig = parseEmbellishment(bottomRight);

        return (
            <FrameWrapper
                ref={ref}
                $borderWidth={borderWidth}
                $borderBg={borderBg}
                $rounded={rounded}
                $shadow={shadow}
                $width={width}
                $height={height}
                $aspectRatio={aspectRatio}
                sx={sx}
                {...rest}
            >
                <ImageContainer $rounded={rounded} $borderWidth={borderWidth}>
                    <Box
                        component="img"
                        src={src}
                        alt={alt}
                        sx={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit,
                        }}
                    />
                </ImageContainer>

                {topLeftConfig && (
                    <EmbellishmentWrapper
                        $position="topLeft"
                        $offsetX={topLeftConfig.offsetX}
                        $offsetY={topLeftConfig.offsetY}
                        $corner={topLeftConfig.corner}
                    >
                        {topLeftConfig.content}
                    </EmbellishmentWrapper>
                )}

                {topRightConfig && (
                    <EmbellishmentWrapper
                        $position="topRight"
                        $offsetX={topRightConfig.offsetX}
                        $offsetY={topRightConfig.offsetY}
                        $corner={topRightConfig.corner}
                    >
                        {topRightConfig.content}
                    </EmbellishmentWrapper>
                )}

                {bottomLeftConfig && (
                    <EmbellishmentWrapper
                        $position="bottomLeft"
                        $offsetX={bottomLeftConfig.offsetX}
                        $offsetY={bottomLeftConfig.offsetY}
                        $corner={bottomLeftConfig.corner}
                    >
                        {bottomLeftConfig.content}
                    </EmbellishmentWrapper>
                )}

                {bottomRightConfig && (
                    <EmbellishmentWrapper
                        $position="bottomRight"
                        $offsetX={bottomRightConfig.offsetX}
                        $offsetY={bottomRightConfig.offsetY}
                        $corner={bottomRightConfig.corner}
                    >
                        {bottomRightConfig.content}
                    </EmbellishmentWrapper>
                )}
            </FrameWrapper>
        );
    }
);

AGPictureFrame.displayName = 'AGPictureFrame';

export default AGPictureFrame;
