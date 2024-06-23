import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { useForm } from "react-hook-form";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "@/lib/form-schemas";
import { z } from "zod";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignUp = () => {
  const { control, handleSubmit } = useForm<z.infer<typeof SignUpFormSchema>>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(SignUpFormSchema),
    mode: "all",
  });

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { setIsLoggedIn, setUser } = useGlobalContext();
  const onSubmit = async ({
    username,
    email,
    password,
  }: z.infer<typeof SignUpFormSchema>) => {
    try {
      setIsFormSubmitting(true);
      const result = await createUser(username, email, password);
      setUser(result);
      setIsLoggedIn(true);
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
            Sign up to Aora
          </Text>
          <FormField
            title="Username"
            name="username"
            control={control}
            placeholder="Enter your username"
            secureTextEntry={false}
            containerStyles="mt-7"
          />
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
            title="Sign Up"
            handlePress={handleSubmit(onSubmit)}
            containerStyles="mt-7"
            textStyles=""
            isLoading={isFormSubmitting}
          />
          <View className="flex flex-row justify-center gap-2 pt-5">
            <Text className="text-sm text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-sm font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
