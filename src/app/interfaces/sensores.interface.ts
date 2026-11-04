export interface LeituraSolo {
  id?: string;
  data: string;
  n: number;        // Teor de Nitrogênio (mg/kg)
  p: number;        // Teor de Fósforo (mg/kg)
  k: number;        // Teor de Potássio (mg/kg)
  umidade: number;  // Porcentagem de umidade do solo (ex: 0.55 = 55%)
  status?: string;  // Situação operacional (ex: "Ideal", "Alerta", "Crítico")
  talhao?: string;  // Talhão / Área da lavoura (ex: "Talhão 12 - Norte")
  cultura?: string; // Cultura agrícola (ex: "Soja", "Milho", "Algodão")
}
