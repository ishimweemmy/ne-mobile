import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'

const CustomButton: FC<CustomButtonProps> = ({ containerStyles, title, handlePress, textStyles, isLoading }) => {
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className={`bg-secondary rounded-lg min-h-[47px] justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""}`} disabled={isLoading}>
      <Text className={`text-sm text-primary font-psemibold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton