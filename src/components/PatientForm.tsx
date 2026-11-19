// src/components/PatientForm.tsx
import { PatientInfo } from "@/types/lab-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PatientFormProps {
  initialData?: PatientInfo;
  onSubmit: (data: PatientInfo) => void;
}

export function PatientForm({ initialData, onSubmit }: PatientFormProps) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="font-bold text-sm">Patient Form Component</h3>
      <p className="text-xs text-muted-foreground mt-1">This component is retained for legacy compatibility.</p>
    </div>
  );
}
