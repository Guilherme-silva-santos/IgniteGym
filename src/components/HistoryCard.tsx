import { HStack, Heading, Text, VStack } from 'native-base'
import { HistoryDTO } from '../dtos/HistoryDTO'

type Props = {
  data: HistoryDTO
  // o data vai ser a tipagem que recebe um title e um data sendo o historydto
}

export function HistoryCard({ data }: Props) {
  return (
    // px=vertical py=horizontal
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr={5} flex={1}>
        <Heading
          color="white"
          fontSize="md"
          textTransform="capitalize"
          fontFamily="heading"
        >
          {data.group}
        </Heading>
        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>
      <Text color="gray.300" fontSize="md">
        {data.hour}
      </Text>
    </HStack>
  )
}
