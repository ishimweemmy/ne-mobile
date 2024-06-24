import React, { useState } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createVideoPost } from "@/lib/appwrite";
import FormField from "@/components/FormField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useForm } from "react-hook-form";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const { control, reset, setValue, watch, handleSubmit } = useForm<{
    title: string;
    video: DocumentPicker.DocumentPickerAsset | null;
    thumbnail: DocumentPicker.DocumentPickerAsset | null;
    body: string;
  }>({
    defaultValues: {
      title: "",
      body: "",
      thumbnail: null,
      video: null,
    },
  });

  const watchThumbnail = watch("thumbnail");
  const watchVideo = watch("video");

  const openPicker = async (selectType: string) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setValue("thumbnail", result.assets[0]);
      }

      if (selectType === "video") {
        setValue("video", result.assets[0]);
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const onSubmit = async (data: {
    title: string;
    video: DocumentPicker.DocumentPickerAsset | null;
    thumbnail: DocumentPicker.DocumentPickerAsset | null;
    body: string;
  }) => {
    setUploading(true);
    try {
      const bodyResponse = await createVideoPost({ ...data, userId: user!.$id });

      if(bodyResponse.response.status !== 201) {
        Alert.alert("Error", "Post could not be uploaded");
      }
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      reset();
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Create a new post
        </Text>

        <FormField
          title="Post Title"
          placeholder="Give your post a catchy title..."
          containerStyles="mt-10"
          name="title"
          secureTextEntry={false}
          control={control}
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {watchVideo ? (
              <Video
                source={{ uri: watchVideo.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {watchThumbnail ? (
              <Image
                source={{ uri: watchThumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="Post body"
          name="prompt"
          secureTextEntry={false}
          placeholder="The AI prompt of your video...."
          control={control}
          containerStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={handleSubmit(onSubmit)}
          containerStyles="mt-7"
          isLoading={uploading}
          textStyles=""
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
