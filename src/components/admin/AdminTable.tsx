import type { ReactNode } from "react";

type AdminTableProps = {
  children: ReactNode;
  columns: string[];
};

export function AdminTable({ children, columns }: AdminTableProps) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
