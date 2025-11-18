import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, ScrollView, TextInput, View } from 'react-native';
import { loginUsuario, observarUsuario } from '../CRUD/authFirebase';
import { db } from '../CRUD/firebaseConfig';
import style from './S_login';

// Função para traduzir erros do Firebase
function tratarErroFirebase(error: any): string {
  switch (error.code) {
    case "auth/user-not-found":
      return "Usuário não encontrado.";
    case "auth/wrong-password":
      return "Senha incorreta.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/user-disabled":
      return "Usuário desabilitado. Entre em contato com o suporte.";
    default:
      return "Ocorreu um erro ao tentar logar. Tente novamente.";
  }
}

export default function T_login({ navigation }: any) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Limpa campos quando a tela é focada
  useFocusEffect(
    useCallback(() => {
      setUsuario('');
      setSenha('');
    }, [])
  );

  // Observa se o usuário já está logado
  useEffect(() => {
    const unsubscribe = observarUsuario((user) => {
      const checkTipo = async () => {
        if (user) {
          try {
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);
            const tipo = docSnap.exists() ? docSnap.data()?.tipo : null;

            if (tipo === "admin") {
              navigation.replace("AdminHome");
            } else {
              navigation.replace("ClienteHome");
            }
          } catch (error: any) {
            console.error("Erro ao buscar tipo do usuário:", error.message);
          }
        }
      };
      checkTipo();
    });

    return () => unsubscribe();
  }, [navigation]);

  // Faz login
  const handleLogin = async () => {
    if (!usuario || !senha) {
      Alert.alert("Erro", "Preencha o e-mail e a senha!");
      return;
    }

    setLoading(true);
    try {
      await loginUsuario(usuario, senha);
      // Se o login falhar, será capturado no catch
    } catch (error: any) {
      // Mostra alerta amigável
      Alert.alert("Erro ao logar", tratarErroFirebase(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={style.container} contentContainerStyle={style.Icontainer}>
      <Image style={style.logo} source={require("../assets/ksa.jpg")} />

      <TextInput
        placeholder='Email'
        value={usuario}
        onChangeText={setUsuario}
        style={style.input}
        autoCapitalize='none'
      />

      <TextInput
        placeholder='Senha'
        value={senha}
        onChangeText={setSenha}
        style={style.input}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <Button title='Fazer login' onPress={handleLogin} />
          <View style={{ height: 10 }} />
          <Button
            title='Cadastrar'
            onPress={() => navigation.navigate("cadastro")}
          />
        </>
      )}
    </ScrollView>
  );
}
