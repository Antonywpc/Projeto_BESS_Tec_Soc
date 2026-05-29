const BASE = 'http://localhost:5000/api'

// ── Lookups ───────────────────────────────────────────────
export const getFabricantes   = () => fetch(`${BASE}/fabricantes`).then(r => r.json())
export const getModelos       = () => fetch(`${BASE}/modelos`).then(r => r.json())
export const getTecnologias   = () => fetch(`${BASE}/tecnologias`).then(r => r.json())
export const getClassificacoes = () => fetch(`${BASE}/classificacoes`).then(r => r.json())
export const getEstados       = () => fetch(`${BASE}/estados`).then(r => r.json())
export const getCidades       = (idEstado) => fetch(`${BASE}/cidades/${idEstado}`).then(r => r.json())

// ── Próximo número de chassi ──────────────────────────────
export async function proximoNumeroChassi() {
  const res = await fetch(`${BASE}/cadastros/proximo-chassi`)
  const json = await res.json()
  return json.numero
}

// ── CRUD cadastros ────────────────────────────────────────
export async function listarCadastros() {
  const res = await fetch(`${BASE}/cadastros`)
  if (!res.ok) throw new Error('Falha ao buscar cadastros')
  return res.json()
}

export async function buscarCadastro(id) {
  const res = await fetch(`${BASE}/cadastros/${id}`)
  if (!res.ok) throw new Error('Cadastro não encontrado')
  return res.json()
}

export async function criarCadastro(dados) {
  const res = await fetch(`${BASE}/cadastros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erro ao cadastrar')
  return json
}

export async function atualizarCadastro(id, dados) {
  const res = await fetch(`${BASE}/cadastros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erro ao atualizar')
  return json
}

export async function deletarCadastro(id) {
  const res = await fetch(`${BASE}/cadastros/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erro ao remover cadastro')
}
