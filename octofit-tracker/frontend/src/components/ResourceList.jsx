function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  if (Array.isArray(value)) {
    return value.length ? value.map(displayValue).join(', ') : '—'
  }
  if (typeof value === 'object') {
    const label = value.name ?? value.username ?? value.title ?? value.email
    return label ?? value._id ?? JSON.stringify(value)
  }
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value)) && value.includes('T')) {
    return new Date(value).toLocaleString()
  }
  return String(value)
}

function ResourceList({ title, records, loading, error, onRetry }) {
  const columns = [...new Set(records.flatMap((record) => Object.keys(record)))]
    .filter((key) => !['_id', '__v'].includes(key))

  return (
    <section aria-labelledby="resource-heading">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
        <div>
          <p className="eyebrow mb-1">Octofit Tracker</p>
          <h1 className="h2 mb-0" id="resource-heading">{title}</h1>
        </div>
        {!loading && !error && (
          <span className="badge rounded-pill text-bg-light">{records.length} records</span>
        )}
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2 text-secondary" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Loading {title.toLowerCase()}…
        </div>
      )}
      {error && (
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
          <span>{error}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={onRetry} type="button">
            Try again
          </button>
        </div>
      )}
      {!loading && !error && records.length === 0 && (
        <div className="empty-state rounded-4 p-5 text-center">
          <h2 className="h5">No {title.toLowerCase()} yet</h2>
          <p className="mb-0 text-secondary">Data will appear here when it is available.</p>
        </div>
      )}
      {!loading && !error && records.length > 0 && (
        <div className="table-responsive resource-table-wrap">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th className="text-capitalize" key={column} scope="col">
                    {column.replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record._id ?? record.id ?? index}>
                  {columns.map((column) => (
                    <td key={column}>{displayValue(record[column])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ResourceList
