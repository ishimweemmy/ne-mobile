import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { icons } from "@/constants";

const SearchInput: FC<
  Pick<
    FormFieldProps,
    "control" | "name" | "placeholder" | "containerStyles" | "inputStyles"
  >
> = ({ control, name, inputStyles, containerStyles, placeholder }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <View
            className={cn(
              "flex-row items-center w-full px-4 my-1 border-2 h-14 border-black-200 bg-black-100 rounded-2xl focus:border-secondary",
              containerStyles
            )}
          >
            <TextInput
              className={cn(
                "w-full flex-1 text-white font-psemibold text-sm",
                inputStyles
              )}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={"#7b7b7b"}
            />

            <TouchableOpacity>
              <Image
                source={icons.search}
                resizeMode="contain"
                className="w-5 h-5"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    />
  );
};

export default SearchInput;
