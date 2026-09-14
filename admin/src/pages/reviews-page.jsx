import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "../adminApi";

const statusStyle = (status) => ({
  pending:   { bg: "#fff7ed", color: "#c2410c" },
  published: { bg: "#f0fdf4", color: "#16a34a" },
}[status] || { bg: "#f5f0f0", color: "#6b4848" });

const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch('/testimonials/admin');
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const publish = async (review) => {
    setBusyId(review._id);
    try {
      await adminFetch(`/testimonials/${review._id}/publish`, { method: 'PUT' });
      setReviews(prev => prev.map(r => r._id === review._id ? { ...r, status: 'published' } : r));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const unpublish = async (review) => {
    setBusyId(review._id);
    try {
      await adminFetch(`/testimonials/${review._id}/unpublish`, { method: 'PUT' });
      setReviews(prev => prev.map(r => r._id === review._id ? { ...r, status: 'pending' } : r));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (review) => {
    if (!window.confirm(`Delete this review by ${review.user?.name || 'this student'}? This cannot be undone.`)) return;
    setBusyId(review._id);
    try {
      await adminFetch(`/testimonials/${review._id}`, { method: 'DELETE' });
      setReviews(prev => prev.filter(r => r._id !== review._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const publishedCount = reviews.filter(r => r.status === 'published').length;
  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(74,0,16,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "#2e1a1a", margin: 0 }}>Student Reviews</h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 4 }}>
            {pendingCount} pending, {publishedCount} published on the "Student Success Stories" section of the website.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>{error}</div>
      )}

      {loading ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>No reviews submitted yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fdf6f7", borderBottom: "1px solid #f0e0e0" }}>
                {["Student", "Rating", "Review", "Date", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#c07080", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => {
                const s = statusStyle(r.status);
                return (
                  <tr key={r._id} style={{ borderBottom: "1px solid #fdf0f0" }}>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#2e1a1a" }}>
                      {r.user?.name || 'Deleted user'}
                      <div style={{ fontSize: 11, color: "#c07080" }}>{r.user?.department}</div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#c07080", whiteSpace: "nowrap" }}>{stars(r.rating)}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848", maxWidth: 320 }}>{r.message}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#c07080", whiteSpace: "nowrap" }}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, textTransform: "capitalize" }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minWidth: 150 }}>
                        {r.status === 'pending' ? (
                          <button
                            disabled={busyId === r._id}
                            onClick={() => publish(r)}
                            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            disabled={busyId === r._id}
                            onClick={() => unpublish(r)}
                            style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#b45309", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          disabled={busyId === r._id}
                          onClick={() => remove(r)}
                          style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
