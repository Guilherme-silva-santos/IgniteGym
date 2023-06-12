import { HStack, Heading, Text, VStack, Icon } from 'native-base'

import { MaterialIcons } from '@expo/vector-icons'

import { UserPhoto } from './UserPhoto'
import { TouchableOpacity } from 'react-native'

export function HomeHeader() {
  return (
    // o hstack é para deixar os item alinhados um ao lado do outro
    // o vStack deixa um elemento abaixo do outro

    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={{ uri: 'https://github.com/Guilherme-silva-santos.png' }}
        size={16}
        alt="Imagem do usuário"
        mr={4}
      />
      <VStack flex={1}>
        {/** com o flex de um faz com que a v stack ocupe o tamanho todo destinado a ela e jogue o icone para
         * o canto da tela, é possivel ver a caixa que a vstack ocupa mudando o bgcolor dela
         */}
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>

        <Heading color="gray.100" fontSize="md">
          Guilherme
        </Heading>
      </VStack>
      <TouchableOpacity>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}