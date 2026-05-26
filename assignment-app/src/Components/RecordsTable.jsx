import { useMemo } from "react";
import PropTypes from "prop-types";

export default function RecordsTable({ records, isLoading }) {
  const columns = useMemo(() => {
    if (!records || records.length === 0) return [];
    const first = records[0];
    if (!first || typeof first !== "object") return [];
    return Object.keys(first);
  }, [records]);

  if (isLoading) return null;
  if (!records || records.length === 0 || columns.length === 0) return null;

  return (
    <div style={{ marginTop: 16, overflowX: "auto" }}>
      <table
        className="table table-striped"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "0px solid #ddd",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: "left",
                  padding: 5,
                  borderBottom: "1px solid #ddd",
                  background: "#ffffff",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {records.map((row, idx) => (
            <tr key={row?.id ?? idx}>
              {columns.map((col) => (
                <td
                  key={col}
                  style={{ padding: 5, borderBottom: "1px solid #eee" }}
                >
                  {String(row?.[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

RecordsTable.propTypes = {
  records: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
