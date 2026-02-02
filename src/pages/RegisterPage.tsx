import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Code2, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const batches = Array.from({ length: 10 }, (_, i) => `${50 + i}`);
const sections = ["A", "B", "C", "D"];
const religions = ["Islam", "Hinduism", "Christianity", "Buddhism", "Others"];

const fieldsOfInterest = [
  { id: "programming", label: "Programming" },
  { id: "cybersecurity", label: "Cyber Security" },
  { id: "research", label: "Research" },
  { id: "others", label: "Others" },
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
  const { toast } = useToast();
  
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
    mobile: "",
    whatsapp: "",
    email: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContact: "",
    
    // Interests & Skills
    fieldsOfInterest: [] as string[],
    technicalSkills: [] as string[],
    extraCurricular: [] as string[],
    otherInterest: "",
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast({
      title: "Registration Submitted!",
      description: "Your membership application has been received. We'll review and get back to you soon.",
    });
    setStep(4);
  };

  return (
    <Layout>
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
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
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
                      <Button onClick={() => setStep(2)} variant="hero">
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
                        <Label htmlFor="mobile">Mobile Number *</Label>
                        <Input
                          id="mobile"
                          placeholder="+880 1XXX XXXXXX"
                          value={formData.mobile}
                          onChange={(e) => updateFormData("mobile", e.target.value)}
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
                      <Button onClick={() => setStep(3)} variant="hero">
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
                    <CardTitle className="font-display">Interests & Account</CardTitle>
                    <CardDescription>Tell us about your interests and create your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Field of Interest */}
                    <div className="space-y-3">
                      <Label>Field of Interest</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {fieldsOfInterest.map((field) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={field.id}
                              checked={formData.fieldsOfInterest.includes(field.id)}
                              onCheckedChange={() => toggleArrayField("fieldsOfInterest", field.id)}
                            />
                            <Label htmlFor={field.id} className="font-normal">{field.label}</Label>
                          </div>
                        ))}
                      </div>
                      {formData.fieldsOfInterest.includes("others") && (
                        <Input
                          placeholder="Please specify"
                          value={formData.otherInterest}
                          onChange={(e) => updateFormData("otherInterest", e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>

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
                      <Button onClick={() => setStep(2)} variant="outline">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        variant="hero" 
                        disabled={!formData.agreeTerms || isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 4 && (
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
            {step < 4 && (
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
