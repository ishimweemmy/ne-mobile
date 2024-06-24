import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { createComment, deletePost, getPost } from "@/lib/appwrite";
import { useForm } from "react-hook-form";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import CustomButton from "@/components/CustomButton";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import { z } from "zod";
import { createCommentSchema } from "@/lib/form-schemas";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";

const Post = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const { data: post, refetch } = useAppwrite(() => getPost(postId as string));

  useEffect(() => {
    refetch();
  }, [postId]);

  const { control, reset, handleSubmit } = useForm<
    z.infer<typeof createCommentSchema>
  >({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createCommentSchema>) => {
    // submitComment should be an async function that submits the comment
    // and returns the updated list of comments
    await createComment(postId as string, {
      name: user!.$id,
      body: data.body,
      userId: user!.$id,
    });
    await getPost(postId as string);
    reset();
  };

  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && !isLoggedIn) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      {post && post[0] && (
        <View>
          <FlatList
            data={post[0].comments}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => {
              console.log("item", item);
              return (
                <View className="text-white my-4">
                  <View className="flex-row flex-1">
                    <View className="w-[25px] h-[25px] rounded-full border border-secondary justify-center items-center p-0.5 mr-1">
                      <Image
                        source={{ uri: item.user.avatar }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                      />
                    </View>
                    <Text className="text-white font-psemibold">
                      {item.user.email}
                    </Text>
                  </View>
                  <View className="ml-8">
                    <Text className="text-white">{item.body}</Text>
                    <Text className="text-white">
                      {formatDate(item.$createdAt)}
                    </Text>
                  </View>
                </View>
              );
            }}
            ListHeaderComponent={() => (
              <>
                <View className="flex-row justify-between">
                  <Text className="mt-10 mx-4 mb-4 font-bold text-yellow-600">
                    Post Details
                  </Text>
                  <Link
                    href={"/home"}
                    className="mt-10 mx-4 mb-4 font-bold text-yellow-600">
                    Go back to posts
                  </Link>
                </View>
                <VideoCard
                  title={post[0].title}
                  thumbnail={post[0].thumbnail}
                  video={post[0].video}
                  creator={post[0].creator.username}
                  avatar={post[0].creator.avatar}
                  id={post[0].$id}
                  showMore={false}
                />

                {user!.$id == post[0].creator.$id && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={async () => {
                      // deletePost should be an async function that deletes the post
                      // and returns the updated list of posts
                      await deletePost(postId as string);
                      router.push("/home");
                    }}
                    className="relative w-full mb-4 rounded-xl text-white justify-end mx-4">
                    <Text className="text-yellow-600">Delete post</Text>
                  </TouchableOpacity>
                )}
                <FormField
                  control={control}
                  containerStyles="p-10 mx-4"
                  name="body"
                  placeholder="Write a comment"
                  secureTextEntry={false}
                  title=""
                />
                <CustomButton
                  containerStyles="mx-4"
                  handlePress={handleSubmit(onSubmit)}
                  textStyles={""}
                  title="Post Comment"
                />
              </>
            )}
            ListEmptyComponent={() => {
              return (
                <EmptyState
                  title="No comments Found"
                  subtitle="Be the first one to comment"
                />
              );
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Post;
