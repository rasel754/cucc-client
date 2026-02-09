import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Code2, ArrowRight, ArrowLeft, CheckCircle, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const batches = Array.from({ length: 40 }, (_, i) => `${60 + i}`);
const sections = ["A", "B", "C", "D"];
const religions = ["Islam", "Hinduism", "Christianity", "Buddhism", "Others"];

const clubWings = [
  { id: "Programming", label: "Programming Club" },
  { id: "Cyber Security", label: "Cyber Security Club" },
  { id: "R&D", label: "Research & Development Club" },
];

const technicalSkills = [
  { id: "graphic-design", label: "Graphic Design" },
  { id: "video-editing", label: "Video Editing" },
  { id: "content-writing", label: "Content Writing" },
  { id: "tech-others", label: "Others" },
];

const extraCurricular = [
  { id: "debate", label: "Debate" },
  { id: "dance", label: "Dance" },
  { id: "sports", label: "Sports" },
  { id: "photography", label: "Photography" },
  { id: "song", label: "Song" },
  { id: "extra-others", label: "Others" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    studentId: "",
    batch: "",
    section: "",
    yearSemester: "",
    dateOfBirth: "",
    gender: "",
    shift: "",
    bloodGroup: "",
    religion: "",

    // Contact Information
    phoneNumber: "",
    whatsapp: "",
    email: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContact: "",

    // Club Information
    clubWing: "" as "Programming" | "Cyber Security" | "R&D" | "",

    // Payment Information
    paymentMethod: "" as "BKASH" | "NAGAD" | "",
    transactionId: "",

    // Interests & Skills
    technicalSkills: [] as string[],
    extraCurricular: [] as string[],
    otherSkill: "",
    otherExtra: "",

    // Account
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(v => v !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  // Validation functions for each step
  const isStep1Valid = () => {
    return (
      profileFile !== null &&
      formData.name.trim() !== "" &&
      formData.studentId.trim() !== "" &&
      formData.dateOfBirth !== "" &&
      formData.batch !== "" &&
      formData.section !== "" &&
      formData.gender !== "" &&
      formData.shift !== ""
    );
  };

  const isStep2Valid = () => {
    return (
      formData.phoneNumber.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.presentAddress.trim() !== ""
    );
  };

  const isStep3Valid = () => {
    return (
      formData.clubWing !== "" &&
      formData.paymentMethod !== "" &&
      formData.transactionId.trim() !== ""
    );
  };

  const isStep4Valid = () => {
    return (
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      formData.password === formData.confirmPassword &&
      formData.agreeTerms
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file object
      setProfileFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.clubWing || !formData.paymentMethod || !formData.transactionId) {
      toast({
        title: "Missing Fields",
        description: "Please fill in club wing, payment method, and transaction ID.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.createMember({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        batch: formData.batch,
        section: formData.section,
        yearSemester: formData.yearSemester,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        shift: formData.shift,
        bloodGroup: formData.bloodGroup,
        religion: formData.religion,
        phoneNumber: formData.phoneNumber,
        whatsapp: formData.whatsapp,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        emergencyContact: formData.emergencyContact,
        clubWing: formData.clubWing as "Programming" | "Cyber Security" | "R&D",
        paymentMethod: formData.paymentMethod as "BKASH" | "NAGAD",
        transactionId: formData.transactionId,
        skills: formData.technicalSkills,
        extraCurricular: formData.extraCurricular,
      }, profileFile);

      toast({
        title: "Registration Submitted!",
        description: "Your membership application has been received. We'll review and get back to you soon.",
      });
      setStep(5);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageTitle title="Join CUCC" />
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-cucc-navy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Code2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Join CUCC
              </h1>
              <p className="text-muted-foreground">
                City University Computer Club Membership Application
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>

            {/* Form Card */}
            <Card className="shadow-xl border-border/50">
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle className="font-display">Personal Information</CardTitle>
                    <CardDescription>Please provide your personal details as per university records</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {profilePreview ? (
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                            <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setProfilePreview("");
                                setProfileFile(null);
                              }}
                              className="absolute top-0 right-0 p-1 bg-destructive text-destructive-foreground rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground mt-1">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                        )}
                      </div>
                      <div>
                        <Label className="text-base">Profile Photo *</Label>
                        <p className="text-sm text-muted-foreground">Upload a clear passport-size photo</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID *</Label>
                        <Input
                          id="studentId"
                          placeholder="e.g., 1834902123"
                          value={formData.studentId}
                          onChange={(e) => updateFormData("studentId", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Batch *</Label>
                        <Select value={formData.batch} onValueChange={(value) => updateFormData("batch", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select batch" />
                          </SelectTrigger>
                          <SelectContent>
                            {batches.map(b => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Section *</Label>
                        <Select value={formData.section} onValueChange={(value) => updateFormData("section", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {sections.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearSemester">Year/Semester</Label>
                        <Input
                          id="yearSemester"
                          placeholder="e.g., 4th/8th"
                          value={formData.yearSemester}
                          onChange={(e) => updateFormData("yearSemester", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>Gender *</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) => updateFormData("gender", value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male" className="font-normal">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="font-normal">Female</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label>Shift *</Label>
                        <RadioGroup
                          value={formData.shift}
                          onValueChange={(value) => updateFormData("shift", value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="day" id="day" />
                            <Label htmlFor="day" className="font-normal">Day</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="evening" id="evening" />
                            <Label htmlFor="evening" className="font-normal">Evening</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData("bloodGroup", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodGroups.map(bg => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Religion</Label>
                        <Select value={formData.religion} onValueChange={(value) => updateFormData("religion", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {religions.map(r => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={() => setStep(2)} variant="hero" disabled={!isStep1Valid()}>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle className="font-display">Contact Information</CardTitle>
                    <CardDescription>How can we reach you?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Mobile Number *</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+880 1XXX XXXXXX"
                          value={formData.phoneNumber}
                          onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <Input
                          id="whatsapp"
                          placeholder="+880 1XXX XXXXXX"
                          value={formData.whatsapp}
                          onChange={(e) => updateFormData("whatsapp", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="presentAddress">Present Address *</Label>
                      <Textarea
                        id="presentAddress"
                        placeholder="Enter your current address"
                        value={formData.presentAddress}
                        onChange={(e) => updateFormData("presentAddress", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentAddress">Permanent Address</Label>
                      <Textarea
                        id="permanentAddress"
                        placeholder="Enter your permanent address"
                        value={formData.permanentAddress}
                        onChange={(e) => updateFormData("permanentAddress", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="+880 1XXX XXXXXX"
                        value={formData.emergencyContact}
                        onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button onClick={() => setStep(1)} variant="outline">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button onClick={() => setStep(3)} variant="hero" disabled={!isStep2Valid()}>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 3 && (
                <>
                  <CardHeader>
                    <CardTitle className="font-display">Club Wing & Payment</CardTitle>
                    <CardDescription>Select your preferred wing and complete payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Club Wing Selection */}
                    <div className="space-y-3">
                      <Label>Select Club Wing *</Label>
                      <RadioGroup
                        value={formData.clubWing}
                        onValueChange={(value) => updateFormData("clubWing", value)}
                        className="grid gap-3"
                      >
                        {clubWings.map((wing) => (
                          <div
                            key={wing.id}
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${formData.clubWing === wing.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                              }`}
                          >
                            <RadioGroupItem value={wing.id} id={wing.id} />
                            <Label htmlFor={wing.id} className="font-medium cursor-pointer flex-1">
                              {wing.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Payment Information */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Payment Information</h3>
                      <div className="bg-muted/50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground">
                          Membership Fee: <span className="font-bold text-foreground">৳500</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Send to: bKash - 01XXXXXXXXX or Nagad - 01XXXXXXXXX
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Payment Method *</Label>
                          <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) => updateFormData("paymentMethod", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BKASH">Bkash</SelectItem>
                              <SelectItem value="NAGAD">Nagad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transactionId">Transaction ID *</Label>
                          <Input
                            id="transactionId"
                            placeholder="Enter TrxID from receipt"
                            value={formData.transactionId}
                            onChange={(e) => updateFormData("transactionId", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button onClick={() => setStep(2)} variant="outline">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button onClick={() => setStep(4)} variant="hero" disabled={!isStep3Valid()}>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 4 && (
                <>
                  <CardHeader>
                    <CardTitle className="font-display">Skills & Account</CardTitle>
                    <CardDescription>Tell us about your skills and create your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Technical Skills */}
                    <div className="space-y-3">
                      <Label>Technical Skills</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {technicalSkills.map((skill) => (
                          <div key={skill.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill.id}
                              checked={formData.technicalSkills.includes(skill.id)}
                              onCheckedChange={() => toggleArrayField("technicalSkills", skill.id)}
                            />
                            <Label htmlFor={skill.id} className="font-normal">{skill.label}</Label>
                          </div>
                        ))}
                      </div>
                      {formData.technicalSkills.includes("tech-others") && (
                        <Input
                          placeholder="Please specify"
                          value={formData.otherSkill}
                          onChange={(e) => updateFormData("otherSkill", e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>

                    {/* Extra-Curricular */}
                    <div className="space-y-3">
                      <Label>Extra-Curricular Activities</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {extraCurricular.map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={activity.id}
                              checked={formData.extraCurricular.includes(activity.id)}
                              onCheckedChange={() => toggleArrayField("extraCurricular", activity.id)}
                            />
                            <Label htmlFor={activity.id} className="font-normal">{activity.label}</Label>
                          </div>
                        ))}
                      </div>
                      {formData.extraCurricular.includes("extra-others") && (
                        <Input
                          placeholder="Please specify"
                          value={formData.otherExtra}
                          onChange={(e) => updateFormData("otherExtra", e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Create Account</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => updateFormData("password", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => updateFormData("agreeTerms", checked)}
                      />
                      <Label htmlFor="terms" className="font-normal text-sm leading-relaxed">
                        I agree to the CUCC <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. I understand that my membership
                        is subject to approval by the club administrators.
                      </Label>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button onClick={() => setStep(3)} variant="outline">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        variant="hero"
                        disabled={!isStep4Valid() || isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 5 && (
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Application Submitted!
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Thank you for applying to join CUCC. Your application is now pending review.
                    We'll notify you via email once it's approved.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/">
                      <Button variant="outline">
                        Return to Home
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="hero">
                        Login to Account
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Already have account */}
            {step < 5 && (
              <p className="text-center mt-6 text-muted-foreground">
                Already a member?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
