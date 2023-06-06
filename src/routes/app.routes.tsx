import { Platform } from 'react-native'

import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'

import { useTheme } from 'native-base'

import HomeSvg from '../assets/home.svg'
import ProfileSvg from '../assets/profile.svg'
import HistorySvg from '../assets/history.svg'

import { Home } from '../Screens/Home'
import { Profile } from '../Screens/Profile'
import { History } from '../Screens/History'
import { Exercise } from '../Screens/Exercise'

type AppRoutes = {
  home: undefined
  history: undefined
  profile: undefined
  exercises: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>
// pega a tipagem da rota por padrão do bottomnavigation e adiciona a ela o type que foi criado

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

// eslint-disable-next-line no-redeclare
export function AppRoutes() {
  const { sizes, colors } = useTheme()
  // desestrutura o usetheme pegando apenas o size
  const iconSize = sizes[6]
  // como todos os icones do menu seguem um padrão já define esse padrão em uma var

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      {/*
            a ordem em que são colocadas as screens aqui interfere na ordem dos icones que estarão presentes
            no menu
        */}
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="exercises"
        component={Exercise}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}
