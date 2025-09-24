import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LabReport } from "@/types/lab-report";
import { TestTube, Bug, AlertTriangle } from "lucide-react";

interface TestsFormProps {
  data: LabReport["tests"];
  onChange: (tests: LabReport["tests"]) => void;
}

export function TestsForm({ data, onChange }: TestsFormProps) {
  const updateMalariaTest = (
    updates: Partial<LabReport["tests"]["malarialParasites"]>
  ) => {
    onChange({
      ...data,
      malarialParasites: { ...data.malarialParasites, ...updates },
    });
  };

  const updateDengueTest = (
    updates: Partial<LabReport["tests"]["dengueNS1"]>
  ) => {
    onChange({
      ...data,
      dengueNS1: { ...data.dengueNS1, ...updates },
    });
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="medical-gradient text-white">
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Laboratory Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Malaria Test */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="malaria"
              checked={data.malarialParasites.selected}
              onCheckedChange={(checked) =>
                updateMalariaTest({
                  selected: !!checked,
                  result: undefined,
                  pFalciparumResult: undefined,
                  pVivaxResult: undefined,
                  parasiteDensity: undefined,
                })
              }
            />
            <Label
              htmlFor="malaria"
              className="text-base font-medium flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Malarial Parasites
            </Label>
          </div>

          {data.malarialParasites.selected && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Overall Result</Label>
                  <Select
                    value={data.malarialParasites.result || ""}
                    onValueChange={(value: "Positive" | "Negative") =>
                      updateMalariaTest({ result: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Positive">Positive</SelectItem>
                      <SelectItem value="Negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {data.malarialParasites.result === "Positive" && (
                  <div>
                    <Label className="text-sm font-medium">
                      Parasite Density (parasites/µL)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 1200"
                      className="mt-1"
                      value={data.malarialParasites.parasiteDensity || ""}
                      onChange={(e) =>
                        updateMalariaTest({
                          parasiteDensity:
                            parseInt(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Always show both species with individual dropdowns */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Species Results (Always Required)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      P. falciparum
                    </Label>
                    <Select
                      value={data.malarialParasites.pFalciparumResult || ""}
                      onValueChange={(value: "Positive" | "Negative") =>
                        updateMalariaTest({ pFalciparumResult: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Positive">Positive</SelectItem>
                        <SelectItem value="Negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      P. vivax
                    </Label>
                    <Select
                      value={data.malarialParasites.pVivaxResult || ""}
                      onValueChange={(value: "Positive" | "Negative") =>
                        updateMalariaTest({ pVivaxResult: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Positive">Positive</SelectItem>
                        <SelectItem value="Negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.malarialParasites.pFalciparumResult && (
                    <Badge
                      variant={
                        data.malarialParasites.pFalciparumResult === "Positive"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      P. falciparum: {data.malarialParasites.pFalciparumResult}
                    </Badge>
                  )}
                  {data.malarialParasites.pVivaxResult && (
                    <Badge
                      variant={
                        data.malarialParasites.pVivaxResult === "Positive"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      P. vivax: {data.malarialParasites.pVivaxResult}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dengue Test */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dengue"
              checked={data.dengueNS1.selected}
              onCheckedChange={(checked) =>
                updateDengueTest({
                  selected: !!checked,
                  result: undefined,
                })
              }
            />
            <Label
              htmlFor="dengue"
              className="text-base font-medium flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Dengue NS1 Antigen
            </Label>
          </div>

          {data.dengueNS1.selected && (
            <div className="ml-6">
              <Label className="text-sm font-medium">Result</Label>
              <Select
                value={data.dengueNS1.result || ""}
                onValueChange={(value: "Positive" | "Negative") =>
                  updateDengueTest({ result: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                </SelectContent>
              </Select>

              {data.dengueNS1.result && (
                <div className="mt-3">
                  <Badge
                    variant={
                      data.dengueNS1.result === "Positive"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    Dengue NS1: {data.dengueNS1.result}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
