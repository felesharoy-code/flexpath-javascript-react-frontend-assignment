import { useMemo, useState } from "react";
import FilteredSearch from "../components/FilteredSearch";
import StatCards from "../components/StatCards";
import RecordsTable from "../components/RecordsTable";

export default function SearchPage() {
  const filterTypes = ["gender", "operatingSystem", "model", "behaviorclass"];
  const apiBaseUrl = "/api/data/search";

  const [filterType, setFilterType] = useState(() => {
    return localStorage.getItem("filterType") || filterTypes[0] || "";
  });

  const [keyword, setKeyword] = useState(() => {
    return localStorage.getItem("keyword") || "";
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("searchResults");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const statusMessage = useMemo(() => {
    if (isLoading) return "Loading Records...";
    if (!records.length) return "No Records To Display";
    return `Displaying ${records.length} Records`;
  }, [isLoading, records]);

  async function onSearch(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("filterType", filterType);
      params.set("keyword", keyword);

      const response = await fetch(`${apiBaseUrl}?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(
          `Search failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      const nextRecords = Array.isArray(data) ? data : (data?.records ?? []);

      setRecords(nextRecords);

      // ✅ SAVE STATE
      localStorage.setItem("searchResults", JSON.stringify(nextRecords));
      localStorage.setItem("filterType", filterType);
      localStorage.setItem("keyword", keyword);
    } catch (err) {
      setRecords([]);
      setErrorMsg(err?.message || "Something went wrong while searching.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: 16 }}>
      <FilteredSearch
        filterTypes={filterTypes}
        filterType={filterType}
        keyword={keyword}
        onFilterTypeChange={setFilterType}
        onKeywordChange={setKeyword}
        onSubmit={onSearch}
        isLoading={isLoading}
      />

      <div style={{ minHeight: 24, fontWeight: 600, marginTop: 8 }}>
        {statusMessage}
      </div>
      <br></br>
      {/* Stat cards below search menu */}
      <StatCards records={records} isLoading={isLoading} />

      {/* ✅ ERROR MESSAGE — ABOVE TABLE */}
      {errorMsg && (
        <div
          style={{
            marginTop: 16,
            marginBottom: 8,
            color: "crimson",
            fontWeight: 600,
          }}
        >
          {errorMsg}
        </div>
      )}
      <br></br>
      {/* Results table */}
      <RecordsTable records={records} isLoading={isLoading} />
    </div>
  );
}
