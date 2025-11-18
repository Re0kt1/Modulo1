import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, TextInput } from "react-native";
import { cadastrarUsuario } from "../CRUD/authFirebase";
import style from "./S_login"; // pode reaproveitar o mesmo estilo

export default function T_cadastro({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async () => {
    if (!email || !senha || !nome) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      await cadastrarUsuario(email, senha, nome, "cliente"); // só clientes podem se cadastrar
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.goBack(); // volta para login
    } catch (error: any) {
      Alert.alert("Erro ao cadastrar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={style.container} contentContainerStyle={style.Icontainer}>
      <TextInput
        placeholder='Nome'
        value={nome}
        onChangeText={setNome}
        style={style.input}
      />
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
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
        <Button title='Cadastrar' onPress={handleCadastrar} />
      )}
    </ScrollView>
  );
}
