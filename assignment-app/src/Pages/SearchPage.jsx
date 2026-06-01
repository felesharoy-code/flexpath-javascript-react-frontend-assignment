import { useMemo, useState } from "react";
import FilteredSearch from "../components/FilteredSearch";
import StatCards from "../components/StatCards";
import RecordsTable from "../components/RecordsTable";

export default function SearchPage() {
  // All possible filter types for the dropdown
  const filterTypes = ["gender", "operatingSystem", "model", "behaviorclass"];

  // Base URL for the API endpoint
  const apiBaseUrl = "/api/data/search";

  // --- STATE INITIALIZATION (with localStorage hydration) ---

  // Selected filter type (saved between page reloads)
  const [filterType, setFilterType] = useState(() => {
    return localStorage.getItem("filterType") || filterTypes[0] || "";
  });

  // Search keyword (also saved between reloads)
  const [keyword, setKeyword] = useState(() => {
    return localStorage.getItem("keyword") || "";
  });

  // Search results (restored from previous session)
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("searchResults");
    return saved ? JSON.parse(saved) : [];
  });

  // Loading + error UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- COMPUTED STATUS MESSAGE ---
  // Memoized so it only recalculates when loading or records change
  const statusMessage = useMemo(() => {
    if (isLoading) return "Loading Records...";
    if (!records.length) return "No Records To Display";
    return `Displaying ${records.length} Records`;
  }, [isLoading, records]);

  // --- SEARCH HANDLER (MAIN LOGIC) ---
  async function onSearch(e) {
    e.preventDefault(); // Prevent form from refreshing the page
    setErrorMsg(""); // Clear previous errors
    setIsLoading(true); // Show loading state

    try {
      // Build query string: ?filterType=...&keyword=...
      const params = new URLSearchParams();
      params.set("filterType", filterType);
      params.set("keyword", keyword);

      // Perform GET request to API
      const response = await fetch(`${apiBaseUrl}?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      // Handle HTTP errors (fetch won't throw automatically)
      if (!response.ok) {
        throw new Error(
          `Search failed: ${response.status} ${response.statusText}`,
        );
      }

      // Parse JSON response
      const data = await response.json();

      // Normalize data shape (API may return array or { records: [...] })
      const nextRecords = Array.isArray(data) ? data : (data?.records ?? []);

      // Update UI with new results
      setRecords(nextRecords);

      // --- SAVE STATE TO LOCALSTORAGE ---
      localStorage.setItem("searchResults", JSON.stringify(nextRecords));
      localStorage.setItem("filterType", filterType);
      localStorage.setItem("keyword", keyword);
    } catch (err) {
      // On error: clear results + show message
      setRecords([]);
      setErrorMsg(err?.message || "Something went wrong while searching.");
    } finally {
      // Always stop loading spinner
      setIsLoading(false);
    }
  }

  // --- RENDER UI ---
  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: 16 }}>
      {/* Search bar component (controlled by parent state) */}
      <FilteredSearch
        filterTypes={filterTypes}
        filterType={filterType}
        keyword={keyword}
        onFilterTypeChange={setFilterType}
        onKeywordChange={setKeyword}
        onSubmit={onSearch}
        isLoading={isLoading}
      />

      {/* Status message (loading / empty / count) */}
      <div style={{ minHeight: 24, fontWeight: 600, marginTop: 8 }}>
        {statusMessage}
      </div>

      <br />

      {/* Summary cards based on results */}
      <StatCards records={records} isLoading={isLoading} />

      {/* Error message (only shown when errorMsg is truthy) */}
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

      <br />

      {/* Table of results */}
      <RecordsTable records={records} isLoading={isLoading} />
    </div>
  );
}
