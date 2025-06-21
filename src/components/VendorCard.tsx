import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Building, Shield, AlertTriangle, XCircle } from "lucide-react";

interface Vendor {
  id: number;
  name: string;
  gstin: string;
  category: string;
  status: string;
  rating: number;
  location: string;
  description: string;
}

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard = ({ vendor }: VendorCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <Shield className="h-4 w-4" />;
      case "At Risk":
        return <AlertTriangle className="h-4 w-4" />;
      case "Not Verified":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "At Risk":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Not Verified":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-2">{vendor.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Building className="h-4 w-4" />
              <span>{vendor.gstin}</span>
            </div>
          </div>
          <Badge className={`${getStatusColor(vendor.status)} flex items-center gap-1`}>
            {getStatusIcon(vendor.status)}
            {vendor.status}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{vendor.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{vendor.rating}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Badge variant="secondary" className="mb-3">
          {vendor.category}
        </Badge>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {vendor.description}
        </p>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" className="flex-1">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
