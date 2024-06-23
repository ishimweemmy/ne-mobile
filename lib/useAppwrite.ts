import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";

const useAppwrite = (fn: () => Promise<Models.Document[]>) => {
  const [data, setData] = useState<TPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error: any) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const refetch= () => fetchData();
  return { data, isLoading, refetch };
};

export default useAppwrite;
