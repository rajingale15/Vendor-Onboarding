import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Shield, CheckCircle, AlertTriangle, XCircle, Building2, Star } from "lucide-react";
import { SearchFilters } from "@/components/SearchFilters";
import { VendorCard } from "@/components/VendorCard";
import { AuthModal } from "@/components/AuthModal";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"buyer" | "vendor" | null>(null);
  const navigate = useNavigate();

  // Check for saved login state on component mount
  useEffect(() => {
    const savedLoginState = localStorage.getItem('userLoginState');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedLoginState === 'true' && savedUserType) {
      setIsLoggedIn(true);
      setUserType(savedUserType as "buyer" | "vendor");
    }
  }, []);

  const vendors = [
    {
      id: 1,
      name: "TechCorp Solutions Pvt Ltd",
      gstin: "29ABCDE1234F1Z5",
      category: "IT Services",
      status: "Verified",
      rating: 4.5,
      location: "Bangalore, Karnataka",
      description: "Leading IT solutions provider with expertise in software development and digital transformation."
    },
    {
      id: 2,
      name: "Manufacturing Excellence Ltd",
      gstin: "27FGHIJ5678K2Y6",
      category: "Manufacturing",
      status: "At Risk",
      rating: 3.8,
      location: "Mumbai, Maharashtra",
      description: "Specialized manufacturing unit for automotive components and industrial machinery."
    },
    {
      id: 3,
      name: "Green Energy Innovations",
      gstin: "06KLMNO9012L3X7",
      category: "Renewable Energy",
      status: "Not Verified",
      rating: 4.2,
      location: "Delhi, NCR",
      description: "Innovative solutions for renewable energy and sustainable development projects."
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || vendor.category === selectedCategory;
    const matchesStatus = !selectedStatus || vendor.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAuthSuccess = (type: "buyer" | "vendor") => {
    setIsLoggedIn(true);
    setUserType(type);
    setShowAuthModal(false);
    
    // Save login state to localStorage
    localStorage.setItem('userLoginState', 'true');
    localStorage.setItem('userType', type);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserType(null);
    
    // Clear login state from localStorage
    localStorage.removeItem('userLoginState');
    localStorage.removeItem('userType');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">VendorVerify Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <ProfileDropdown userType={userType} isVerified={true} onSignOut={handleSignOut} />
                  <Button onClick={() => navigate('/vendor-onboarding')}>
                    Become a Seller
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/vendor-onboarding')}>
                    Become a Seller
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            India's Premier Vendor Verification Platform
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover verified suppliers, check compliance status, and make informed business decisions with real-time verification.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by company name, GSTIN, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Verified Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access pre-verified suppliers with GST, PAN, and Udyam validation
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Real-time Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instant compliance checks and GST return status verification
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Due Diligence Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive reports with director details and compliance history
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <SearchFilters
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                onCategoryChange={setSelectedCategory}
                onStatusChange={setSelectedStatus}
              />
            </div>

            {/* Vendor Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results
                </h3>
                <p className="text-gray-600">
                  {filteredVendors.length} vendors found
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
