export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  // Apenas exibe o erro no console em ambiente de desenvolvimento, sem enviar dados para servidores externos.
  if (typeof window !== "undefined" && import.meta.env.DEV) {
    console.error("[Erro Reportado Localmente]:", error, context);
  }
}