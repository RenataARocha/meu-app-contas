// src/components/ModalPagamento.tsx
// Modal simples para informar a data de pagamento

"use client";

import { useState } from "react";
import { X, CalendarCheck } from "lucide-react";

interface Props {
    onFechar: () => void;
    onConfirmar: (data: string) => void;
}

export function ModalPagamento({ onFechar, onConfirmar }: Props) {
    const hoje = new Date().toISOString().split("T")[0];
    const [data, setData] = useState(hoje);
    const [erro, setErro] = useState("");

    function confirmar() {
        if (!data) { setErro("Informe a data de pagamento"); return; }
        onConfirmar(data);
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            <div className="w-full max-w-xs bg-dark-800 rounded-2xl border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarCheck size={18} className="text-brand-500" />
                        <h3 className="text-sm font-semibold">Data do pagamento</h3>
                    </div>
                    <button onClick={onFechar} className="text-muted-foreground hover:text-foreground">
                        <X size={18} />
                    </button>
                </div>

                <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">
                        Quando foi pago?
                    </label>
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => { setData(e.target.value); setErro(""); }}
                        max={hoje}
                        className={`w-full px-4 py-3 bg-dark-700 border rounded-xl text-sm
              focus:outline-none focus:ring-1
              ${erro ? "border-destructive focus:ring-destructive" : "border-white/5 focus:ring-brand-500"}`}
                    />
                    {erro && <p className="text-xs text-destructive mt-1">{erro}</p>}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onFechar}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs text-muted-foreground"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmar}
                        className="flex-1 py-2.5 rounded-xl bg-brand-gradient text-xs font-semibold text-white"
                    >
                        Confirmar ✓
                    </button>
                </div>
            </div>
        </div>
    );
}