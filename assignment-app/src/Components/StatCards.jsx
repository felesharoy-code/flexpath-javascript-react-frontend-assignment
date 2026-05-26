import { useMemo } from "react";
import PropTypes from "prop-types";

const numberFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }); // en-US commas 【2-762580】

function toNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function avg(nums) {
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function med(nums) {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  // odd -> middle; even -> avg of two middles 【1-26686e】
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function formatValue(v) {
  if (v === null || v === undefined) return "—";
  return numberFmt.format(v);
}

function pluralize(n, singular, plural) {
  return n === 1 ? singular : plural;
}

export default function StatCards({ records, isLoading }) {
  // ✅ EXACT field names from your API payload
  const metrics = useMemo(
    () => [
      {
        id: "appUsage",
        title: "App Usage Time (min/day)",
        key: "App Usage Time (min/day)",
        unitSingular: "Minute",
        unitPlural: "Minutes",
      },
      {
        id: "screenOn",
        title: "Screen On Time (hours/day)",
        key: "Screen On Time (hours/day)",
        unitSingular: "Hour",
        unitPlural: "Hours",
      },
      {
        id: "appsInstalled",
        title: "Number of Apps Installed",
        key: "Number of Apps Installed",
        unitSingular: "App",
        unitPlural: "Apps",
      },
      {
        id: "age",
        title: "Age",
        key: "Age",
        unitSingular: "Year Old",
        unitPlural: "Years Old",
      },
    ],
    [],
  );

  // Compute stats whenever records changes 【3-d43859】
  const stats = useMemo(() => {
    return metrics.map((m) => {
      const values = (records || [])
        .map((r) => toNumber(r?.[m.key]))
        .filter((n) => n !== null);

      const average = avg(values);
      const median = med(values);

      return { ...m, average, median };
    });
  }, [metrics, records]); // 【3-d43859】

  return (
    <div className="card-group text-center">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 100,
        }}
      >
        {stats.map((s) => {
          const avgText =
            isLoading || s.average === null
              ? isLoading
                ? "Loading..."
                : "—"
              : `${formatValue(s.average)} ${pluralize(s.average, s.unitSingular, s.unitPlural)}`;

          const medText =
            isLoading || s.median === null
              ? isLoading
                ? "Loading..."
                : "—"
              : `${formatValue(s.median)} ${pluralize(s.median, s.unitSingular, s.unitPlural)}`;

          return (
            <div
              key={s.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 10 }}>{s.title}</div>

              <div style={{ display: "grid", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Average</span>
                  <span style={{ fontWeight: 700 }}>{avgText}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Median</span>
                  <span style={{ fontWeight: 700 }}>{medText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

StatCards.propTypes = {
  records: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
