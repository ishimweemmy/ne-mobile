type TabIconProps = {
  icon: any;
  focused: boolean;
  color: string;
  name: string;
};

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyles: string;
  isLoading?: boolean;
  textStyles: stirng;
};

type FormFieldProps = {
  title: string;
  control: any;
  name: string;
  inputStyles?: string;
  containerStyles?: string;
  secureTextEntry: boolean;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
};

type ChildrenProps = {
  children: ReactNode;
};

type TPost = Models.Document;

type TEmptyStateProps = {
  title: string;
  subtitle: string;
};

type TVideo = {
  title: string;
  thumbnail: string;
  video: string;
  avatar: string;
  creator: string;
  id?: string;
  showMore?: boolean
};

type TInfoBoxProps = {
  containerStyles?: string;
  titleStyles?: string;
  title: any;
  subtitle: string
}

interface TDateFormatOptions {
  year: 'numeric';
  month: 'long';
  day: 'numeric';
  hour: '2-digit';
  minute: '2-digit';
  hour12: boolean;
}

declare module "react-native-options-menu"