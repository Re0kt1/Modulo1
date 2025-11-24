import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../CRUD/firebaseConfig";
import { filtroBotao, modalConfirmButton, textoFiltro } from "./S_agenda_dinamica";
import Styles from "./S_agenda_estatica";


const styles = Styles;

export default function T_agendamentosAdmin() {
  const [requisicoes, setRequisicoes] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarPendentes, setMostrarPendentes] = useState(true);
  const [mostrarConfirmados, setMostrarConfirmados] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  // Modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoModal, setTipoModal] = useState<"confirmar" | "rejeitar" | null>(null);
  const [itemSelecionado, setItemSelecionado] = useState<any>(null);
  const [textoObservacao, setTextoObservacao] = useState("");

  // Estado que impede clique duplo
  const [processando, setProcessando] = useState(false);

  // Data/Hora
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);

  // Atualização em tempo real
  useEffect(() => {
    const unsubReq = onSnapshot(collection(db, "requisicoesAgendamento"), (snapshot) => {
      const listaReq = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequisicoes(listaReq);
    });

    const unsubAg = onSnapshot(collection(db, "agendamentos"), (snapshot) => {
      const listaAg = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAgendamentos(listaAg);
    });

    setLoading(false);
    return () => {
      unsubReq();
      unsubAg();
    };
  }, []);

  const filtrar = (lista: any[]) => {
    return lista.filter((item) => {
      const busca = pesquisa.toLowerCase();
      const titulo = item.titulo?.toLowerCase() || "";
      const descricao = item.descricao?.toLowerCase() || "";
      const status = item.status?.toLowerCase() || "";
      const passaFiltro = filtroStatus ? status.includes(filtroStatus.toLowerCase()) : true;
      const passaPesquisa = titulo.includes(busca) || descricao.includes(busca);
      return passaFiltro && passaPesquisa;
    });
  };

  const abrirModal = (tipo: "confirmar" | "rejeitar", item: any) => {
    setTipoModal(tipo);
    setItemSelecionado(item);
    setTextoObservacao("");
    setDataSelecionada(null);
    setModalVisivel(true);
  };

  const formatarData = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const confirmarAcao = async () => {
    if (processando) return; // 🔒 Evita clique duplo
    if (!itemSelecionado) return;

    setProcessando(true);

    try {
      const reqRef = doc(db, "requisicoesAgendamento", itemSelecionado.id);
      const tipoReq = itemSelecionado.tipoRequisicao || "novo";

      const getValor = (obj: any, chave: string) =>
        obj?.[chave] ?? obj?.dados?.[chave] ?? null;

      const titulo = getValor(itemSelecionado, "titulo") || "Sem título";
      const descricaoAdmin = textoObservacao?.trim();
      const descricao =
        descricaoAdmin && descricaoAdmin.length > 0
          ? descricaoAdmin
          : getValor(itemSelecionado, "descricao") || "Sem descrição";

      const usuarioId = getValor(itemSelecionado, "usuarioId") || "desconhecido";
      const dataCriacao = getValor(itemSelecionado, "dataCriacao") || serverTimestamp();
      const agendamentoId = getValor(itemSelecionado, "agendamentoId");

      // CONFIRMAR
      if (tipoModal === "confirmar") {
        
        // Cancelamento
        if (tipoReq === "cancelar") {
          if (!agendamentoId) return;
          await deleteDoc(doc(db, "agendamentos", agendamentoId));
          await deleteDoc(reqRef);
        }

        // Novo agendamento
        else if (tipoReq === "novo") {
          if (!dataSelecionada) return;
          await addDoc(collection(db, "agendamentos"), {
            agendamentoId: itemSelecionado.id,
            titulo,
            descricao,
            usuarioId,
            status: "confirmado",
            observacao: descricaoAdmin || "",
            dataHora: dataSelecionada,
            dataCriacao,
            dataProcessamento: serverTimestamp(),
            tipoRequisicao: "novo",
          });
          await deleteDoc(reqRef);
        }

        // Alteração
        else if (tipoReq === "alterar") {
          if (!agendamentoId || !dataSelecionada) return;
          await deleteDoc(doc(db, "agendamentos", agendamentoId));
          await addDoc(collection(db, "agendamentos"), {
            agendamentoId: itemSelecionado.id,
            titulo,
            descricao,
            usuarioId,
            status: "confirmado",
            observacao: descricaoAdmin || "",
            dataHora: dataSelecionada,
            dataCriacao,
            dataProcessamento: serverTimestamp(),
            tipoRequisicao: "alterar",
          });
          await deleteDoc(reqRef);
        }
      }

      // REJEITAR
      else if (tipoModal === "rejeitar") {
        await addDoc(collection(db, "agendamentos"), {
          agendamentoId: itemSelecionado.id,
          titulo,
          descricao: descricaoAdmin || descricao,
          usuarioId,
          status: "rejeitado",
          observacao: descricaoAdmin || "Sem observação",
          dataCriacao,
          dataProcessamento: serverTimestamp(),
          tipoRequisicao: "rejeitado",
        });
        await deleteDoc(reqRef);
      }

      setModalVisivel(false);

    } catch (erro: any) {
      console.error("Erro confirmarAcao:", erro);

    } finally {
      setProcessando(false); // 🔓 libera o botão
    }
  };

  const excluirAgendamento = async (id: string) => {
    try {
      await deleteDoc(doc(db, "agendamentos", id));
    } catch (erro: any) {
      console.error("Erro ao excluir:", erro);
    }
  };

  // ------------------------------------------------------------------
  //  Interface
  // ------------------------------------------------------------------
  return (
    <View style={{ flex:1}}>
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.title}>
        Painel do Administrador
      </Text>

      <TextInput
        placeholder="Pesquisar agendamento..."
        value={pesquisa}
        onChangeText={setPesquisa}
        style={styles.searchBox}
      />

      {/* Filtros */}
      <View style={styles.filtros}>
        {["", "pendente", "confirmado", "rejeitado"].map((filtro) => (
          <TouchableOpacity
            key={filtro || "todos"}
            onPress={() => setFiltroStatus(filtro)}
            style={filtroBotao(filtroStatus === filtro)}
          >
            <Text style={textoFiltro}>
              {filtro === "" ? "Todos" : filtro.charAt(0).toUpperCase() + filtro.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Requisições Pendentes */}
      <TouchableOpacity
        onPress={() => setMostrarPendentes(!mostrarPendentes)}
        style={styles.requiPenden}
      >
        <Text style={ styles.textBlackBold}>
          Requisições Pendentes
        </Text>
        <Ionicons name={mostrarPendentes ? "chevron-up" : "chevron-down"} size={20} color="white" />
      </TouchableOpacity>

      {mostrarPendentes &&
        (loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 10 }} />
        ) : (
          <FlatList
            data={filtrar(requisicoes)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.requisicoesDenPen}>
                <Text style={{ fontWeight: "bold" }}>{item.titulo || "Sem título"}</Text>
                <Text>{item.descricao || "Sem descrição"}</Text>
                <Text style={{ color: "#777" }}>Status: {item.status}</Text>

                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => abrirModal("confirmar", item)}
                    style={styles.confirmBotao}
                    disabled={processando}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {processando ? "Processando..." : "Confirmar"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => abrirModal("rejeitar", item)}
                    style={styles.rejeitarBotao}
                    disabled={processando}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {processando ? "..." : "Rejeitar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ))}

      {/* Agendamentos Confirmados */}
      <TouchableOpacity
        onPress={() => setMostrarConfirmados(!mostrarConfirmados)}
        style={styles.mostrarconfirmados}
      >
        <Text style={styles.textBlackBold}>
          Agendamentos Confirmados
        </Text>
        <Ionicons
          name={mostrarConfirmados ? "chevron-up" : "chevron-down"}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {mostrarConfirmados &&
        (loading ? (
          <ActivityIndicator size="large" color="#34C759" style={{ marginTop: 10 }} />
        ) : (
          <FlatList
            data={filtrar(agendamentos)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.requisicoesDenPen}>
                <Text style={{ fontWeight: "bold" }}>{item.titulo || "Sem título"}</Text>
                <Text>{item.descricao || "Sem descrição"}</Text>
                <Text style={{ color: "#777" }}>Status: {item.status}</Text>

                <TouchableOpacity
                  onPress={() => excluirAgendamento(item.id)}
                  style={styles.excluirAgen}
                  disabled={processando}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ))}
    </ScrollView>

    {/* Modal */}
      {modalVisivel && itemSelecionado && (
        <View style={styles.modalBase}>
          <View style={styles.modal}>
            <Text style={styles.textBlackBold}>
              {tipoModal === "confirmar" ? "Confirmar Requisição" : "Rejeitar Requisição"}
            </Text>

            {tipoModal === "confirmar" && itemSelecionado.tipoRequisicao !== "cancelar" && (
              <>
                <Text style={{ marginBottom: 5 }}>Selecione a data:</Text>
                <TouchableOpacity
                  onPress={() => setMostrarDataPicker(true)}
                  style={styles.barraData}
                  disabled={processando}
                >
                  <Text>
                    {dataSelecionada ? formatarData(dataSelecionada) : "Escolher data"}
                  </Text>
                </TouchableOpacity>

                {mostrarDataPicker && (
                  <DateTimePicker
                    value={dataSelecionada || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={(event, date) => {
                      setMostrarDataPicker(false);
                      if (date) {
                        const novaData = new Date(date);
                        if (dataSelecionada) {
                          novaData.setHours(dataSelecionada.getHours());
                          novaData.setMinutes(dataSelecionada.getMinutes());
                        }
                        setDataSelecionada(novaData);
                      }
                    }}
                  />
                )}

                <TouchableOpacity
                  onPress={() => setMostrarHoraPicker(true)}
                  style={styles.hora}
                  disabled={processando}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Escolher Hora</Text>
                </TouchableOpacity>

                {mostrarHoraPicker && (
                  <DateTimePicker
                    value={dataSelecionada || new Date()}
                    mode="time"
                    is24Hour
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => {
                      setMostrarHoraPicker(false);
                      if (date) {
                        const novaData = dataSelecionada ? new Date(dataSelecionada) : new Date();
                        novaData.setHours(date.getHours());
                        novaData.setMinutes(date.getMinutes());
                        setDataSelecionada(novaData);
                      }
                    }}
                  />
                )}

                <Text style={{ marginBottom: 10 }}>Observações:</Text>
                <TextInput
                  placeholder="Digite aqui..."
                  multiline
                  numberOfLines={4}
                  value={textoObservacao}
                  onChangeText={setTextoObservacao}
                  style={styles.observ}
                  editable={!processando}
                />
              </>
            )}

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => !processando && setModalVisivel(false)}
                style={styles.cance}
                disabled={processando}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={!processando ? confirmarAcao : undefined}
                style={[
                  modalConfirmButton(tipoModal === "confirmar"),
                  processando && { opacity: 0.6 }
                ]}
                disabled={processando}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {processando
                    ? "Processando..."
                    : tipoModal === "confirmar"
                      ? "Confirmar"
                      : "Rejeitar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
