import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const statusBadge = (status) => {
  const map = {
    active: { label: 'Active', cls: 'bg-yellow-50 text-yellow-700' },
    claimed: { label: 'Claimed', cls: 'bg-blue-50 text-blue-700' },
    returned: { label: 'Returned', cls: 'bg-green-50 text-green-700' },
    handed_to_admin: { label: 'Handed to Admin', cls: 'bg-blue-50 text-blue-700' },
    pending: { label: 'Pending Review', cls: 'bg-yellow-50 text-yellow-700' },
    approved: { label: 'Claim Approved', cls: 'bg-green-50 text-green-700' },
    rejected: { label: 'Claim Rejected', cls: 'bg-red-50 text-[#800020]' },
  };
  return map[status] || { label: status, cls: 'bg-gray-50 text-gray-600' };
};

const daysSince = (date) => Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

const LOST_FOLLOWUP_DAYS = 30;
const FOUND_HANDOVER_DAYS = 15;

const requestStatusBadge = (status) => ({
  pending: { label: 'Request Pending', cls: 'bg-yellow-50 text-yellow-700' },
  approved: { label: 'Request Approved', cls: 'bg-green-50 text-green-700' },
  rejected: { label: 'Request Rejected', cls: 'bg-red-50 text-[#800020]' },
}[status] || { label: status, cls: 'bg-gray-50 text-gray-600' });

