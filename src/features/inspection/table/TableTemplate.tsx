// src/features/inspection/table/TableTemplate.tsx
import { Button } from "@/components/ui/button";
import { tableData } from "./data";

function getStatusBadge(status: string) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium";
  const normalized = status.toLowerCase();

  if (normalized === "done") {
    return <span className={`${base} bg-green-100 text-green-800`}>Done</span>;
  }
  if (normalized === "in process") {
    return (
      <span className={`${base} bg-yellow-100 text-yellow-800`}>
        In Process
      </span>
    );
  }
  if (normalized === "not started") {
    return (
      <span className={`${base} bg-gray-100 text-gray-800`}>Not Started</span>
    );
  }
  return <span className={`${base} bg-blue-100 text-blue-800`}>{status}</span>;
}

function getApprovalBadge(approval: string) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium";
  const normalized = approval.toLowerCase();

  if (normalized === "approved") {
    return (
      <span className={`${base} bg-green-100 text-green-800`}>Approved</span>
    );
  }
  if (normalized === "pending") {
    return (
      <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>
    );
  }
  if (normalized === "rejected") {
    return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
  }
  return (
    <span className={`${base} bg-gray-100 text-gray-800`}>{approval}</span>
  );
}

interface TableTemplateProps {
  type: string;
}

export default function TableTemplate({ type }: TableTemplateProps) {
  const rows = tableData[type] ?? [];

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Establishment
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Approval
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row) => (
              <tr
                key={`${type}-${row.id}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {row.name}
                      </div>
                      <div className="text-sm text-gray-500">{row.address}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(row.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {row.status.toLowerCase() === "done" &&
                    getApprovalBadge(row.approval)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {row.status.toLowerCase() === "done" && (
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="bg-white p-8 text-center">
          <p className="text-gray-500">
            No establishments found for this category
          </p>
        </div>
      )}
    </div>
  );
}
