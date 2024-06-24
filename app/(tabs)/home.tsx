import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import { useForm } from "react-hook-form";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";

const Home = () => {
  const { control } = useForm<{ searchQuery: string }>({
    defaultValues: { searchQuery: "" },
  });
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const onRefresh = async () => {
    setRefreshing(true);
    // refresh the videos posts
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          return (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={item.creator.username}
              avatar={item.creator.avatar}
              id={item.$id}
            />
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View className="px-4 my-6 space-y-6">
              <View className="flex flex-row items-start justify-between mb-6">
                <View>
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl text-white font-psemibold">
                    Ishimwe
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    resizeMode="contain"
                    className="h-10 w-9"
                  />
                </View>
              </View>
              <SearchInput
                control={control}
                name="searchQuery"
                placeholder="Search for a video topic"
              />
              <View className="flex-1 w-full pt-5 pb-8">
                <Text className="mb-3 text-lg text-gray-100 font-pregular">
                  Latest Posts
                </Text>
                <Trending posts={latestPosts ?? []} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <EmptyState
              title="No videos Found"
              subtitle="Be the first one to upload a video"
            />
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
