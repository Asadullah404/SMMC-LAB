import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LabReport } from "@/types/lab-report";
import { TestTube, Bug, AlertTriangle, Activity } from "lucide-react";

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

  const updateHepBsAgTest = (
    updates: Partial<NonNullable<LabReport["tests"]["hepBsAg"]>>
  ) => {
    onChange({
      ...data,
      hepBsAg: { selected: false, ...data.hepBsAg, ...updates },
    });
  };

  const updateAntiHCVTest = (
    updates: Partial<NonNullable<LabReport["tests"]["antiHCV"]>>
  ) => {
    onChange({
      ...data,
      antiHCV: { selected: false, ...data.antiHCV, ...updates },
    });
  };

  const updateUrineTest = (
    updates: Partial<LabReport["tests"]["urine"]>
  ) => {
    onChange({
      ...data,
      urine: { ...data.urine, ...updates },
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
            <Label htmlFor="malaria" className="text-base font-medium flex items-center gap-2">
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
                    <Label className="text-sm font-medium">Parasite Density (parasites/uL)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 1200"
                      className="mt-1"
                      value={data.malarialParasites.parasiteDensity || ""}
                      onChange={(e) =>
                        updateMalariaTest({
                          parasiteDensity: parseInt(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Species Results (Always Required)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">P. falciparum</Label>
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
                    <Label className="text-sm font-medium mb-2 block">P. vivax</Label>
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

                <div className="mt-3 flex flex-wrap gap-2">
                  {data.malarialParasites.pFalciparumResult && (
                    <Badge variant={data.malarialParasites.pFalciparumResult === "Positive" ? "destructive" : "secondary"} className="text-xs">
                      P. falciparum: {data.malarialParasites.pFalciparumResult}
                    </Badge>
                  )}
                  {data.malarialParasites.pVivaxResult && (
                    <Badge variant={data.malarialParasites.pVivaxResult === "Positive" ? "destructive" : "secondary"} className="text-xs">
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
                updateDengueTest({ selected: !!checked, result: undefined })
              }
            />
            <Label htmlFor="dengue" className="text-base font-medium flex items-center gap-2">
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
                  <Badge variant={data.dengueNS1.result === "Positive" ? "destructive" : "secondary"}>
                    Dengue NS1: {data.dengueNS1.result}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hep Bs Ag Test */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hepBsAg"
              checked={data.hepBsAg?.selected ?? false}
              onCheckedChange={(checked) =>
                updateHepBsAgTest({ selected: !!checked, result: undefined })
              }
            />
            <Label htmlFor="hepBsAg" className="text-base font-medium flex items-center gap-2 cursor-pointer">
              <Activity className="h-4 w-4" />
              <span>Hep Bs Ag</span>
              <span className="text-xs text-muted-foreground font-normal">(performed by ICT)</span>
            </Label>
          </div>

          {data.hepBsAg?.selected && (
            <div className="ml-6">
              <Label className="text-sm font-medium">Result</Label>
              <Select
                value={data.hepBsAg.result || ""}
                onValueChange={(value: "Reactive" | "Non-Reactive") =>
                  updateHepBsAgTest({ result: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-Reactive">Non-Reactive</SelectItem>
                  <SelectItem value="Reactive">Reactive</SelectItem>
                </SelectContent>
              </Select>

              {data.hepBsAg.result && (
                <div className="mt-3">
                  <Badge variant={data.hepBsAg.result === "Reactive" ? "destructive" : "secondary"}>
                    Hep Bs Ag: {data.hepBsAg.result}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ANTI-HCV Antibodies Test */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="antiHCV"
              checked={data.antiHCV?.selected ?? false}
              onCheckedChange={(checked) =>
                updateAntiHCVTest({ selected: !!checked, result: undefined })
              }
            />
            <Label htmlFor="antiHCV" className="text-base font-medium flex items-center gap-2 cursor-pointer">
              <Activity className="h-4 w-4" />
              <span>ANTI-HCV Antibodies</span>
              <span className="text-xs text-muted-foreground font-normal">(performed by ICT)</span>
            </Label>
          </div>

          {data.antiHCV?.selected && (
            <div className="ml-6">
              <Label className="text-sm font-medium">Result</Label>
              <Select
                value={data.antiHCV.result || ""}
                onValueChange={(value: "Reactive" | "Non-Reactive") =>
                  updateAntiHCVTest({ result: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-Reactive">Non-Reactive</SelectItem>
                  <SelectItem value="Reactive">Reactive</SelectItem>
                </SelectContent>
              </Select>

              {data.antiHCV.result && (
                <div className="mt-3">
                  <Badge variant={data.antiHCV.result === "Reactive" ? "destructive" : "secondary"}>
                    ANTI-HCV Antibodies: {data.antiHCV.result}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Urine Test */}
       {/* Urine Test */}
<div className="space-y-4 p-4 border rounded-lg bg-muted/30">
  <div className="flex items-center space-x-2">
    <Checkbox
      id="urine"
      checked={data.urine.selected}
      onCheckedChange={(checked) =>
        updateUrineTest({ selected: !!checked })
      }
    />
    <Label htmlFor="urine" className="text-base font-medium flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      Urine Analysis
    </Label>
  </div>

  {data.urine.selected && (
    <div className="ml-6 space-y-6">

      {/* Physical Examination */}
      <div>
        <Label className="text-sm font-semibold block mb-2">Physical Examination</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Volume (ml)" value={data.urine.volume || ""} onChange={(e) => updateUrineTest({ volume: e.target.value })} />
          <Input placeholder="color" value={data.urine.color || ""} onChange={(e) => updateUrineTest({ color: e.target.value })} />
          <Input placeholder="Appearance" value={data.urine.appearance || ""} onChange={(e) => updateUrineTest({ appearance: e.target.value })} />
          <Input placeholder="Specific Gravity" value={data.urine.specificGravity || ""} onChange={(e) => updateUrineTest({ specificGravity: e.target.value })} />
          <Input placeholder="Reaction pH" value={data.urine.pH || ""} onChange={(e) => updateUrineTest({ pH: e.target.value })} />
        </div>
      </div>

      {/* Chemical Examination */}
      <div>
        <Label className="text-sm font-semibold block mb-2">Chemical Examination</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Protein" value={data.urine.protein || ""} onChange={(e) => updateUrineTest({ protein: e.target.value })} />
          <Input placeholder="Glucose" value={data.urine.glucose || ""} onChange={(e) => updateUrineTest({ glucose: e.target.value })} />
          <Input placeholder="Ketone Bodies" value={data.urine.ketoneBodies || ""} onChange={(e) => updateUrineTest({ ketoneBodies: e.target.value })} />
          <Input placeholder="Urobilinogen" value={data.urine.urobilinogen || ""} onChange={(e) => updateUrineTest({ urobilinogen: e.target.value })} />
          <Input placeholder="Bilirubin" value={data.urine.bilirubin || ""} onChange={(e) => updateUrineTest({ bilirubin: e.target.value })} />
          <Input placeholder="Haemoglobin" value={data.urine.haemoglobin || ""} onChange={(e) => updateUrineTest({ haemoglobin: e.target.value })} />
          <Input placeholder="Nitrite" value={data.urine.nitrite || ""} onChange={(e) => updateUrineTest({ nitrite: e.target.value })} />
        </div>
      </div>

      {/* Microscopic Examination */}
      <div>
        <Label className="text-sm font-semibold block mb-2">Microscopic Examination</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="RBCs (/HPF)" value={data.urine.rbcs || ""} onChange={(e) => updateUrineTest({ rbcs: e.target.value })} />
          <Input placeholder="WBCs (/HPF)" value={data.urine.wbcs || ""} onChange={(e) => updateUrineTest({ wbcs: e.target.value })} />
          <Input placeholder="Leukocytes (/HPF)" value={data.urine.leukocytes || ""} onChange={(e) => updateUrineTest({ leukocytes: e.target.value })} />
          <Input placeholder="Epithelial Cells" value={data.urine.epithelialCells || ""} onChange={(e) => updateUrineTest({ epithelialCells: e.target.value })} />
          <Input placeholder="Bacteria" value={data.urine.bacteria || ""} onChange={(e) => updateUrineTest({ bacteria: e.target.value })} />
          <Input placeholder="Yeast" value={data.urine.yeast || ""} onChange={(e) => updateUrineTest({ yeast: e.target.value })} />
          <Input placeholder="Casts (/LPF)" value={data.urine.casts || ""} onChange={(e) => updateUrineTest({ casts: e.target.value })} />
          <Input placeholder="Crystals" value={data.urine.crystals || ""} onChange={(e) => updateUrineTest({ crystals: e.target.value })} />
          <Input placeholder="Others" value={data.urine.others || ""} onChange={(e) => updateUrineTest({ others: e.target.value })} />
        </div>
      </div>

    </div>
  )}
</div>


      </CardContent>
    </Card>
  );
}
