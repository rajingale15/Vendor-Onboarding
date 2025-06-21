import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface SearchFiltersProps {
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
}

export const SearchFilters = ({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
}: SearchFiltersProps) => {
  const categories = [
    "IT Services",
    "Manufacturing",
    "Renewable Energy",
    "Construction",
    "Healthcare",
    "Education",
    "Food & Beverage",
    "Textiles",
  ];

  const statuses = [
    "Verified",
    "At Risk",
    "Not Verified",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="category-all" />
              <Label htmlFor="category-all" className="text-sm">All Categories</Label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={`category-${category}`} />
                <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Status Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Verification Status</Label>
          <RadioGroup value={selectedStatus} onValueChange={onStatusChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="status-all" />
              <Label htmlFor="status-all" className="text-sm">All Statuses</Label>
            </div>
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <RadioGroupItem value={status} id={`status-${status}`} />
                <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
