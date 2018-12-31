export default interface ButtonProps {
    text: string;
    subtitle?: string;
    onPress: Function;
    disabled?: boolean;
    hidden?: boolean;
    accessibilityId?: string;
    style?: any;
    extraTextStyle?: any;
    noPadding?: boolean;
}
