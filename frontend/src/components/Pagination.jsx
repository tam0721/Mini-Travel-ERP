export default function Pagination({ page, totalPages, setPage }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="pagination">
      <button 
        className="page-btn" 
        disabled={page <= 1} 
        onClick={() => setPage(p => p - 1)}
      >
        ‹
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button 
          key={p} 
          className={`page-btn ${page === p ? 'active' : ''}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}

      <button 
        className="page-btn" 
        disabled={page >= totalPages} 
        onClick={() => setPage(p => p + 1)}
      >
        ›
      </button>
      
      <span className="page-info">Trang {page}/{totalPages}</span>
    </div>
  )
}