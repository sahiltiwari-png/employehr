import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getLeaveRequests, LeaveRequest } from "@/api/leaves";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Declined", value: "rejected" },
  { label: "Pending", value: "applied" },
];

const leaveTypeOptions = [
  { label: "All", value: "all" },
  { label: "Sick", value: "sick" },
  { label: "Casual", value: "casual" },
  { label: "Earned", value: "earned" },
];

const TrackLeaveRequest = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("all");
  const [leaveType, setLeaveType] = useState("all");
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  // Fetch when filters change
  useEffect(() => {
    const id = (user as any)?._id || (user as any)?.id;
    if (id) {
      fetchRequests(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, leaveType]);

  // Fetch once the user is available
  useEffect(() => {
    const id = (user as any)?._id || (user as any)?.id;
    if (id) {
      fetchRequests(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRequests = async (p: number) => {
    try {
      const id = (user as any)?._id || (user as any)?.id;
      if (!id) return;
      setLoading(true);
      const res = await getLeaveRequests(p, limit, status !== "all" ? status : undefined, [id]);
      const filtered = leaveType === "all" ? res.items : res.items.filter((i) => i.leaveType === leaveType);
      setRequests(filtered);
      setTotal(res.total);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) fetchRequests(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) fetchRequests(page + 1);
  };

  return (
    <div className="p-4 lg:p-6" style={{ fontFamily: "Montserrat" }}>
      <h1 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: "#2C373B" }}>Track Leave request</h1>

      <div className="bg-white rounded-2xl shadow-md border p-4 lg:p-6">
        {/* Header with avatar, name and filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {(user as any)?.profilePhotoUrl || (user as any)?.profileImage ? (
                <AvatarImage src={(user as any)?.profilePhotoUrl || (user as any)?.profileImage} alt={`${(user as any)?.firstName || ""} ${(user as any)?.lastName || ""}`} />
              ) : (
                <AvatarFallback>
                  <User className="h-4 w-4 text-gray-500" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-semibold" style={{ color: "#2C373B" }}>{(user as any)?.firstName || (user as any)?.name || ""} {(user as any)?.lastName || ""}</div>
              <div className="text-sm text-gray-500">{(user as any)?.designation || ""}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40 rounded-lg border" style={{ color: "#2C373B" }}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger className="w-44 rounded-lg border" style={{ color: "#2C373B" }}>
                <SelectValue placeholder="Leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button className="text-gray-400" onClick={() => { setStatus("all"); setLeaveType("all"); fetchRequests(1); }}>Clear filters</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#2C373B] text-white text-left">
                <th className="px-4 py-3">Leave type</th>
                <th className="px-4 py-3">Start date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Total days</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Add Remark</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center">Loading...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center" style={{ color: "#2C373B" }}>No leave requests found</td>
                </tr>
              ) : (
                requests.map((req) => {
                  const start = new Date(req.startDate);
                  const end = new Date(req.endDate);
                  const startFmt = start.toLocaleDateString(undefined, { day: "numeric", month: "long" });
                  const endFmt = end.toLocaleDateString(undefined, { day: "numeric", month: "long" });
                  const statusColor = req.status === "approved" ? "text-emerald-600" : req.status === "rejected" ? "text-red-600" : "text-yellow-600";
                  const rowBg = req.status === "approved" ? "bg-emerald-50" : req.status === "rejected" ? "bg-rose-50" : "bg-amber-50";
                  return (
                    <tr key={req._id} className={`border-b ${rowBg}`}>
                      <td className="px-4 py-3 capitalize">{req.leaveType}</td>
                      <td className="px-4 py-3">{startFmt}</td>
                      <td className="px-4 py-3">{endFmt}</td>
                      <td className="px-4 py-3" style={{ color: "#2C373B" }}>{req.reason}</td>
                      <td className="px-4 py-3">{req.days} days</td>
                      <td className={`px-4 py-3 font-medium ${statusColor}`}>
                        {req.status === "applied" ? "Pending" : req.status === "rejected" ? "Declined" : req.status === "approved" ? "Approved" : req.status}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{req.remarks || "-"}</td>
                      <td className="px-4 py-3">
                        {req.status === "applied" ? (
                          <button className="text-emerald-600 hover:underline">Cancel request</button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Prev</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-md" onClick={handlePrev} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 rounded bg-gray-100">{page}</span>
            <Button variant="outline" className="rounded-md" onClick={handleNext} disabled={page >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Next</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackLeaveRequest;