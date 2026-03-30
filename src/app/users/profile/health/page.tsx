"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, HeartPulse, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHealthProfile, updateHealthProfile } from "../../../../../api/users.api";
import { HealthProfile } from "../../../../../types/userTypes";

export default function HealthProfilePage() {
  const [profile, setProfile] = useState<HealthProfile>({
    allergies: "",
    chronicDiseases: "",
    context: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHealthProfile()
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const updated = await updateHealthProfile(profile);
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // keep existing state
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading health profile...</div>
    );
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-5 w-5 text-success" />
        <h2 className="text-lg font-semibold text-gray-800">Health Profile</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 flex gap-2">
        <Bot className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          This information helps our AI assistant give you safe medication
          recommendations. Products containing your allergens will be filtered
          out automatically.{" "}
          <Link href="/ai-assistant" className="underline font-medium">
            Try the chatbot →
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="allergies" className="text-sm font-medium text-gray-700">
            Known Drug Allergies
          </label>
          <Input
            id="allergies"
            value={profile.allergies ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, allergies: e.target.value }))
            }
            placeholder="e.g. penicillin, aspirin, ibuprofen"
            className="text-sm"
          />
          <p className="text-xs text-gray-500">
            Separate multiple allergies with commas
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="chronicDiseases"
            className="text-sm font-medium text-gray-700"
          >
            Chronic Conditions
          </label>
          <Input
            id="chronicDiseases"
            value={profile.chronicDiseases ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, chronicDiseases: e.target.value }))
            }
            placeholder="e.g. diabetes, hypertension, asthma"
            className="text-sm"
          />
          <p className="text-xs text-gray-500">
            The assistant will remind you to be mindful of these when
            recommending medications
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="context" className="text-sm font-medium text-gray-700">
            Additional Health Notes
          </label>
          <Input
            id="context"
            value={profile.context ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, context: e.target.value }))
            }
            placeholder="Any other health information you'd like the assistant to know"
            className="text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-success hover:bg-success/90 text-white flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Health Profile"}
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Saved successfully!
          </span>
        )}
      </div>

      {(profile.allergies || profile.chronicDiseases) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Current Profile Summary
          </p>
          {profile.allergies && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Allergies:</span>{" "}
              {profile.allergies}
            </p>
          )}
          {profile.chronicDiseases && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Conditions:</span>{" "}
              {profile.chronicDiseases}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
