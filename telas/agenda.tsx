import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Modal,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../CRUD/firebaseConfig";
import Styles from "./S_agenda";

const styles = Styles;

export default function T_agenda() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  // 🔹 Modal para alteração/cancelamento
  const [modalRequisicao, setModalRequisicao] = useState(false);
  const [tipoRequisicao, setTipoRequisicao] = useState<"alterar" | "cancelar" | null>(null);
  const [textoRequisicao, setTextoRequisicao] = useState("");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any>(null);

  const user = auth.currentUser;

  // 🔹 Escuta em tempo real os agendamentos do usuário
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "agendamentos"), where("usuarioId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAgendamentos(lista);
        setLoading(false);
      },
      (error) => {
        Alert.alert("Erro ao carregar agendamentos", error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 🔹 Envia requisição de novo agendamento
  const requisitarAgendamento = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      Alert.alert("Erro", "Preencha o título e a descrição!");
      return;
    }

    try {
      await addDoc(collection(db, "requisicoesAgendamento"), {
        usuarioId: user?.uid,
        titulo,
        descricao,
        status: "pendente",
        tipoRequisicao: "novo",
        dataCriacao: new Date(),
      });
      Alert.alert("Sucesso", "Sua requisição foi enviada!");
      setTitulo("");
      setDescricao("");
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  // 🔹 Envia requisição de alteração/cancelamento
  const enviarRequisicao = async () => {
    if (!agendamentoSelecionado || !tipoRequisicao) return;

    if (tipoRequisicao === "alterar" && !textoRequisicao.trim()) {
      Alert.alert("Erro", "Descreva o que deseja alterar!");
      return;
    }

    try {
      await addDoc(collection(db, "requisicoesAgendamento"), {
        usuarioId: user?.uid,
        agendamentoId: agendamentoSelecionado.id,
        titulo: agendamentoSelecionado.titulo,
        descricao: textoRequisicao || "Solicitação de cancelamento",
        tipoRequisicao,
        status: "pendente",
        dataCriacao: new Date(),
      });

      Alert.alert("Enviado", "Sua solicitação foi enviada ao administrador!");
      setModalRequisicao(false);
      setTextoRequisicao("");
      setAgendamentoSelecionado(null);
      setTipoRequisicao(null);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const formatarData = (data: any) => {
    if (!data) return "Sem data definida";
    const d = data.toDate ? data.toDate() : new Date(data);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const corStatus = (status: string) => {
    switch (status) {
      case "confirmado":
        return "#34C759";
      case "rejeitado":
        return "#FF3B30";
      default:
        return "#FFCC00";
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f2f2f2", marginBottom: "12%"}}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Meus Agendamentos
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : agendamentos.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
          Nenhum agendamento encontrado.
        </Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
  <View
    style={{
      backgroundColor: "white",
      padding: 15,
      marginVertical: 6,
      borderRadius: 10,
      borderLeftWidth: 8,
      borderLeftColor: corStatus(item.status),
    }}
  >
    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
      {item.titulo || "Sem título"}
    </Text>

    <Text style={{ marginTop: 5 }}>{item.descricao || "Sem descrição"}</Text>

    {/* 🔹 Exibe observação do admin, se houver */}
    {item.observacao && item.observacao.trim().length > 0 && (
      <View
        style={{
          marginTop: 10,
          backgroundColor: "#E8F5E9",
          padding: 10,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: "#34C759",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#2E7D32" }}>
          Observação do Administrador:
        </Text>
        <Text style={{ color: "#2E7D32", marginTop: 4 }}>
          {item.observacao}
        </Text>
      </View>
    )}

    <Text style={{ marginTop: 5, color: "#555" }}>
      Status:{" "}
      <Text style={{ color: corStatus(item.status) }}>{item.status}</Text>
    </Text>

    {item.dataHora && (
      <Text style={{ marginTop: 5, color: "#555" }}>
        Data: {formatarData(item.dataHora)}
      </Text>
    )}

    {/* 🔹 Botões de ação */}
    {item.status === "confirmado" && (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button
          title="Pedir Alteração"
          color="#FF9500"
          onPress={() => {
            setTipoRequisicao("alterar");
            setAgendamentoSelecionado(item);
            setModalRequisicao(true);
          }}
        />
        <Button
          title="Pedir Cancelamento"
          color="#FF3B30"
          onPress={() => {
            setTipoRequisicao("cancelar");
            setAgendamentoSelecionado(item);
            setModalRequisicao(true);
          }}
        />
      </View>
    )}
  </View>
        )}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Novo Agendamento" onPress={() => setModalVisible(true)} color="#007AFF" />
      </View>

      {/* 🔹 Modal de novo agendamento */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={styles.modalBase}
        >
          <View
            style={styles.modal}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Título do agendamento:</Text>
            <TextInput
              placeholder="Ex: Corte de cabelo"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.observ}
            />

            <Text style={{ fontSize: 18, marginBottom: 10 }}>Descrição:</Text>
            <TextInput
              placeholder="Ex: Corte masculino, livre dia 12 ao 15 às 13h"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.observ}
            />

            <Button title="Enviar requisição" onPress={requisitarAgendamento} />
            <View style={{ height: 10 }} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* 🔹 Modal de alteração/cancelamento */}
      <Modal
        visible={modalRequisicao}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalRequisicao(false)}
      >
        <View
          style={styles.modalBase}
        >
          <View
            style={styles.modal}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              {tipoRequisicao === "alterar"
                ? "Solicitar Alteração"
                : "Solicitar Cancelamento"}
            </Text>

            {tipoRequisicao === "alterar" && (
              <>
                <Text style={{ marginBottom: 10 }}>Explique o motivo ou o que deseja mudar:</Text>
                <TextInput
                  placeholder="Ex: Gostaria de mudar o horário para 15h."
                  value={textoRequisicao}
                  onChangeText={setTextoRequisicao}
                  multiline
                  numberOfLines={4}
                  style={styles.observ}
                />
              </>
            )}

            <Button title="Enviar" onPress={enviarRequisicao} color="#007AFF" />
            <View style={{ height: 10 }} />
            <Button title="Cancelar" color="red" onPress={() => setModalRequisicao(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
