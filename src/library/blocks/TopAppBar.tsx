interface TopAppBarProps {
    logo?: {
        imageSrc: string;
        altText: string;
        supportingText?: string;
        onClick?: () => void;
    }
    actions: {
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
    }[];
}

const TopAppBar: React.FC<TopAppBarProps> = () => {
    return null;
}

export default TopAppBar;