import PropTypes from "prop-types";
import SearchButton from "./SearchButton";

export default function FilteredSearch({
  filterTypes,
  filterType,
  keyword,
  onFilterTypeChange,
  onKeywordChange,
  onSubmit,
  isLoading,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <div className="col-12">
        <label htmlFor="filterType" style={{ fontWeight: 600 }}>
          Select Data Point to Filter Search By
        </label>

        <select
          className="form-select"
          id="filterType"
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
          disabled={isLoading}
          style={{ padding: 10, width: "300px" }}
        >
          {filterTypes.length === 0 ? (
            <option value="">(No filter types provided)</option>
          ) : (
            filterTypes.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="keyword" className="form-label"></label>

        <input
          id="keyword"
          type="text"
          className="form-control"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Search by Keyword"
          disabled={isLoading}
          style={{ padding: 10, width: "300px" }}
        />
      </div>

      <div>
        <SearchButton disabled={isLoading || !filterType} />
      </div>
    </form>
  );
}

FilteredSearch.propTypes = {
  filterTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterType: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  onFilterTypeChange: PropTypes.func.isRequired,
  onKeywordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
