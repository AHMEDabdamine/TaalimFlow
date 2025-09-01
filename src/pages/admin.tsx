import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import {
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  Shield,
  RefreshCw,
} from "lucide-react";

const ADMIN_PASSWORD = "school";

interface Lead {
  id: number;
  name: string;
  email: string;
  school_name: string;
  message: string;
  status: string;
  source: string;
  created_at: string;
}

interface DownloadLinks {
  mobile: {
    ios: { url: string; enabled: boolean; comingSoon: boolean };
    android: { url: string; enabled: boolean; comingSoon: boolean };
  };
  desktop: {
    windows: { url: string; enabled: boolean; comingSoon: boolean };
    mac: { url: string; enabled: boolean; comingSoon: boolean };
    linux: { url: string; enabled: boolean; comingSoon: boolean };
  };
  lastUpdated: string;
}

interface PricingPlan {
  id: string;
  price: string;
  setup: string | null;
  yearlyPrice: string | null;
}

interface PricingData {
  plans: PricingPlan[];
  lastUpdated: string;
}

const AdminPasswordPrompt = ({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simulate a small delay for security
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onAuthenticated();
      } else {
        setError("كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.");
        setPassword("");
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">منطقة الإدارة المحمية</CardTitle>
            <CardDescription>
              يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم الإدارية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  "دخول"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                هذه منطقة محمية. الوصول مقيد للمديرين المخولين فقط.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [linksSaving, setLinksSaving] = useState(false);
  const [linksMessage, setLinksMessage] = useState("");
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingMessage, setPricingMessage] = useState("");
  const leadsPerPage = 10;

  // Check if user is already authenticated (session storage)
  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Handle authentication
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("admin_authenticated", "true");
  };

  // Update document direction when language changes
  useEffect(() => {
    const isRTL = i18n.language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Load leads and download links
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        // Load leads
        const leadsResponse = await fetch("/api/leads");
        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json();
          setLeads(leadsData);
          setFilteredLeads(leadsData);
        } else {
          setLeads([]);
          setFilteredLeads([]);
        }

        // Load download links
        const linksResponse = await fetch("/api/download-links");
        if (linksResponse.ok) {
          const linksData = await linksResponse.json();
          setDownloadLinks(linksData);
        }

        // Load pricing data
        const pricingResponse = await fetch("/api/pricing");
        if (pricingResponse.ok) {
          const pricingDataResult = await pricingResponse.json();
          setPricingData(pricingDataResult);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setLeads([]);
        setFilteredLeads([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated]);

  // Filter and search leads
  useEffect(() => {
    let filtered = leads;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof Lead];
      let bValue = b[sortField as keyof Lead];

      if (sortField === "created_at") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [leads, searchTerm, statusFilter, sortField, sortDirection]);

  // Update lead status via API
  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedLeads = leads.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        );
        setLeads(updatedLeads);
        setFilteredLeads(updatedLeads);
        console.log("Lead status updated");
      } else {
        console.error("Failed to update lead status");
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  // Handle download links save
  const handleSaveDownloadLinks = async (updatedLinks: DownloadLinks) => {
    setLinksSaving(true);
    setLinksMessage("");
    
    try {
      const response = await fetch("/api/download-links", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLinks),
      });

      if (response.ok) {
        const savedLinks = await response.json();
        setDownloadLinks(savedLinks);
        setLinksMessage(t("admin.downloadLinks.saved"));
        setTimeout(() => setLinksMessage(""), 3000);
      } else {
        setLinksMessage(t("admin.downloadLinks.error"));
      }
    } catch (error) {
      console.error("Error saving download links:", error);
      setLinksMessage(t("admin.downloadLinks.error"));
    } finally {
      setLinksSaving(false);
    }
  };

  // Handle pricing save
  const handlePricingSave = async (updatedPricing: PricingData) => {
    setPricingSaving(true);
    setPricingMessage("");
    
    try {
      const response = await fetch("/api/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPricing),
      });

      if (response.ok) {
        const result = await response.json();
        setPricingData(result);
        setPricingMessage("Pricing data saved successfully!");
        setTimeout(() => setPricingMessage(""), 3000);
      } else {
        setPricingMessage("Error saving pricing data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving pricing data:", error);
      setPricingMessage("Connection error occurred.");
    } finally {
      setPricingSaving(false);
    }
  };

  // Export leads to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "School Name",
      "Message",
      "Status",
      "Source",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          `"${lead.name}"`,
          `"${lead.email}"`,
          `"${lead.school_name}"`,
          `"${lead.message.replace(/"/g, '""')}"`,
          `"${lead.status}"`,
          `"${lead.source}"`,
          `"${new Date(lead.created_at).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `taalimflow-leads-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Migrate leads to ensure they have all required fields

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const endIndex = startIndex + leadsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "qualified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const isRTL = i18n.language === "ar";

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return <AdminPasswordPrompt onAuthenticated={handleAuthenticated} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg">{t("admin.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("admin.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("admin.description")}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("leads")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "leads"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {t("admin.stats.totalLeads")}
                </button>
                <button
                  onClick={() => setActiveTab("download-links")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "download-links"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {t("admin.downloadLinks.title")}
                </button>
                <button
                  onClick={() => setActiveTab("pricing")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "pricing"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  💰 Pricing Management
                </button>
              </nav>
            </div>
          </div>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === "leads" ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {leads.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("admin.stats.totalLeads")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {leads.filter((lead) => lead.status === "new").length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("admin.stats.newLeads")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {
                        leads.filter((lead) => lead.status === "contacted")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("admin.stats.contacted")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {
                        leads.filter(
                          (lead) =>
                            new Date(lead.created_at).toDateString() ===
                            new Date().toDateString()
                        ).length
                      }
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("admin.stats.today")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search
                      className={`absolute ${
                        isRTL ? "right-3" : "left-3"
                      } top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`}
                    />
                    <Input
                      placeholder={t("admin.search.placeholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`${isRTL ? "pr-10" : "pl-10"}`}
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">{t("admin.filter.allStatus")}</option>
                    <option value="new">{t("admin.filter.new")}</option>
                    <option value="contacted">
                      {t("admin.filter.contacted")}
                    </option>
                    <option value="qualified">
                      {t("admin.filter.qualified")}
                    </option>
                    <option value="closed">{t("admin.filter.closed")}</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {t("admin.export")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        className={`px-6 py-3 text-${
                          isRTL ? "right" : "left"
                        } text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                      >
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          {t("admin.table.name")}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th
                        className={`px-6 py-3 text-${
                          isRTL ? "right" : "left"
                        } text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                      >
                        <button
                          onClick={() => handleSort("email")}
                          className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          {t("admin.table.email")}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th
                        className={`px-6 py-3 text-${
                          isRTL ? "right" : "left"
                        } text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                      >
                        <button
                          onClick={() => handleSort("school_name")}
                          className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          {t("admin.table.school")}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th
                        className={`px-6 py-3 text-${
                          isRTL ? "right" : "left"
                        } text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                      >
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          {t("admin.table.status")}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th
                        className={`px-6 py-3 text-${
                          isRTL ? "right" : "left"
                        } text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                      >
                        <button
                          onClick={() => handleSort("created_at")}
                          className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          {t("admin.table.date")}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th
                        className={`px-6 py-3 text-${
                          isRTL ? "right" : "left"
                        } text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
                      >
                        {t("admin.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {lead.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {lead.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {lead.school_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              updateLeadStatus(lead.id, e.target.value)
                            }
                            className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusBadgeColor(
                              lead.status
                            )}`}
                          >
                            <option value="new">{t("admin.status.new")}</option>
                            <option value="contacted">
                              {t("admin.status.contacted")}
                            </option>
                            <option value="qualified">
                              {t("admin.status.qualified")}
                            </option>
                            <option value="closed">
                              {t("admin.status.closed")}
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(lead.created_at).toLocaleDateString(
                            i18n.language === "ar"
                              ? "ar-DZ"
                              : i18n.language === "fr"
                              ? "fr-FR"
                              : "en-US"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(`mailto:${lead.email}`)
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {t("admin.pagination.showing", {
                        start: startIndex + 1,
                        end: Math.min(endIndex, filteredLeads.length),
                        total: filteredLeads.length,
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Detail Modal */}
          {selectedLead && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("admin.modal.title")}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLead(null)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("admin.modal.name")}
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedLead.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("admin.modal.email")}
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedLead.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("admin.modal.school")}
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedLead.school_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("admin.modal.message")}
                    </label>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedLead.message}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("admin.modal.status")}
                    </label>
                    <Badge className={getStatusBadgeColor(selectedLead.status)}>
                      {t(`admin.status.${selectedLead.status}`)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("admin.modal.date")}
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedLead.created_at).toLocaleString(
                        i18n.language === "ar"
                          ? "ar-DZ"
                          : i18n.language === "fr"
                          ? "fr-FR"
                          : "en-US"
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() =>
                        window.open(`mailto:${selectedLead.email}`)
                      }
                      className="flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      {t("admin.modal.sendEmail")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
            </>
          ) : activeTab === "download-links" ? (
            // Download Links Management Tab
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.downloadLinks.title")}</CardTitle>
                  <CardDescription>
                    {t("admin.downloadLinks.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {linksMessage && (
                    <div className={`p-3 rounded-lg ${
                      linksMessage.includes("success") || linksMessage.includes("بنجاح") || linksMessage.includes("succès")
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {linksMessage}
                    </div>
                  )}
                  
                  {downloadLinks && (
                    <DownloadLinksForm 
                      links={downloadLinks}
                      onSave={handleSaveDownloadLinks}
                      isSaving={linksSaving}
                      t={t}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            // Pricing Management Tab
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>💰 Pricing Management</CardTitle>
                  <CardDescription>
                    Adjust pricing for different plans
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {pricingMessage && (
                    <div className={`p-3 rounded-lg ${
                      pricingMessage.includes("success") || pricingMessage.includes("successfully")
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {pricingMessage}
                    </div>
                  )}
                  
                  {pricingData && (
                    <PricingForm 
                      pricingData={pricingData}
                      onSave={handlePricingSave}
                      isSaving={pricingSaving}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Download Links Form Component
const DownloadLinksForm = ({ 
  links, 
  onSave, 
  isSaving, 
  t 
}: { 
  links: DownloadLinks; 
  onSave: (links: DownloadLinks) => void;
  isSaving: boolean;
  t: any;
}) => {
  const [formData, setFormData] = useState<DownloadLinks>(links);

  const handleInputChange = (category: string, platform: string, field: string, value: string | boolean) => {
    setFormData(prev => {
      const categoryData = prev[category as keyof typeof prev] as any;
      const platformData = categoryData[platform] as any;
      
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [platform]: {
            ...platformData,
            [field]: value
          }
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Mobile Apps */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t("admin.downloadLinks.mobile")}</h3>
        <div className="grid gap-4">
          {Object.entries(formData.mobile).map(([platform, config]) => (
            <Card key={platform} className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium capitalize">{platform}</h4>
                <div className="grid gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("admin.downloadLinks.url")}
                    </label>
                    <Input
                      type="url"
                      value={config.url}
                      onChange={(e) => handleInputChange("mobile", platform, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => handleInputChange("mobile", platform, "enabled", e.target.checked)}
                      />
                      {t("admin.downloadLinks.enabled")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.comingSoon}
                        onChange={(e) => handleInputChange("mobile", platform, "comingSoon", e.target.checked)}
                      />
                      {t("admin.downloadLinks.comingSoon")}
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop Apps */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t("admin.downloadLinks.desktop")}</h3>
        <div className="grid gap-4">
          {Object.entries(formData.desktop).map(([platform, config]) => (
            <Card key={platform} className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium capitalize">{platform}</h4>
                <div className="grid gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("admin.downloadLinks.url")}
                    </label>
                    <Input
                      type="url"
                      value={config.url}
                      onChange={(e) => handleInputChange("desktop", platform, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => handleInputChange("desktop", platform, "enabled", e.target.checked)}
                      />
                      {t("admin.downloadLinks.enabled")}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.comingSoon}
                        onChange={(e) => handleInputChange("desktop", platform, "comingSoon", e.target.checked)}
                      />
                      {t("admin.downloadLinks.comingSoon")}
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("admin.loading")}
          </>
        ) : (
          t("admin.downloadLinks.save")
        )}
      </Button>
    </form>
  );
};

// Pricing Form Component
const PricingForm = ({ 
  pricingData, 
  onSave, 
  isSaving 
}: { 
  pricingData: PricingData; 
  onSave: (pricingData: PricingData) => void;
  isSaving: boolean;
}) => {
  const [formData, setFormData] = useState<PricingData>(pricingData);

  const handleInputChange = (planId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      plans: prev.plans.map(plan => 
        plan.id === planId 
          ? { ...plan, [field]: value || null }
          : plan
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const planNames = {
    'free-trial': 'Free Trial',
    'basic': 'Basic Plan',
    'standard': 'Standard Plan', 
    'premium': 'Premium Plan'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {formData.plans.map((plan) => (
          <Card key={plan.id} className="p-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">
                {planNames[plan.id as keyof typeof planNames] || plan.id}
              </h4>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Monthly Price (DZD)
                  </label>
                  <Input
                    type="number"
                    value={plan.price || ''}
                    onChange={(e) => handleInputChange(plan.id, 'price', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Setup Fee (DZD)
                  </label>
                  <Input
                    type="number"
                    value={plan.setup || ''}
                    onChange={(e) => handleInputChange(plan.id, 'setup', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Yearly Price (DZD)
                  </label>
                  <Input
                    type="number"
                    value={plan.yearlyPrice || ''}
                    onChange={(e) => handleInputChange(plan.id, 'yearlyPrice', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button 
        type="submit" 
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Pricing Changes'
        )}
      </Button>
    </form>
  );
};

export default AdminDashboard;
