// rotas/drawerCliente.tsx
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Button, Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { sairUsuario } from '../CRUD/authFirebase'; // função de logout
import T_agenda from '../telasAdmin/agenda';
import T_perfil from '../telasAdmin/perfil';

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

export default function DrawerCliente({ navigation }: any) {
  return (
    <Drawer.Navigator
      initialRouteName="Agenda"
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
            <Image
              source={require('../assets/stack.png')}
              style={{ width: 35, height: 35, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: '#74CFFF', elevation: 0, shadowOpacity: 0 },
        headerTitleAlign: 'center',
        drawerLabelStyle: { marginLeft: 5, fontSize: 15, fontFamily: 'sans-serif', color: '#2c2c2c' },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#777',
      })}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <DrawerItemList {...props} />
          </View>

          {/* Botão de Logout no fundo */}
          <View style={{ padding: 20 }}>
            <Button
              title="Sair"
              color="#FF3B30"
              onPress={async () => {
                await sairUsuario();
                navigation.replace('Login'); // volta para login
              }}
            />
          </View>
        </DrawerContentScrollView>
      )}
    >

      <Drawer.Screen
        name='Agenda'
        component={T_agenda}
        options={{
          headerTitle: 'Meus Agendamentos',
          drawerIcon: ({ size }) => (
            <Image source={require('../assets/agenda.png')} style={{ width: size, height: size, resizeMode: 'contain' }} />
          ),
        }}
      />
      <Drawer.Screen
        name='Perfil'
        component={T_perfil}
        options={{
          headerTitle: 'Perfil',
          drawerIcon: ({ size }) => (
            <Image source={require('../assets/perfil.png')} style={{ width: size, height: size, resizeMode: 'contain' }} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
