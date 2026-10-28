/**
 * API Client for Food Packaging Recommendation System
 */

const API_BASE = '/api';

export async function connectDatabase(uri) {
  const res = await fetch(`${API_BASE}/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uri })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Failed to connect: ${res.statusText}`);
  }
  return data;
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchCommodities() {
  const res = await fetch(`${API_BASE}/commodities`);
  if (!res.ok) throw new Error(`Failed to fetch commodities: ${res.statusText}`);
  return res.json();
}

export async function fetchMaterials() {
  const res = await fetch(`${API_BASE}/materials`);
  if (!res.ok) throw new Error(`Failed to fetch materials: ${res.statusText}`);
  return res.json();
}

export async function fetchRules() {
  const res = await fetch(`${API_BASE}/rules`);
  if (!res.ok) throw new Error(`Failed to fetch rules: ${res.statusText}`);
  return res.json();
}

export async function getRecommendations(payload) {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Recommendation failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.statusText}`);
  return res.json();
}

export async function seedDatabase() {
  const res = await fetch(`${API_BASE}/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Failed to seed database: ${res.statusText}`);
  return res.json();
}
