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
  creator: {
    username: string;
    avatar: string;
  };
};
