import { View, Text, Image } from "react-native";
import React, { FC } from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

const EmptyState: FC<TEmptyStateProps> = ({ title, subtitle }) => {
  return (
    <View className="items-center justify-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px] "
        resizeMode="contain"
      />
      <Text className="text-sm text-gray-100 font-pmedium">{subtitle}</Text>
      <Text className="mt-2 text-2xl text-center text-white font-psemibold">
        {title}
      </Text>
      <CustomButton
        title="Back to explore"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5 "
        textStyles={""}
      />
    </View>
  );
};

export default EmptyState;
