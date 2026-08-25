import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, IdCard, MapPin, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { BackButton } from "../../components/ui/back-button";
import { privateRequest } from "../../utils/api";
import type { WalletUserForm, DistrictInfo, TownshipInfo } from "../../schemas/shared/outputs";
import { type ModificationResult } from "../../schemas/outputs";

export function WalletRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic location states
  const [districts, setDistricts] = useState<DistrictInfo[]>([]);
  const [townships, setTownships] = useState<TownshipInfo[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [formData, setFormData] = useState<WalletUserForm>({
    fullName: "",
    phoneNo: "",
    nrcForm: {
      districtCode: "12",
      townshipCode: "MAMANA",
      nrcType: "N",
      nrcNo: "",
    },
    addressForm: {
      addressContent: "",
      townshipId: 0,
      districtId: 0,
    },
    pin: "",
    confirmPin: "",
  });

  // Fetch Districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoadingLocations(true);
        const data = await privateRequest<DistrictInfo[]>("/resources/districts");
        setDistricts(data);
      } catch (err) {
        console.error("Failed to load districts", err);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch Townships when a district is selected
  const handleDistrictSelect = async (districtId: number) => {
    setFormData((prev) => ({
      ...prev,
      addressForm: { ...prev.addressForm, districtId, townshipId: 0 },
    }));

    if (!districtId) {
      setTownships([]);
      return;
    }

    try {
      setLoadingLocations(true);
      const data = await privateRequest<TownshipInfo[]>(`/resources/districts/${districtId}/townships`);
      setTownships(data);
    } catch (err) {
      console.error("Failed to load townships", err);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleTextChange = (field: keyof WalletUserForm, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNrcChange = (field: keyof WalletUserForm["nrcForm"], value: string) => {
    setError(null);
    setFormData((prev) => ({
      ...prev,
      nrcForm: { ...prev.nrcForm, [field]: value },
    }));
  };

  const handleAddressChange = (field: keyof WalletUserForm["addressForm"], value: any) => {
    setError(null);
    setFormData((prev) => ({
      ...prev,
      addressForm: { ...prev.addressForm, [field]: value },
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.phoneNo.trim()) {
        setError("Please fill in your name and phone number");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.nrcForm.nrcNo.trim()) {
        setError("Please enter your NRC number");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.addressForm.addressContent.trim()) {
        setError("Please enter your detailed address");
        return false;
      }
      if (!formData.addressForm.districtId || !formData.addressForm.townshipId) {
        setError("Please select both district and township");
        return false;
      }
    }
    if (step === 4) {
      if (formData.pin.length < 6) {
        setError("PIN must be at least 6 digits");
        return false;
      }
      if (formData.pin !== formData.confirmPin) {
        setError("PINs do not match");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 4) setStep((s) => (s + 1) as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    setError(null);

    try {
      await privateRequest<ModificationResult>("/wallet-user/auth/sign-up", {
        method: "POST",
        body: formData,
      });
      navigate("/auth/wallet/");
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 text-white min-h-screen flex justify-center items-center p-4">
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        {/* Title */}
        <div className="p-2 relative flex items-center justify-center">
          <BackButton />
          <h4 className="text-2xl font-semibold">Create Account</h4>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 px-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step >= i ? "bg-blue-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-medium text-rose-300 backdrop-blur-md animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="flex flex-col gap-3 animate-in fade-in">
              <label className="text-xs text-white/60 font-medium px-1">Personal Info</label>
              
              <div className="border border-white/15 flex gap-3 items-center rounded-full bg-white/10 backdrop-blur-2xl px-4 py-3">
                <User className="h-5 w-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleTextChange("fullName", e.target.value)}
                  className="outline-0 grow bg-transparent text-sm placeholder:text-white/30"
                />
              </div>

              <div className="border border-white/15 flex gap-3 items-center rounded-full bg-white/10 backdrop-blur-2xl px-4 py-3">
                <Phone className="h-5 w-5 text-white/60" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNo}
                  onChange={(e) => handleTextChange("phoneNo", e.target.value)}
                  className="outline-0 grow bg-transparent text-sm placeholder:text-white/30"
                />
              </div>
            </div>
          )}

          {/* STEP 2: NRC Details */}
          {step === 2 && (
            <div className="flex flex-col gap-3 animate-in fade-in">
              <label className="text-xs text-white/60 font-medium px-1">NRC Identification</label>
              
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="12"
                  value={formData.nrcForm.districtCode}
                  onChange={(e) => handleNrcChange("districtCode", e.target.value)}
                  className="border border-white/15 rounded-2xl bg-white/10 p-3 text-center text-sm outline-0"
                />
                <input
                  type="text"
                  placeholder="MAMANA"
                  value={formData.nrcForm.townshipCode}
                  onChange={(e) => handleNrcChange("townshipCode", e.target.value)}
                  className="border border-white/15 rounded-2xl bg-white/10 p-3 text-center text-sm outline-0"
                />
                <input
                  type="text"
                  placeholder="N"
                  value={formData.nrcForm.nrcType}
                  onChange={(e) => handleNrcChange("nrcType", e.target.value)}
                  className="border border-white/15 rounded-2xl bg-white/10 p-3 text-center text-sm outline-0"
                />
              </div>

              <div className="border border-white/15 flex gap-3 items-center rounded-full bg-white/10 backdrop-blur-2xl px-4 py-3">
                <IdCard className="h-5 w-5 text-white/60" />
                <input
                  type="text"
                  placeholder="NRC Number (nrcNo)"
                  value={formData.nrcForm.nrcNo}
                  onChange={(e) => handleNrcChange("nrcNo", e.target.value)}
                  className="outline-0 grow bg-transparent text-sm placeholder:text-white/30"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Address Form with District & Township API Binding */}
          {step === 3 && (
            <div className="flex flex-col gap-3 animate-in fade-in">
              <label className="text-xs text-white/60 font-medium px-1">Address Info</label>
              
              <div className="border border-white/15 flex gap-3 items-center rounded-full bg-white/10 backdrop-blur-2xl px-4 py-3">
                <MapPin className="h-5 w-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Address Detail (Street / House No)"
                  value={formData.addressForm.addressContent}
                  onChange={(e) => handleAddressChange("addressContent", e.target.value)}
                  className="outline-0 grow bg-transparent text-sm placeholder:text-white/30"
                />
              </div>

              {/* District Dropdown */}
              <select
                value={formData.addressForm.districtId || ""}
                onChange={(e) => handleDistrictSelect(Number(e.target.value))}
                className="border border-white/15 rounded-full bg-slate-800 px-4 py-3 text-sm outline-0"
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.districtId} value={d.districtId}>
                    {d.districtName}
                  </option>
                ))}
              </select>

              {/* Township Dropdown */}
              <select
                disabled={!formData.addressForm.districtId || loadingLocations}
                value={formData.addressForm.townshipId || ""}
                onChange={(e) => handleAddressChange("townshipId", Number(e.target.value))}
                className="border border-white/15 rounded-full bg-slate-800 px-4 py-3 text-sm outline-0 disabled:opacity-50"
              >
                <option value="">
                  {loadingLocations ? "Loading townships..." : "Select Township"}
                </option>
                {townships.map((t) => (
                  <option key={t.townshipId} value={t.townshipId}>
                    {t.townshipName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* STEP 4: Security PIN */}
          {step === 4 && (
            <div className="flex flex-col gap-3 animate-in fade-in">
              <label className="text-xs text-white/60 font-medium px-1">Security PIN</label>
              
              <div className="border border-white/15 flex gap-3 items-center rounded-full bg-white/10 backdrop-blur-2xl px-4 py-3">
                <KeyRound className="h-5 w-5 text-white/60" />
                <input
                  type="password"
                  placeholder="Enter PIN"
                  maxLength={6}
                  value={formData.pin}
                  onChange={(e) => handleTextChange("pin", e.target.value)}
                  className="outline-0 grow bg-transparent text-sm placeholder:text-white/30"
                />
              </div>

              <div className="border border-white/15 flex gap-3 items-center rounded-full bg-white/10 backdrop-blur-2xl px-4 py-3">
                <KeyRound className="h-5 w-5 text-white/60" />
                <input
                  type="password"
                  placeholder="Confirm PIN"
                  maxLength={6}
                  value={formData.confirmPin}
                  onChange={(e) => handleTextChange("confirmPin", e.target.value)}
                  className="outline-0 grow bg-transparent text-sm placeholder:text-white/30"
                />
              </div>
            </div>
          )}

          {/* Nav Actions */}
          <div className="mt-4 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex-1 rounded-full border border-white/20 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10 active:scale-95"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="theme flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-lg transition active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="theme flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-lg transition disabled:opacity-50 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Submit & Sign Up</span>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}