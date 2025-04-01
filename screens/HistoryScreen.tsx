import React from 'react';
import { View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { HistoryTable } from '../components/HistoryTable';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export const HistoryScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center border-b border-gray-200 p-4">
        <TouchableOpacity
          onPress={() => navigation.navigate('Menu')}
          className="rounded-full bg-[#1DB954] px-6 py-3">
          <Text className="font-semibold text-white">Back to Menu</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <HistoryTable />
      </View>
    </SafeAreaView>
  );
};
