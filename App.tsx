import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DrawerAdmin from './rotas/drawerAdmin';
import DrawerCliente from './rotas/drawerClientetemp';
import T_cadastro from './Variados/cadastro';
import T_login from './Variados/login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={T_login} />
        <Stack.Screen name="ClienteHome" component={DrawerCliente} />
        <Stack.Screen name="AdminHome" component={DrawerAdmin} />
        <Stack.Screen name="cadastro" component={T_cadastro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


