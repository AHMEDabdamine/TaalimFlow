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
  Settings,
  Instagram,
  Facebook,
  DollarSign,
  Save,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ADMIN_PASSWORD = "school";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  school_name: string;
  message: string;
  status: string;
  source: string;
  created_at: string;
}

const AdminPasswordPrompt = ({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onAuthenticated();
      } else {
        setError("كلمة المرور غير صحيحة");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Header />
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl font-bold">
            {t("admin.title")}
          </CardTitle>
          <CardDescription>{t("admin.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="text-center"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-2" />
              ) : (
                <Lock className="w-4 h-4 mx-2" />
              )}
              دخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Lead[]>([]);
  const [demoRequests, setDemoRequests] = useState<Lead[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({
    contactEmail: "contact@taalimflow.com",
    contactPhone: "+213 555 123 456",
    instagram: "@taalimflow",
    facebook: "TaalimFlow",
    pricing: {
      basic: "5000 DA/month",
      premium: "10000 DA/month",
      enterprise: "Contact us",
    },
  });
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [deletingItem, setDeletingItem] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [visitorStats, setVisitorStats] = useState({
    uniqueVisitors: 0,
    totalVisits: 0,
    todayVisits: 0,
    weeklyVisits: 0,
    monthlyVisits: 0,
    lastUpdated: ""
  });

  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Fetch form submissions from backend
  const fetchSubmissions = async () => {
    setIsLoadingData(true);
    setError("");
    try {
      const [contactResponse, demoResponse] = await Promise.all([
        fetch("/api/admin/contact-submissions"),
        fetch("/api/admin/demo-requests"),
      ]);

      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        // Convert backend format to frontend format
        const formattedContacts = contactData.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          school_name: item.schoolName,
          message: item.message,
          status: item.status,
          source: "contact_form",
          created_at: item.submittedAt,
          is_read: item.isRead === "true",
        }));
        setSubmissions(formattedContacts);
      }

      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        // Convert backend format to frontend format
        const formattedDemos = demoData.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          school_name: item.schoolName,
          message: `Demo Request - School Type: ${
            item.schoolType || "N/A"
          }, Students: ${item.numberOfStudents || "N/A"}`,
          status: item.status,
          source: "demo_request",
          created_at: item.submittedAt,
          is_read: item.isRead === "true",
        }));
        setDemoRequests(formattedDemos);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to load submissions");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch settings from backend
  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({ ...prev, ...data }));
      } else {
        console.log("Using default settings as backend is not responding");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      console.log("Using default settings");
    }
  };

  // Fetch visitor statistics
  const fetchVisitorStats = async () => {
    try {
      const response = await fetch("/api/admin/visitor-stats");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVisitorStats(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    }
  };

  // Update submission status
  const updateStatus = async (
    leadId: number,
    source: string,
    newStatus: string
  ) => {
    const key = `${source}-${leadId}`;
    setUpdatingStatus((prev) => ({ ...prev, [key]: true }));

    try {
      // Determine the correct endpoint based on source
      const endpoint =
        source === "contact_form"
          ? "/api/admin/contact-submissions"
          : "/api/admin/demo-requests";
      console.log(
        `Updating status for ${source} item ${leadId} to ${newStatus}`
      );

      const response = await fetch(`${endpoint}/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log("✅ Status updated successfully");
        // Update local state
        if (source === "contact_form") {
          setSubmissions((prev) =>
            prev.map((sub) =>
              sub.id === leadId ? { ...sub, status: newStatus } : sub
            )
          );
        } else if (source === "demo_request") {
          setDemoRequests((prev) =>
            prev.map((req) =>
              req.id === leadId ? { ...req, status: newStatus } : req
            )
          );
        }
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Save settings to backend
  const saveSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        console.log("✅ Settings saved successfully");
        alert("Settings saved successfully!");
      } else {
        throw new Error(result.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("❌ Error saving settings:", error);
      alert("Failed to save settings. Backend server may not be running.");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // Delete submission or demo request
  const deleteRecord = async (leadId: number, source: string) => {
    const key = `${source}-${leadId}`;

    if (
      !confirm(
        "Are you sure you want to delete this record? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingItem((prev) => ({ ...prev, [key]: true }));

    try {
      const endpoint =
        source === "contact_form"
          ? "/api/admin/contact-submissions"
          : "/api/admin/demo-requests";
      console.log(`Deleting ${source} item ${leadId}`);

      const response = await fetch(`${endpoint}/${leadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log("✅ Record deleted successfully");
        // Update local state
        if (source === "contact_form") {
          setSubmissions((prev) => prev.filter((sub) => sub.id !== leadId));
        } else if (source === "demo_request") {
          setDemoRequests((prev) => prev.filter((req) => req.id !== leadId));
        }
      } else {
        throw new Error(result.message || "Failed to delete record");
      }
    } catch (error) {
      console.error("❌ Error deleting record:", error);
      alert(`Failed to delete record: ${error.message}`);
    } finally {
      setDeletingItem((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchSettings();
      fetchVisitorStats();
    }
  }, [isAuthenticated]);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: {
        label: t("admin.status.new"),
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      contacted: {
        label: t("admin.status.contacted"),
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      qualified: {
        label: t("admin.status.qualified"),
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      closed: {
        label: t("admin.status.closed"),
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      i18n.language === "ar"
        ? "ar-DZ"
        : i18n.language === "fr"
        ? "fr-FR"
        : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminPasswordPrompt onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("admin.title")}</h1>
          <p className="text-muted-foreground">{t("admin.description")}</p>

          {/* Loading/Error States */}
          {isLoadingData && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Loading submissions...
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-red-600" />
                <span className="text-red-800 dark:text-red-200 font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("admin.stats.totalLeads")}
                  </p>
                  <p className="text-2xl font-bold">
                    {submissions.length + demoRequests.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("admin.stats.newLeads")}
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      [...submissions, ...demoRequests].filter(
                        (lead) => lead.status === "new"
                      ).length
                    }
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("admin.stats.contacted")}
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      [...submissions, ...demoRequests].filter(
                        (lead) => lead.status === "contacted"
                      ).length
                    }
                  </p>
                </div>
                <Phone className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("admin.stats.today")}
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      [...submissions, ...demoRequests].filter((lead) => {
                        const today = new Date().toDateString();
                        return (
                          new Date(lead.created_at).toDateString() === today
                        );
                      }).length
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Site Visitors
                  </p>
                  <p className="text-2xl font-bold">
                    {visitorStats.uniqueVisitors}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {visitorStats.todayVisits} today
                  </p>
                </div>
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <div className="w-full mx-auto">
          <Tabs defaultValue="submissions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="submissions"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Form Submissions
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Form Submissions
                  </CardTitle>
                  <CardDescription>
                    Contact forms and demo requests from your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[120px]">
                              Name
                            </TableHead>
                            <TableHead className="min-w-[200px]">
                              Email
                            </TableHead>
                            <TableHead className="min-w-[150px]">
                              School
                            </TableHead>
                            <TableHead className="min-w-[120px]">
                              Phone
                            </TableHead>
                            <TableHead className="min-w-[150px]">
                              Status
                            </TableHead>
                            <TableHead className="min-w-[120px]">
                              Date
                            </TableHead>
                            <TableHead className="min-w-[200px]">
                              Message
                            </TableHead>
                            <TableHead className="min-w-[180px]">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...submissions, ...demoRequests]
                            .sort(
                              (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime()
                            )
                            .map((lead) => {
                              const key = `${lead.source}-${lead.id}`;
                              const isUpdating = updatingStatus[key];
                              return (
                                <TableRow key={key}>
                                  <TableCell className="font-medium">
                                    {lead.name}
                                  </TableCell>
                                  <TableCell className="break-all">
                                    {lead.email}
                                  </TableCell>
                                  <TableCell>
                                    {lead.school_name || "N/A"}
                                  </TableCell>
                                  <TableCell>{lead.phone || "N/A"}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {getStatusBadge(lead.status)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap">
                                    {formatDate(lead.created_at)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="max-w-xs">
                                      <p
                                        className="truncate"
                                        title={lead.message || "N/A"}
                                      >
                                        {lead.message || "N/A"}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Select
                                        value={lead.status}
                                        onValueChange={(newStatus) =>
                                          updateStatus(
                                            lead.id,
                                            lead.source,
                                            newStatus
                                          )
                                        }
                                        disabled={isUpdating}
                                      >
                                        <SelectTrigger className="w-28">
                                          <SelectValue>
                                            {isUpdating ? (
                                              <div className="flex items-center gap-2">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                <span className="text-xs">
                                                  Updating...
                                                </span>
                                              </div>
                                            ) : (
                                              lead.status
                                            )}
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">
                                            New
                                          </SelectItem>
                                          <SelectItem value="contacted">
                                            Contacted
                                          </SelectItem>
                                          <SelectItem value="in_progress">
                                            In Progress
                                          </SelectItem>
                                          <SelectItem value="converted">
                                            Converted
                                          </SelectItem>
                                          <SelectItem value="closed">
                                            Closed
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          deleteRecord(lead.id, lead.source)
                                        }
                                        disabled={deletingItem[key]}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        data-testid={`button-delete-${lead.id}`}
                                      >
                                        {deletingItem[key] ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                      {[...submissions, ...demoRequests].length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No submissions yet
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-6">
                {/* Contact Information Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      Update your contact details displayed on the website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Address</Label>
                        <Input
                          id="contactEmail"
                          value={settings.contactEmail}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              contactEmail: e.target.value,
                            }))
                          }
                          placeholder="contact@taalimflow.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          value={settings.contactPhone}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              contactPhone: e.target.value,
                            }))
                          }
                          placeholder="+213 555 123 456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Handle</Label>
                        <div className="flex items-center space-x-2">
                          <Instagram className="w-4 h-4 text-muted-foreground" />
                          <Input
                            id="instagram"
                            value={settings.instagram}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                instagram: e.target.value,
                              }))
                            }
                            placeholder="@taalimflow"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook Page</Label>
                        <div className="flex items-center space-x-2">
                          <Facebook className="w-4 h-4 text-muted-foreground" />
                          <Input
                            id="facebook"
                            value={settings.facebook}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                facebook: e.target.value,
                              }))
                            }
                            placeholder="TaalimFlow"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Pricing Plans
                    </CardTitle>
                    <CardDescription>
                      Manage your subscription pricing displayed on the website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basicPrice">Basic Plan</Label>
                        <Input
                          id="basicPrice"
                          value={settings.pricing.basic}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                basic: e.target.value,
                              },
                            }))
                          }
                          placeholder="5000 DA/month"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premiumPrice">Premium Plan</Label>
                        <Input
                          id="premiumPrice"
                          value={settings.pricing.premium}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                premium: e.target.value,
                              },
                            }))
                          }
                          placeholder="10000 DA/month"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="enterprisePrice">Enterprise Plan</Label>
                        <Input
                          id="enterprisePrice"
                          value={settings.pricing.enterprise}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                enterprise: e.target.value,
                              },
                            }))
                          }
                          placeholder="Contact us"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Settings */}
                <div className="flex justify-end">
                  <Button
                    onClick={saveSettings}
                    disabled={isLoadingSettings}
                    className="flex items-center gap-2"
                  >
                    {isLoadingSettings ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
