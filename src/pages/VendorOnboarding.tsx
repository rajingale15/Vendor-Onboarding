import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Upload, CheckCircle, Loader2, AlertCircle, ArrowLeft, Shield, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface VendorFormData {
  vendorName: string;
  address: string;
  gstin: string;
  pan: string;
  website: string;
  email: string;
  phone: string;
  panDocument: File | null;
  udyamCertificate: File | null;
  tradeLicense: File | null;
}

interface VerificationStep {
  name: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  message: string;
}

const VendorOnboarding = () => {
  const [formData, setFormData] = useState<VendorFormData>({
    vendorName: "",
    address: "",
    gstin: "",
    pan: "",
    website: "",
    email: "",
    phone: "",
    panDocument: null,
    udyamCertificate: null,
    tradeLicense: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof VendorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof VendorFormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("vendorName", formData.vendorName);
    form.append("gstin", formData.gstin);
    form.append("email", formData.email);
    form.append("pan", formData.pan || "");
    form.append("website", formData.website || "");
    form.append("address", formData.address);
    form.append("phone", formData.phone);
    if (formData.panDocument) form.append("panDocument", formData.panDocument);
    if (formData.udyamCertificate) form.append("udyamCertificate", formData.udyamCertificate);
    if (formData.tradeLicense) form.append("tradeLicense", formData.tradeLicense);

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:8000/api/vendors/submit", form);
      const result = response.data;

      setVerificationSteps(result.steps); // Update steps from backend
      setIsVerifying(true); // Trigger verification progress screen

      toast({
        title: "Application Submitted",
        description: "Your vendor registration has been submitted.",
      });
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerificationProgress = () => {
    const completed = verificationSteps.filter((step) => step.status === "completed").length;
    return (completed / verificationSteps.length) * 100;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  // Optionally: Keep the rest of your JSX content (form layout, UI, etc.) here
  // It looks like you already have that structured properly.
 if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">VendorVerify Pro</h1>
              </div>
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Verifying Your Business</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please wait while we verify your business information through our comprehensive verification process...
            </p>
          </div>

          <Card className="mb-6 border-2 border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl">
                <span className="flex items-center gap-2">
                  <FileCheck className="h-6 w-6" />
                  Verification Progress
                </span>
                <span className="text-lg font-normal text-blue-600">
                  {Math.round(getVerificationProgress())}% Complete
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getVerificationProgress()} className="mb-8 h-3" />
              
              <div className="space-y-4">
                {verificationSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                      step.status === 'in-progress' 
                        ? 'bg-blue-50 border-2 border-blue-200 scale-105' 
                        : step.status === 'completed'
                        ? 'bg-green-50 border border-green-200'
                        : step.status === 'failed'
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{step.name}</h3>
                      <p className="text-gray-600">{step.message}</p>
                    </div>
                    {step.status === 'in-progress' && (
                      <div className="flex-shrink-0">
                        <div className="animate-pulse bg-blue-200 rounded-full px-3 py-1 text-sm text-blue-800">
                          Processing...
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">VendorVerify Pro</h1>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <Building2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Become a Verified Seller</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of verified businesses on VendorVerify Pro and build trust with your customers
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Instant Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Secure Process</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5" />
              <span>Complete Reports</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Vendor Registration Form
            </CardTitle>
            <p className="text-blue-100">
              Please fill in all the required information to get verified
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-gray-600">Essential details about your business</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName" className="text-base font-medium">
                      Vendor Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="vendorName"
                      value={formData.vendorName}
                      onChange={(e) => handleInputChange('vendorName', e.target.value)}
                      placeholder="Enter your company name"
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstin" className="text-base font-medium">
                      GSTIN <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value)}
                      placeholder="Enter 15-digit GSTIN"
                      maxLength={15}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-medium">
                    Business Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete business address"
                    className="min-h-24 text-base"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pan" className="text-base font-medium">PAN (Optional)</Label>
                    <Input
                      id="pan"
                      value={formData.pan}
                      onChange={(e) => handleInputChange('pan', e.target.value)}
                      placeholder="Enter PAN number"
                      maxLength={10}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-base font-medium">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-gray-600">How customers can reach you</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Contact Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="business@company.com"
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900">Document Upload</h3>
                  <p className="text-gray-600">Upload supporting documents (Optional but recommended)</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="panDocument" className="text-base font-medium">PAN Card</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Input
                        id="panDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('panDocument', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <Label htmlFor="panDocument" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                        Upload PAN Card
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      {formData.panDocument && (
                        <p className="text-sm text-green-600 mt-2 font-medium">{formData.panDocument.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="udyamCertificate" className="text-base font-medium">Udyam Certificate</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Input
                        id="udyamCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('udyamCertificate', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <Label htmlFor="udyamCertificate" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                        Upload Certificate
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      {formData.udyamCertificate && (
                        <p className="text-sm text-green-600 mt-2 font-medium">{formData.udyamCertificate.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tradeLicense" className="text-base font-medium">Trade License</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Input
                        id="tradeLicense"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('tradeLicense', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <Label htmlFor="tradeLicense" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                        Upload License
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      {formData.tradeLicense && (
                        <p className="text-sm text-green-600 mt-2 font-medium">{formData.tradeLicense.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorOnboarding;
