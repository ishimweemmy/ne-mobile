import React, { useEffect } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import useAppwrite from "@/lib/useAppwrite";
import { searchPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import SearchInput from "@/components/SearchInput";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/context/GlobalProvider";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() =>
    searchPosts(query as string)
  );

  useEffect(() => {
    refetch();
  }, [query]);

  const { control } = useForm<{ searchQuery: string }>({
    defaultValues: {
      searchQuery: "",
    },
  });
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && !isLoggedIn) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <SearchInput
                  name="searchQuery"
                  control={control}
                  placeholder="Search a video topic"
                />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
