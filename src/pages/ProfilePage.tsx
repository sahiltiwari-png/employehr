import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getEmployeeById } from '@/api/employees';
import API from '@/api/auth';
import { uploadFile } from '@/api/uploadFile';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    // Employee Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    department: '',
    designation: '',
    employmentType: '',
    reportingManager: '',
    reportingManagerId: '',
    dateOfJoining: '',
    probationEndDate: '',
    profileImage: '',
    // Personal Details
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    country: '',
    nationality: '',
    state: '',
    city: '',
    zipCode: '',
    aadhaarNo: '',
    panNo: '',
    passportNo: '',
    // Address Details
    addressLine1: '',
    addressLine2: '',
    addressCountry: '',
    addressState: '',
    addressCity: '',
    addressZipCode: '',
    // Finance Details
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    pfNumber: '',
    esiNumber: '',
    //taxDetails
    taxRegime: '',
    UAN: '',
    ESIC: '',
    // Emergency Details
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    activeOrganization: true,
  });
  const [initialForm, setInitialForm] = useState(form);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = user?._id || user?.id;
        if (!id) return;
        const data = await getEmployeeById(id);
        const formData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          password: '',
          profileImage: data.profilePhotoUrl || '',
          department: data.department || '',
          designation: data.designation || '',
          employmentType: data.employmentType || '',
          dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining).toLocaleDateString('en-CA') : '',
          probationEndDate: data.probationEndDate ? new Date(data.probationEndDate).toLocaleDateString('en-CA') : '',
          reportingManager:( data.reportingManagerId?.firstName || '')+ ' '+ (data.reportingManagerId?.lastName || '')+ ' '+ (data.reportingManagerId?.employeeCode || ''),
          reportingManagerId: data.reportingManagerId?._id || '',
          dateOfBirth: data.dob ? new Date(data.dob).toLocaleDateString('en-CA') : '',
          gender: data.gender || '',
          bloodGroup: data.bloodGroup || '',
          maritalStatus: data.maritalStatus || '',
          country: data.country || '',
          nationality: data.nationality || '',
          state: data.state || '',
          city: data.city || '',
          zipCode: data.zipCode || '',
          aadhaarNo: data.aadhaarNo || '',
          panNo: data.panNo || '',
          passportNo: data.passportNo || '',
          addressLine1: data.addressLine1 || '',
          addressLine2: data.addressLine2 || '',
          addressCountry: data.country || '',
          addressState: data.state || '',
          addressCity: data.city || '',
          addressZipCode: data.zipCode || '',
          accountNumber: data.bankDetails?.accountNumber || '',
          ifscCode: data.bankDetails?.ifscCode || '',
          bankName: data.bankDetails?.bankName || '',
          branchName: data.bankDetails?.branch || '',
          pfNumber: data.bankDetails?.pfNumber || '',
          esiNumber: data.bankDetails?.esiNumber || '',
          taxRegime: data.taxDetails?.taxRegime || '',
          UAN: data.taxDetails?.UAN || '',
          ESIC: data.taxDetails?.ESIC || '',
          emergencyContactName: data.emergencyContact?.name || '',
          emergencyContactRelation: data.emergencyContact?.relationship || '',
          emergencyContactPhone: data.emergencyContact?.phone || '',
          activeOrganization: data.active || true,
        };
        setForm(formData);
        setInitialForm(formData);
      } catch (err) {
        setError('Failed to fetch user details');
      }
    };
    fetchUser();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm({ ...form, activeOrganization: checked });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) {
        setError('Image size should be less than 100KB');
        return;
      }
      try {
        const url = await uploadFile(file);
        setForm((prev) => ({ ...prev, profileImage: url }));
      } catch (err) {
        setError('Failed to upload image');
      }
    }
  };

  const handleDiscard = () => {
    setForm(initialForm);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
   const res = await API.put(`/auth/employees/${user._id || user.id}`, {
  firstName: form.firstName,
  lastName: form.lastName,
  phone: form.phone,
  department: form.department,
  designation: form.designation,
  dateOfJoining: form.dateOfJoining,
  probationEndDate: form.probationEndDate,
  employmentType: form.employmentType,
//   status: form.activeOrganization ? "active" : "inactive",
  reportingManagerId: form.reportingManagerId,
  dob: form.dateOfBirth,
  gender: form.gender,
  bloodGroup: form.bloodGroup,
  maritalStatus: form.maritalStatus,
  nationality: form.nationality,
  addressLine1: form.addressLine1,
  addressLine2: form.addressLine2,
  country: form.addressCountry,
  state: form.addressState,
  city: form.addressCity,
  zipCode: form.addressZipCode,
  aadhaarNo: form.aadhaarNo,
  panNo: form.panNo,
  passportNo: form.passportNo,
  bankDetails: {
    bankName: form.bankName,
    accountNumber: form.accountNumber,
    ifscCode: form.ifscCode,
    branch: form.branchName,
  },
  taxDetails: {
    taxRegime: form.taxRegime,
    UAN: form.UAN,
    ESIC: form.ESIC,
  },
  emergencyContact: {
    name: form.emergencyContactName,
    relationship: form.emergencyContactRelation,
    phone: form.emergencyContactPhone,
  },

  loginEnabled: true,
  isActive: form.activeOrganization,

  ...(form.password ? { password: form.password } : {}),
});
      setSuccess('Profile updated successfully!');
      const updatedUser = { ...user, ...form, name: `${form.firstName} ${form.lastName}`.trim(), profileImage: form.profileImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      setInitialForm(form);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Profile</h1>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile</CardTitle>
          <div className="flex gap-2">
  <Button
    variant="outline" onClick={handleDiscard} className="font-[600] text-[14px] font-montserrat">Discard
  </Button>
  <Button onClick={handleSave} className="bg-[#4CDC9C] text-[#2C373B] hover:bg-green-600 font-[600] text-[14px] font-montserrat">Save all Changes</Button>
</div>

        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          {/* Employee Details */}
          <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aditya" /></div>
            <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Yadav" /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Company name" disabled/></div>
            <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Company name" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep unchanged" /></div>
            <div><Label htmlFor="department">Department</Label><Input id="department" name="department" value={form.department} onChange={handleChange} placeholder="Department" /></div>
            <div><Label htmlFor="designation">Designation</Label><Input id="designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Company name" disabled /></div>
            <div><Label htmlFor="employmentType">Employment Type</Label><Input id="employmentType" name="employmentType" value={form.employmentType} onChange={handleChange} placeholder="Company name" disabled /></div>
            <div><Label htmlFor="reportingManager">Reporting Manager</Label><Input id="reportingManager" name="reportingManager" value={form.reportingManager} onChange={handleChange} placeholder="Company name" disabled /></div>
            <div><Label htmlFor="dateOfJoining">Date Of Joining</Label><Input id="dateOfJoining" name="dateOfJoining" type="date" value={form.dateOfJoining} onChange={handleChange} disabled /></div>
            <div><Label htmlFor="probationEndDate">Probation End Date</Label><Input id="probationEndDate" name="probationEndDate" type="date" value={form.probationEndDate} onChange={handleChange} disabled /></div>
          </div>
          <div className="mt-6">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4 mt-2 p-4 border rounded-lg bg-gray-50">
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                {form.profileImage ? (
                  <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover rounded" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 2 2 4-4 2 2z" clipRule="evenodd" /></svg>
                )}
              </div>
              <div>
                <Input id="profileImage" type="file" onChange={handleImageChange} className="hidden" />
                <Button asChild variant="outline"><Label htmlFor="profileImage" className="cursor-pointer">Choose File</Label></Button>
                <p className="text-sm text-gray-500 mt-1">Please upload square image, size less than 100KB</p>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} /></div>
            <div><Label htmlFor="gender">Gender</Label><Input id="gender" name="gender" value={form.gender} onChange={handleChange} /></div>
            <div><Label htmlFor="bloodGroup">Blood Group</Label><Input id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} /></div>
            <div><Label htmlFor="maritalStatus">Marital Status</Label><Input id="maritalStatus" name="maritalStatus" value={form.maritalStatus} onChange={handleChange} /></div>
            <div><Label htmlFor="country">Country</Label><Input id="country" name="country" value={form.country} onChange={handleChange} /></div>
            <div><Label htmlFor="nationality">Nationality</Label><Input id="nationality" name="nationality" value={form.nationality} onChange={handleChange} /></div>
            <div><Label htmlFor="state">State</Label><Input id="state" name="state" value={form.state} onChange={handleChange} /></div>
            <div><Label htmlFor="city">City</Label><Input id="city" name="city" value={form.city} onChange={handleChange} /></div>
            <div><Label htmlFor="zipCode">Zip Code</Label><Input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} /></div>
            <div><Label htmlFor="aadhaarNo">Aadhaar No</Label><Input id="aadhaarNo" name="aadhaarNo" value={form.aadhaarNo} onChange={handleChange} /></div>
            <div><Label htmlFor="panNo">PAN No</Label><Input id="panNo" name="panNo" value={form.panNo} onChange={handleChange} /></div>
            <div><Label htmlFor="passportNo">Passport No</Label><Input id="passportNo" name="passportNo" value={form.passportNo} onChange={handleChange} /></div>
          </div>

          {/* Address Details */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Address Details</h2>
          <div className="space-y-6">
            <div><Label htmlFor="addressLine1">Address Line 1</Label><Input id="addressLine1" name="addressLine1" value={form.addressLine1} onChange={handleChange} /></div>
            <div><Label htmlFor="addressLine2">Address Line 2 (optional)</Label><Input id="addressLine2" name="addressLine2" value={form.addressLine2} onChange={handleChange} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label htmlFor="addressCountry">Country</Label><Input id="addressCountry" name="addressCountry" value={form.addressCountry} onChange={handleChange} /></div>
              <div><Label htmlFor="addressState">State</Label><Input id="addressState" name="addressState" value={form.addressState} onChange={handleChange} /></div>
              <div><Label htmlFor="addressCity">City</Label><Input id="addressCity" name="addressCity" value={form.addressCity} onChange={handleChange} /></div>
              <div><Label htmlFor="addressZipCode">Zip Code</Label><Input id="addressZipCode" name="addressZipCode" value={form.addressZipCode} onChange={handleChange} /></div>
            </div>
          </div>

          {/* Finance Details */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Finance Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="accountNumber">Account Number</Label><Input id="accountNumber" name="accountNumber" value={form.accountNumber} onChange={handleChange} /></div>
            <div><Label htmlFor="ifscCode">IFSC Code</Label><Input id="ifscCode" name="ifscCode" value={form.ifscCode} onChange={handleChange} /></div>
            <div><Label htmlFor="bankName">Bank Name</Label><Input id="bankName" name="bankName" value={form.bankName} onChange={handleChange} /></div>
            <div><Label htmlFor="branchName">Branch Name</Label><Input id="branchName" name="branchName" value={form.branchName} onChange={handleChange} /></div>
            <div><Label htmlFor="pfNumber">PF Number</Label><Input id="pfNumber" name="pfNumber" value={form.pfNumber} onChange={handleChange} /></div>
            <div><Label htmlFor="esiNumber">ESI Number</Label><Input id="esiNumber" name="esiNumber" value={form.esiNumber} onChange={handleChange} /></div>
          </div>

          {/* TaxDetails */}
          <h2 className="text-xl font-semibold mt-8 mb-4">TaxDetails</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="taxRegime">Tax Regime</Label><Input id="taxRegime" name="taxRegime" value={form.taxRegime} onChange={handleChange} /></div>
            <div><Label htmlFor="UAN">UAN</Label><Input id="UAN" name="UAN" value={form.UAN} onChange={handleChange} /></div>
            <div><Label htmlFor=" ESIC"> ESIC</Label><Input id=" ESIC" name=" ESIC" value={form. ESIC} onChange={handleChange} /></div>
            
          </div>

          {/* Emergency Details */}
          <h2 className="text-xl font-semibold mt-8 mb-4">Emergency Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="emergencyContactName">Name</Label><Input id="emergencyContactName" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} /></div>
            <div><Label htmlFor="emergencyContactRelation">Relation</Label><Input id="emergencyContactRelation" name="emergencyContactRelation" value={form.emergencyContactRelation} onChange={handleChange} /></div>
            <div><Label htmlFor="emergencyContactPhone">Phone</Label><Input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" value={form.emergencyContactPhone} onChange={handleChange} /></div>
          </div>

          <div className="flex items-center space-x-2 mt-8 cursor-default">
              <Switch id="active-organization" checked={form.activeOrganization} className="opacity-100" />
                    <Label htmlFor="active-organization">Active Organization</Label>
                      </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
