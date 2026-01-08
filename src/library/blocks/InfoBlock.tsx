import AGGlassBox from "../components/AGGlassBox";
import AGIcon from "../components/AGIcon";
import AGRichText from "../components/AGRichText";

interface InfoBlockProps {
    title: string;
    description: string;
    icon: React.JSX.Element;
    borderColor?: string;
    shadowOnHover?: boolean;
    expandOnHover?: boolean;
    maxWidth?: number;
}

const InfoBlock: React.FC<InfoBlockProps> = ({
    title,
    description,
    icon,
    borderColor,
    shadowOnHover = false,
    expandOnHover = false,
    maxWidth,
}) => (
    <AGGlassBox
        glass={true}
        glassBlur={50}
        glassOpacity={50}
        padding={20}
        rounded={12}
        shadow="0 4px 12px rgba(0,0,0,0.1)"
        liftOnHover={expandOnHover}
        liftAmount={2}
        shadowOnHover={shadowOnHover}
        borderColor={borderColor}
        alignContent={"left"}
        maxWidth={maxWidth}
    >
        <AGIcon
            color={borderColor}
            expandOnHover={expandOnHover}
        >
            {icon}
        </AGIcon>
        <AGRichText variant="h5">
            {title}
        </AGRichText>
        <AGRichText variant="body1" color="textSecondary">
            {description}
        </AGRichText>
    </AGGlassBox>
);

export default InfoBlock;