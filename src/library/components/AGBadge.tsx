import * as React from 'react';
import Badge, { badgeClasses } from '@mui/material/Badge';
import type { BadgeProps } from '@mui/material/Badge';
import { styled, useTheme } from '@mui/material/styles';

type AGBadgeSize = 'sm' | 'md' | 'lg';

export interface AGBadgeProps extends BadgeProps {
    size?: AGBadgeSize;
    ring?: boolean;
}

type StyledExtras = {
    agSize: AGBadgeSize;
    ring?: boolean;
    ringColor?: string;
};

const StyledBadge = styled(Badge, {
    name: 'AGBadge',
    slot: 'Root',
    shouldForwardProp: (prop) => prop !== 'agSize' && prop !== 'ring' && prop !== 'ringColor',
})<StyledExtras>(({ theme, agSize, ring, ringColor }) => {
    const standardHeights: Record<AGBadgeSize, number> = {
        sm: 16,
        md: 18,
        lg: 22,
    };
    const fontSizes: Record<AGBadgeSize, string> = {
        sm: theme.typography.pxToRem(10),
        md: theme.typography.pxToRem(11),
        lg: theme.typography.pxToRem(12),
    };
    const paddings: Record<AGBadgeSize, string> = {
        sm: '0 5px',
        md: '0 6px',
        lg: '0 7px',
    };
    const dotSizes: Record<AGBadgeSize, number> = {
        sm: 6,
        md: 8,
        lg: 10,
    };

    const borderDecl = ring ? `2px solid ${ringColor || (theme.vars ? theme.vars.palette.background.default : theme.palette.background.paper)}` : undefined;

    return {
        [`.${badgeClasses.badge}`]: {
            fontWeight: 600,
            minWidth: standardHeights[agSize],
            height: standardHeights[agSize],
            padding: paddings[agSize],
            fontSize: fontSizes[agSize],
            lineHeight: `${standardHeights[agSize]}px`,
            border: borderDecl,
        },
        [`.${badgeClasses.dot}`]: {
            minWidth: 'auto',
            padding: 0,
            width: dotSizes[agSize],
            height: dotSizes[agSize],
            borderRadius: dotSizes[agSize] / 2,
            border: borderDecl,
        },
    };
});

const AGBadge = React.forwardRef<HTMLSpanElement, AGBadgeProps>(function AGBadge(props, ref) {
    const theme = useTheme();
    const { size = 'md', ring = false, sx, ...rest } = props;

    const ringColor = theme.vars ? theme.vars.palette.background.default : theme.palette.background.paper;

    return (
        <StyledBadge
            ref={ref}
            agSize={size}
            ring={ring}
            ringColor={ringColor}
            sx={sx}
            {...rest}
        />
    );
});

AGBadge.displayName = 'AGBadge';

export default AGBadge;

