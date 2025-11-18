import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../CRUD/firebaseConfig";
import Styles from "./S_perfil";

const styles = Styles;

export default function T_perfil() {
  const user = auth.currentUser;
  const [nome, setNome] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // E-mail
  const [novoEmail, setNovoEmail] = useState(user?.email || "");
  const [senhaAtualEmail, setSenhaAtualEmail] = useState("");

  // Senha
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaAtualSenha, setSenhaAtualSenha] = useState("");

  const [salvandoEmail, setSalvandoEmail] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  // Carrega nome do Firestore
  useEffect(() => {
    const carregarNome = async () => {
      try {
        if (!user) return;
        const docRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const dados = snap.data();
          setNome(dados.nome || "Usuário sem nome");
        } else {
          setNome("Usuário não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar nome:", error);
        setNome("Erro ao carregar nome");
      } finally {
        setLoading(false);
      }
    };
    carregarNome();
  }, [user]);

  // Alterar e-mail
  const alterarEmailUsuario = async () => {
    if (!user || !novoEmail.trim() || !senhaAtualEmail.trim()) {
      Alert.alert("Erro", "Digite um e-mail válido e sua senha atual.");
      return;
    }

    try {
      setSalvandoEmail(true);

      // Reautenticar
      const credential = EmailAuthProvider.credential(user.email!, senhaAtualEmail);
      await reauthenticateWithCredential(user, credential);

      // Atualizar e-mail
      await updateEmail(user, novoEmail);

      // Atualizar Firestore
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { email: novoEmail });

      // Enviar verificação
      await sendEmailVerification(user);

      Alert.alert(
        "Sucesso",
        "E-mail atualizado. Um e-mail de verificação foi enviado para o novo endereço."
      );
      setSenhaAtualEmail("");
    } catch (error: any) {
      console.error("Erro ao atualizar e-mail:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Senha incorreta", "Digite a senha correta para alterar o e-mail.");
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert("E-mail já usado", "Esse e-mail já está sendo usado por outro usuário.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("E-mail inválido", "Digite um e-mail válido.");
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Reautenticação necessária",
          "Por segurança, faça login novamente para alterar o e-mail."
        );
      } else {
        Alert.alert("Erro", "Não foi possível atualizar o e-mail.");
      }
    } finally {
      setSalvandoEmail(false);
    }
  };

  // Alterar senha
  const alterarSenhaUsuario = async () => {
    if (!user || !novaSenha.trim() || !senhaAtualSenha.trim()) {
      Alert.alert("Erro", "Digite a senha atual e a nova senha.");
      return;
    }

    try {
      setSalvandoSenha(true);

      // Reautenticar
      const credential = EmailAuthProvider.credential(user.email!, senhaAtualSenha);
      await reauthenticateWithCredential(user, credential);

      // Atualizar senha
      await updatePassword(user, novaSenha);

      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setSenhaAtualSenha("");
      setNovaSenha("");
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Senha incorreta", "Digite a senha correta para alterar a senha.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Senha fraca", "A nova senha deve ter no mínimo 6 caracteres.");
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Reautenticação necessária",
          "Por segurança, faça login novamente para alterar a senha."
        );
      } else {
        Alert.alert("Erro", "Não foi possível atualizar a senha.");
      }
    } finally {
      setSalvandoSenha(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
      {/* Imagem de Perfil */}
      <View style={styles.imageContainer}>
        <Image
          source={
            user?.photoURL
              ? { uri: user.photoURL }
              : require("../assets/perfil.png")
          }
          style={styles.profileImage}
        />
      </View>

      {/* Nome */}
      <Text style={styles.name}>{nome}</Text>

      {/* Email Atual */}
      <Text style={styles.email}>{user?.email || "Email não disponível"}</Text>

      {/* Alterar E-mail */}
      <View style={{ marginTop: 20, width: "100%" }}>
        <Text style={styles.sectionTitle}>Alterar E-mail</Text>
        <TextInput
          value={novoEmail}
          onChangeText={setNovoEmail}
          placeholder="Digite novo e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginVertical: 10,
          }}
        />
        <TextInput
          value={senhaAtualEmail}
          onChangeText={setSenhaAtualEmail}
          placeholder="Digite sua senha atual"
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Button
          title={salvandoEmail ? "Salvando..." : "Salvar E-mail"}
          onPress={alterarEmailUsuario}
          disabled={salvandoEmail}
        />
      </View>

      {/* Alterar Senha */}
      <View style={{ marginTop: 20, width: "100%" }}>
        <Text style={styles.sectionTitle}>Alterar Senha</Text>
        <TextInput
          value={senhaAtualSenha}
          onChangeText={setSenhaAtualSenha}
          placeholder="Digite sua senha atual"
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginVertical: 10,
          }}
        />
        <TextInput
          value={novaSenha}
          onChangeText={setNovaSenha}
          placeholder="Digite a nova senha"
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Button
          title={salvandoSenha ? "Salvando..." : "Salvar Senha"}
          onPress={alterarSenhaUsuario}
          disabled={salvandoSenha}
        />
      </View>

      {/* Informações adicionais */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>UID:</Text>
          <Text style={styles.infoValue}>{user?.uid || "—"}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
