import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

const SearchInput: FC<
  Pick<
    FormFieldProps,
    "control" | "name" | "placeholder" | "containerStyles" | "inputStyles"
  >
> = ({ control, name, inputStyles, containerStyles, placeholder }) => {
  const pathname = usePathname();

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
            )}>
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

            <TouchableOpacity
              onPress={() => {
                if (value === "")
                  return Alert.alert(
                    "Missing Query",
                    "Please input something to search results across database"
                  );

                if (pathname.startsWith("/search")) router.setParams({ value });
                else router.push(`/search/${value}`);
              }}>
              <Image
                source={icons.search}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    />
  );
};

export default SearchInput;
