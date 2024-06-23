import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { useForm } from "react-hook-form";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from "@/lib/form-schemas";
import { z } from "zod";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
  const { control, handleSubmit } = useForm<z.infer<typeof SignInFormSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInFormSchema),
  });

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { setIsLoggedIn, setUser } = useGlobalContext();
  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof SignInFormSchema>) => {
    setIsFormSubmitting(true);
    try {
      await signIn(email, password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      Alert.alert("Success", "User signed in successfully!!");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="justify-center w-full min-h-[75vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px] mt-10"
          />
          <Text className="mt-10 text-xl text-white font-psemibold">
            Log in to Aora
          </Text>
          <FormField
            title="Email"
            name="email"
            control={control}
            placeholder="Enter your email"
            secureTextEntry={false}
            keyboardType="email-address"
            containerStyles="mt-7"
          />
          <FormField
            title="Password"
            name="password"
            control={control}
            placeholder="Enter your password"
            secureTextEntry={true}
            containerStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={handleSubmit(onSubmit)}
            containerStyles="mt-7"
            textStyles=""
            isLoading={isFormSubmitting}
          />
          <View className="flex flex-row justify-center gap-2 pt-5">
            <Text className="text-sm text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-sm font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