const StarRow = ({ value, onChange, size = 22 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange && onChange(n)}
        className={`leading-none ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ fontSize: size, color: n <= value ? '#f59e0b' : '#e5d5d5' }}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
);

const MyReports = (props) => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [claimsReceived, setClaimsReceived] = useState({});
  const [myReviews, setMyReviews] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyClaimId, setBusyClaimId] = useState(null);
  const [rateTarget, setRateTarget] = useState(null);
  const [rateValue, setRateValue] = useState(5);
  const [rateComment, setRateComment] = useState('');
  const [rateSubmitting, setRateSubmitting] = useState(false);
  const [rateError, setRateError] = useState('');

  const [myRequests, setMyRequests] = useState([]);
  const [requestModal, setRequestModal] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = authHeaders();
      const [lostRes, foundRes, claimsRes, reviewsRes, matchesRes, requestsRes] = await Promise.all([
        fetch(`${API_BASE}/lost-items/my-items`, { headers }),
        fetch(`${API_BASE}/found-items/my-items`, { headers }),
        fetch(`${API_BASE}/claims/my-claims`, { headers }),
        fetch(`${API_BASE}/reviews/my-reviews`, { headers }),
        fetch(`${API_BASE}/matching/my-matches`, { headers }),
        fetch(`${API_BASE}/requests/my-requests`, { headers }),
      ]);
      const lostData = await lostRes.json();
      const foundData = await foundRes.json();
      const claimsData = await claimsRes.json();
      const reviewsData = await reviewsRes.json().catch(() => []);
      const matchesData = await matchesRes.json().catch(() => ({ matches: [] }));
      const requestsData = await requestsRes.json().catch(() => []);
      if (!lostRes.ok) throw new Error(lostData.message || 'Failed to load lost reports');
      if (!foundRes.ok) throw new Error(foundData.message || 'Failed to load found reports');
      if (!claimsRes.ok) throw new Error(claimsData.message || 'Failed to load claims');

      setLostItems(Array.isArray(lostData) ? lostData : []);
      setFoundItems(Array.isArray(foundData) ? foundData : []);
      setMyClaims(Array.isArray(claimsData) ? claimsData : []);
      setMyReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setMatches(Array.isArray(matchesData.matches) ? matchesData.matches : []);
      setMyRequests(Array.isArray(requestsData) ? requestsData : []);

      const foundList = Array.isArray(foundData) ? foundData : [];
      const claimEntries = await Promise.all(
        foundList.map(async (item) => {
          try {
            const res = await fetch(`${API_BASE}/claims/item/${item._id}`, { headers });
            if (!res.ok) return [item._id, []];
            const data = await res.json();
            return [item._id, Array.isArray(data) ? data : []];
          } catch {
            return [item._id, []];
          }
        })
      );
      setClaimsReceived(Object.fromEntries(claimEntries));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const hasReviewed = (claimId) => myReviews.some((r) => r.claim === claimId || r.claim?._id === claimId);

  const openRateModal = (claimId, personName) => {
    setRateTarget({ claimId, personName });
    setRateValue(5);
    setRateComment('');
    setRateError('');
  };

  const submitRating = async () => {
    if (!rateTarget) return;
    setRateSubmitting(true);
    setRateError('');
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ claimId: rateTarget.claimId, rating: rateValue, comment: rateComment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit review');
      setRateTarget(null);
      await loadAll();
    } catch (err) {
      setRateError(err.message);
    } finally {
      setRateSubmitting(false);
    }
  };

  const handleClaimDecision = async (claimId, status) => {
    setActionError('');
    setBusyClaimId(claimId);
    try {
      const response = await fetch(`${API_BASE}/claims/${claimId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update claim');
      await loadAll();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyClaimId(null);
    }
  };

  const requestFor = (itemId, type) => myRequests.find((r) => r.relatedItem === itemId && r.type === type);

  const openRequestModal = (type, item) => {
    setRequestModal({ type, itemId: item._id, itemName: item.itemName });
    setRequestMessage('');
    setRequestError('');
  };

  const submitItemRequest = async () => {
    if (!requestModal) return;
    if (!requestMessage.trim()) {
      setRequestError('Please write a short message for the admin.');
      return;
    }
    setRequestSubmitting(true);
    setRequestError('');
    try {
      const path = requestModal.type === 'lost_followup' ? '/requests/lost-followup' : '/requests/found-handover';
      const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ itemId: requestModal.itemId, message: requestMessage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send request');
      setRequestModal(null);
      await loadAll();
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setRequestSubmitting(false);
    }
  };

  const allMyReports = [
    ...lostItems.map(i => ({ ...i, __kind: 'Lost' })),
    ...foundItems.map(i => ({ ...i, __kind: 'Found' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const matchesByLostId = matches.reduce((acc, m) => {
    const id = m.lostItem._id;
    if (!acc[id]) acc[id] = [];
    acc[id].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-headings text-2xl md:text-3xl text-[#2e1a1a] mb-2 font-bold">My Reports & Claims</h1>
        <p className="text-[#c07080] text-sm md:text-base mb-8 font-medium">
          Track the status of your reported items and access secure chats for approved claims.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">{error}</div>
        )}
        {actionError && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">{actionError}</div>
        )}

        {loading ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080]">
            Loading your reports...
          </div>
        ) : (
          <>
            <h2 className="font-headings text-lg text-[#2e1a1a] mb-3 font-bold">Items I Reported</h2>
            {allMyReports.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080] mb-10">
                You haven't submitted any reports yet.
              </div>
            ) : (
              <div className="space-y-4 mb-10">
                {allMyReports.map((item) => {
                  const badge = statusBadge(item.status);
                  const claims = item.__kind === 'Found' ? (claimsReceived[item._id] || []) : [];
                  const pendingClaims = claims.filter(c => c.status === 'pending');
                  const approvedClaims = claims.filter(c => c.status === 'approved');
                  return (
                    <div key={item._id} className="bg-white p-6 rounded-2xl border border-[#e8d0d0] shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              item.__kind === 'Lost' ? 'bg-red-50 text-[#800020]' : 'bg-green-50 text-green-700'
                            }`}>
                              {item.__kind}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                          </div>
                          <h3 className="font-bold text-[#2e1a1a] text-lg">{item.itemName}</h3>
                          <p className="text-xs text-[#c07080] font-medium mt-1">
                            Status: <span className={`font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                          </p>
                        </div>
                        {item.__kind === 'Found' && claims.length > 0 && (
                          <span className="text-xs font-bold text-[#800020] bg-[#fff8f8] border border-[#e8d0d0] px-3 py-1.5 rounded-full">
                            {claims.length} claim{claims.length > 1 ? 's' : ''} received
                          </span>
                        )}
                      </div>

                      {item.__kind === 'Lost' && item.status === 'active' && daysSince(item.createdAt) >= LOST_FOLLOWUP_DAYS && (
                        <div className="mt-4 pt-4 border-t border-[#f5f0f0]">
                          {(() => {
                            const req = requestFor(item._id, 'lost_followup');
                            if (req) {
                              const rb = requestStatusBadge(req.status);
                              return (
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rb.cls}`}>{rb.label}</span>
                              );
                            }
                            return (
                              <button
                                onClick={() => openRequestModal('lost_followup', item)}
                                className="text-xs font-bold text-[#800020] bg-white border border-[#e8d0d0] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#fff0f0]">
                                This item has been lost for over 30 days — Request Follow-up
                              </button>
                            );
                          })()}
                        </div>
                      )}

                      {item.__kind === 'Found' && item.status === 'active' && daysSince(item.createdAt) >= FOUND_HANDOVER_DAYS && (
                        <div className="mt-4 pt-4 border-t border-[#f5f0f0]">
                          {(() => {
                            const req = requestFor(item._id, 'found_handover');
                            if (req) {
                              const rb = requestStatusBadge(req.status);
                              return (
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rb.cls}`}>{rb.label}</span>
                              );
                            }
                            return (
                              <button
                                onClick={() => openRequestModal('found_handover', item)}
                                className="text-xs font-bold text-[#800020] bg-white border border-[#e8d0d0] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#fff0f0]">
                                Deposit at Principal Office — Notify Admin
                              </button>
                            );
                          })()}
                        </div>
                      )}

                      {item.__kind === 'Found' && pendingClaims.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#f5f0f0] space-y-3">
                          {pendingClaims.map((claim) => (
                            <div key={claim._id} className="bg-[#fff8f8] rounded-xl p-4 border border-[#e8d0d0]">
                              <p className="text-sm font-bold text-[#2e1a1a]">{claim.claimedBy?.name || 'A student'} <span className="text-xs font-normal text-[#c07080]">({claim.claimedBy?.email})</span></p>
                              <p className="text-sm text-[#5a3a3a] mt-1">"{claim.proofDescription}"</p>
                              <div className="flex gap-2 mt-3">
                                <button
                                  disabled={busyClaimId === claim._id}
                                  onClick={() => handleClaimDecision(claim._id, 'approved')}
                                  className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg cursor-pointer disabled:opacity-50">
                                  ✓ Approve
                                </button>
                                <button
                                  disabled={busyClaimId === claim._id}
                                  onClick={() => handleClaimDecision(claim._id, 'rejected')}
                                  className="text-xs font-bold text-white bg-[#800020] hover:bg-[#a0002a] px-3 py-1.5 rounded-lg cursor-pointer disabled:opacity-50">
                                  ✕ Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.__kind === 'Lost' && (matchesByLostId[item._id] || []).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#f5f0f0]">
                          <p className="text-xs font-bold text-[#800020] mb-2">
                            💡 {(matchesByLostId[item._id] || []).length} possible match{(matchesByLostId[item._id] || []).length > 1 ? 'es' : ''} found
                          </p>
                          <div className="space-y-2">
                            {(matchesByLostId[item._id] || []).map((m) => (
                              <div key={m.foundItem._id} className="flex items-center justify-between bg-[#fff8f8] rounded-xl p-3 border border-[#e8d0d0] gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-[#2e1a1a] truncate">{m.foundItem.itemName}</p>
                                  <p className="text-xs text-[#c07080]">📍 {m.foundItem.location?.buildingName || 'Unknown location'} · {m.score}% match</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => props.onViewDetails && props.onViewDetails({ ...m.foundItem, __type: 'FOUND' })}
                                    className="text-xs font-bold text-[#800020] bg-white border border-[#e8d0d0] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#fff0f0]">
                                    View
                                  </button>
                                  <button
                                    onClick={() => props.onGoToFoundItems && props.onGoToFoundItems()}
                                    className="text-xs font-bold text-white bg-[#800020] hover:bg-[#a0002a] px-3 py-1.5 rounded-lg cursor-pointer">
                                    Go Claim It
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.__kind === 'Found' && approvedClaims.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#f5f0f0] space-y-2">
                          {approvedClaims.map((claim) => (
                            <div key={claim._id} className="flex items-center justify-between bg-[#fff8f8] rounded-xl p-3 border border-[#e8d0d0]">
                              <p className="text-sm text-[#2e1a1a]">
                                Given to <span className="font-bold">{claim.claimedBy?.name || 'the claimant'}</span>
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => props.onOpenChat && props.onOpenChat(claim._id, claim.claimedBy?.name || 'the claimant')}
                                  className="text-xs font-bold text-white bg-[#800020] hover:bg-[#a0002a] px-3 py-1.5 rounded-lg cursor-pointer">
                                  💬 Chat
                                </button>
                                {hasReviewed(claim._id) ? (
                                  <span className="text-xs font-bold text-green-700 self-center">✓ Reviewed</span>
                                ) : (
                                  <button
                                    onClick={() => openRateModal(claim._id, claim.claimedBy?.name || 'this student')}
                                    className="text-xs font-bold text-[#800020] bg-white border border-[#e8d0d0] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#fff0f0]">
                                    ⭐ Rate
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <h2 className="font-headings text-lg text-[#2e1a1a] mb-3 font-bold">Claims I've Made</h2>
            {myClaims.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080]">
                You haven't claimed any found items yet.
              </div>
            ) : (
              <div className="space-y-4">
                {myClaims.map((claim) => {
                  const badge = statusBadge(claim.status);
                  const finderName = claim.foundItem?.userId?.name;
                  return (
                    <div key={claim._id} className="bg-white p-6 rounded-2xl border border-[#e8d0d0] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-green-50 text-green-700">Claim</span>
                          <span className="text-xs text-gray-400">{formatDate(claim.createdAt)}</span>
                        </div>
                        <h3 className="font-bold text-[#2e1a1a] text-lg">{claim.foundItem?.itemName || 'Item'}</h3>
                        <p className="text-xs text-[#c07080] font-medium mt-1">
                          Status: <span className={`font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {claim.status === 'approved' ? (
                          <>
                            <button
                              onClick={() => props.onOpenChat && props.onOpenChat(claim._id, finderName)}
                              className="bg-[#800020] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:opacity-90 cursor-pointer flex items-center gap-2">
                              💬 Open Chat{finderName ? ` (${finderName})` : ''}
                            </button>
                            {hasReviewed(claim._id) ? (
                              <span className="text-xs font-bold text-green-700 px-2">✓ Reviewed</span>
                            ) : (
                              <button
                                onClick={() => openRateModal(claim._id, finderName || 'the finder')}
                                className="text-xs font-bold text-[#800020] bg-white border border-[#e8d0d0] px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#fff0f0]">
                                ⭐ Rate
                              </button>
                            )}
                          </>
                        ) : (
                          <button disabled className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed">
                            {claim.status === 'rejected' ? 'Claim Rejected' : 'Waiting for Approval'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {rateTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-headings text-xl font-bold text-[#2e1a1a] mb-1">Rate this exchange</h3>
            <p className="text-sm text-[#c07080] mb-4">How was your experience with {rateTarget.personName}?</p>

            <div className="flex justify-center mb-4">
              <StarRow value={rateValue} onChange={setRateValue} size={32} />
            </div>

            <textarea
              value={rateComment}
              onChange={(e) => setRateComment(e.target.value)}
              placeholder="Optional comment..."
              rows={3}
              className="w-full p-3 rounded-xl border border-[#e8d0d0] text-sm outline-none focus:border-[#800020] mb-3"
            />

            {rateError && <p className="text-sm text-red-600 mb-3">{rateError}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setRateTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e8d0d0] text-[#5a3a3a] font-bold text-sm cursor-pointer">
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={rateSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#800020] text-white font-bold text-sm cursor-pointer disabled:opacity-50">
                {rateSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}

      {requestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-headings text-xl font-bold text-[#2e1a1a] mb-1">
              {requestModal.type === 'lost_followup' ? 'Request Follow-up' : 'Deposit at Principal Office'}
            </h3>
            <p className="text-sm text-[#c07080] mb-4">
              {requestModal.type === 'lost_followup'
                ? `Let the admin know about "${requestModal.itemName}".`
                : `Tell the admin you're depositing "${requestModal.itemName}" at the Principal Office.`}
            </p>

            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              className="w-full p-3 rounded-xl border border-[#e8d0d0] text-sm outline-none focus:border-[#800020] mb-3"
            />

            {requestError && <p className="text-sm text-red-600 mb-3">{requestError}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setRequestModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e8d0d0] text-[#5a3a3a] font-bold text-sm cursor-pointer">
                Cancel
              </button>
              <button
                onClick={submitItemRequest}
                disabled={requestSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#800020] text-white font-bold text-sm cursor-pointer disabled:opacity-50">
                {requestSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;