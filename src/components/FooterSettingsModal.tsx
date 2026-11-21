// src/components/FooterSettingsModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, SlidersHorizontal, Check, RotateCcw, Building2, Cloud, Loader2 } from "lucide-react";
import { FooterSettings, useFooterSettings } from "@/lib/footerSettings";
import { useToast } from "@/hooks/use-toast";

interface FooterSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FooterSettingsModal({ open, onOpenChange }: FooterSettingsModalProps) {
  const { settings, updateSettings, resetToDefault } = useFooterSettings();
  const { toast } = useToast();

  const [form, setForm] = useState<FooterSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever modal opens or settings change
  useEffect(() => {
    if (open) {
      setForm(settings);
    }
  }, [open, settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(form);
      toast({
        title: "Saved to Firebase",
        description: "Address, phone number, and visibility settings have been saved in Firebase Firestore.",
      });
      onOpenChange(false);
    } catch (err: unknown) {
      toast({
        title: "Saved Locally",
        description: "Settings cached locally. Firebase will synchronize once network is available.",
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      await resetToDefault();
      toast({
        title: "Reset in Firebase",
        description: "Footer settings restored to default values in Firebase Firestore.",
      });
      onOpenChange(false);
    } catch {
      toast({
        title: "Reset Locally",
        description: "Default values restored.",
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Footer & Contact Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Configure contact address, phone number, and footer visibility.
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center gap-1 font-semibold shrink-0">
              <Cloud className="h-3 w-3" />
              Firebase Synced
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Main Visibility Toggles */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
            {/* Toggle 1: Entire Footer */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="toggle-footer" className="text-sm font-semibold cursor-pointer">
                  Show Website Footer
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enable or hide the footer bar at the bottom of all web pages.
                </p>
              </div>
              <Switch
                id="toggle-footer"
                checked={form.showFooter}
                onCheckedChange={(val) => setForm((prev) => ({ ...prev, showFooter: val }))}
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800" />

            {/* Toggle 2: Show Address & Phone */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="toggle-contact" className="text-sm font-semibold cursor-pointer">
                  Show Address & Phone in Footer
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Display contact details (Address & Contact Number) in the footer.
                </p>
              </div>
              <Switch
                id="toggle-contact"
                checked={form.showContactInfo}
                disabled={!form.showFooter}
                onCheckedChange={(val) => setForm((prev) => ({ ...prev, showContactInfo: val }))}
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800" />

            {/* Toggle 3: Include in PDF */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="toggle-pdf" className="text-sm font-semibold cursor-pointer">
                  Include Address & Phone in PDF Reports
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Print the contact address and phone number in exported report PDFs.
                </p>
              </div>
              <Switch
                id="toggle-pdf"
                checked={form.showInPdf}
                onCheckedChange={(val) => setForm((prev) => ({ ...prev, showInPdf: val }))}
              />
            </div>
          </div>

          {/* Contact Information Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="footer-address" className="text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                Clinic / Diagnostic Lab Address
              </Label>
              <Input
                id="footer-address"
                placeholder="e.g. SMMC Complex, Main Boulevard, Diagnostic Services"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className="text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your physical address. Leave blank or toggle switch off to hide.
              </p>
            </div>

            <div>
              <Label htmlFor="footer-phone" className="text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mb-1.5">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                Contact Phone / Mobile Number
              </Label>
              <Input
                id="footer-phone"
                placeholder="e.g. +92 300 1234567, 021-3456789"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your primary phone or WhatsApp number.
              </p>
            </div>

            <div>
              <Label htmlFor="footer-tagline" className="text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mb-1.5">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                Footer Tagline / Copyright Name
              </Label>
              <Input
                id="footer-tagline"
                placeholder="e.g. SMMC Laboratory Diagnostic Information Systems"
                value={form.customText}
                onChange={(e) => setForm((prev) => ({ ...prev, customText: e.target.value }))}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-red-600 w-full sm:w-auto"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset Default
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
              className="text-xs flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSaving}
              onClick={handleSave}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  Saving to Firebase...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Save to Firebase
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
