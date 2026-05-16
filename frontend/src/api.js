const BASE = 'http://localhost:5000/api'

export async function listarBaterias() {
  const res = await fetch(`${BASE}/baterias`)
  if (!res.ok) throw new Error('Falha ao buscar baterias')
  return res.json()
}

export async function cadastrarBateria(dados) {
  const res = await fetch(`${BASE}/baterias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erro ao cadastrar bateria')
  return json
}

export async function atualizarBateria(id, dados) {
  const res = await fetch(`${BASE}/baterias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erro ao atualizar bateria')
  return json
}

export async function deletarBateria(id) {
  const res = await fetch(`${BASE}/baterias/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erro ao remover bateria')
}

export async function proximoCodigoUnico() {
  const res = await fetch(`${BASE}/baterias/proximo-codigo`)
  if (!res.ok) throw new Error('Erro ao gerar código')
  const json = await res.json()
  return json.codigo
}
