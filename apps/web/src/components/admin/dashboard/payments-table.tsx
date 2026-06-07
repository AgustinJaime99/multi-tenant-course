import type { PaymentDto } from "@app/shared";
import { formatDate, formatPrice } from "@/lib/utils";

interface Props {
  payments: PaymentDto[];
}

export function PaymentsTable({ payments }: Props) {
  return (
    <div className="card overflow-hidden">
      <h2 className="border-b border-ink-800 px-5 py-4 font-semibold">Pagos recientes</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900/60 text-ink-200">
            <tr>
              <th className="px-5 py-3">Proveedor</th>
              <th className="px-5 py-3">Importe</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-ink-800">
                <td className="px-5 py-3">{p.provider}</td>
                <td className="px-5 py-3">{formatPrice(p.amountCents, p.currency)}</td>
                <td className="px-5 py-3">{p.status}</td>
                <td className="px-5 py-3 text-ink-200">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
