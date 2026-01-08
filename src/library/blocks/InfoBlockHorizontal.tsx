import { Box } from "@mui/material";
import AGGlassBox from "../components/AGGlassBox";
import AGIcon from "../components/AGIcon";
import AGRichText from "../components/AGRichText";

interface InfoBlockHorizontalProps {
    title: string;
    description: string;
    icon: React.JSX.Element;
    borderColor?: string;
    shadowOnHover?: boolean;
    liftOnHover?: boolean;
    iconAnimation?: 'rotate-left' | 'rotate-right' | 'expand' | 'both-left' | 'both-right' | 'none';
    gap?: number;
    /** Spacing below the block in px (default 16) */
    spacing?: number;
}

const InfoBlockHorizontal: React.FC<InfoBlockHorizontalProps> = ({
    title,
    description,
    icon,
    borderColor,
    shadowOnHover = false,
    liftOnHover = false,
    iconAnimation = 'expand',
    gap = 16,
    spacing = 16,
}) => {
    // Determine icon animation props based on iconAnimation choice
    const getIconAnimationSx = () => {
        const base = {
            transition: 'transform 160ms ease, box-shadow 160ms ease',
        };

        switch (iconAnimation) {
            case 'rotate-left':
                return { ...base, '.info-block-horizontal:hover &': { transform: 'rotate(-45deg)' } };
            case 'rotate-right':
                return { ...base, '.info-block-horizontal:hover &': { transform: 'rotate(45deg)' } };
            case 'expand':
                return { ...base, '.info-block-horizontal:hover &': { transform: 'scale(1.1)' } };
            case 'both-left':
                return { ...base, '.info-block-horizontal:hover &': { transform: 'scale(1.1) rotate(-45deg)' } };
            case 'both-right':
                return { ...base, '.info-block-horizontal:hover &': { transform: 'scale(1.1) rotate(45deg)' } };
            case 'none':
            default:
                return base;
        }
    };

    return (
        <AGGlassBox
            className="info-block-horizontal"
            glass={true}
            glassBlur={50}
            glassOpacity={0.5}
            padding={20}
            rounded={12}
            shadow="0 4px 12px rgba(0,0,0,0.1)"
            liftOnHover={liftOnHover}
            liftAmount={4}
            shadowOnHover={shadowOnHover}
            borderColor={borderColor}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: `${gap}px`,
                cursor: 'pointer',
                marginBottom: `${spacing}px`,
            }}
        >
            <Box sx={{ flexShrink: 0 }}>
                <AGIcon
                    color={borderColor}
                    size="lg"
                    sx={getIconAnimationSx()}
                >
                    {icon}
                </AGIcon>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <AGRichText variant="h6">
                    {title}
                </AGRichText>
                <AGRichText variant="body2" color="text.secondary">
                    {description}
                </AGRichText>
            </Box>
        </AGGlassBox>
    );
};

export default InfoBlockHorizontal;