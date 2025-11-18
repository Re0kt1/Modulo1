import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * 🔹 Tipo de dados do agendamento
 */
export interface Agendamento {
  id?: string;
  usuarioId: string;
  titulo: string;
  descricao: string;
  status: string;
  dataCriacao: Date;
  dataHora?: string;
  dataModificacao?: Date;
}

/**
 * 🔹 Nome da coleção no Firestore
 */
const COLECAO = "agendamentos";

/**
 * 🔹 Adiciona um novo agendamento
 */
export const adicionarAgendamento = async (agendamento: Agendamento): Promise<void> => {
  try {
    await addDoc(collection(db, COLECAO), agendamento);
  } catch (erro) {
    console.error("Erro ao adicionar agendamento:", erro);
    throw erro;
  }
};

/**
 * 🔹 Busca todos os agendamentos
 */
export const buscarAgendamentos = async (): Promise<Agendamento[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLECAO));
    const lista: Agendamento[] = [];

    querySnapshot.forEach((docSnap) => {
      lista.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Agendamento, "id">),
      });
    });

    return lista;
  } catch (erro) {
    console.error("Erro ao buscar agendamentos:", erro);
    throw erro;
  }
};

/**
 * 🔹 Atualiza um agendamento existente
 */
export const atualizarAgendamento = async (id: string, dados: Partial<Agendamento>): Promise<void> => {
  try {
    const agendamentoRef = doc(db, COLECAO, id);
    await updateDoc(agendamentoRef, dados);
  } catch (erro) {
    console.error("Erro ao atualizar agendamento:", erro);
    throw erro;
  }
};

/**
 * 🔹 Exclui um agendamento pelo ID
 */
export const excluirAgendamento = async (id: string): Promise<void> => {
  try {
    const agendamentoRef = doc(db, COLECAO, id);
    await deleteDoc(agendamentoRef);
  } catch (erro) {
    console.error("Erro ao excluir agendamento:", erro);
    throw erro;
  }
};
