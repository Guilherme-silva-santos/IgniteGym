import { useState } from 'react'
import { VStack, FlatList, HStack, Heading, Text } from 'native-base'
import { HomeHeader } from '../components/HomeHeader'
import { Group } from '../components/Group'
import { ExerciseCard } from '../components/ExerciseCard'

export function Home() {
  const [groups, setGroups] = useState(['costas', 'bíceps', 'triceps', 'ombro'])
  const [exercises, setExercises] = useState([
    'Puxada Front',
    'Remada Uni',
    'Puxada Cur',
    'Levantamento Terra',
  ])
  const [groupSelected, setGroupSelected] = useState('costas')

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxHeight={10}
      />

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" marginBottom={5}>
          <Heading color="gray.200" fontSize="md">
            Exercícios
          </Heading>
          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ExerciseCard />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
        />
      </VStack>
    </VStack>
  )
}
