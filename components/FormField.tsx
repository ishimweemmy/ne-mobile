import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { icons } from "@/constants";

const FormField: FC<FormFieldProps> = ({
  title,
  control,
  name,
  inputStyles,
  containerStyles,
  secureTextEntry,
  placeholder,
  keyboardType,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={cn("space-y-2", containerStyles)}>
      <Text className="text-sm text-gray-100 font-pmedium">{title}</Text>
      <View className="items-start ">
        <Controller
          name={name}
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <View className="flex-row items-center w-full px-4 my-1 border-2 h-14 border-black-200 bg-black-100 rounded-2xl focus:border-secondary">
                <TextInput
                  className={cn(
                    "w-full flex-1 text-white font-psemibold text-sm",
                    inputStyles
                  )}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  secureTextEntry={secureTextEntry && !showPassword}
                  placeholder={placeholder}
                  placeholderTextColor={"#7b7b7b"}
                />

                {title === "Password" && (
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      source={!showPassword ? icons.eye : icons.eyeHide}
                      resizeMode="contain"
                      className="w-6 h-6"
                    />
                  </TouchableOpacity>
                )}
              </View>
              {error && (
                <Text className="ml-1 text-xs text-red-500">{error.message}</Text>
              )}
            </>
          )}
        />
      </View>
    </View>
  );
};

export default FormField;
