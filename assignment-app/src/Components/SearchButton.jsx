import PropTypes from "prop-types";

export default function SearchButton({ disabled, label = "Search" }) {
  return (
    <button
      type="submit"
      className="btn btn-outline-secondary"
      disabled={disabled}
      style={{
        padding: "10px 14px",
        width: "300px",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

SearchButton.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
