// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Button } from "@/components/ui/button";
// // import { PatientInfo } from "@/types/lab-report";
// // import { User, Calendar, Hash } from "lucide-react";

// // // ✅ zod schema matches your LabReport type
// // const patientSchema = z.object({
// //   name: z.string().min(1, "Patient name is required").max(100),
// //   relation: z.string().min(1, "Relation info is required").max(50),
// //   age: z
// //     .number({ invalid_type_error: "Age must be a number" })
// //     .min(0.1, "Age must be at least 0.1") // allow floats < 1
// //     .max(120, "Age must be less than 120"), // max age
// //   sex: z.enum(["Male", "Female", "Other"], {
// //     required_error: "Please select sex",
// //   }),
// //   referringDoctor: z
// //     .string()
// //     .min(1, "Referring doctor is required")
// //     .max(100),
// //   sampleId: z.string().min(1, "Sample ID is required"),
// //   collectionDateTime: z.string().min(1, "Collection date/time is required"),
// // });

// // interface PatientFormProps {
// //   initialData?: PatientInfo;
// //   onSubmit: (data: PatientInfo) => void;
// // }

// // export function PatientForm({ initialData, onSubmit }: PatientFormProps) {
// //   const form = useForm<PatientInfo>({
// //     resolver: zodResolver(patientSchema),
// //     defaultValues: initialData || {
// //       name: "",
// //       relation: "",
// //       age: 0,
// //       sex: "Male",
// //       referringDoctor: "",
// //       sampleId: `S-${Date.now().toString().slice(-6)}`,
// //       collectionDateTime: "",
// //     },
// //   });

// //   const handleSubmit = (data: PatientInfo) => {
// //     onSubmit(data);
// //   };

// //   return (
// //     <Card className="card-shadow">
// //       <CardHeader className="medical-gradient text-white">
// //         <CardTitle className="flex items-center gap-2">
// //           <User className="h-5 w-5" />
// //           Patient Information
// //         </CardTitle>
// //       </CardHeader>

// //       <CardContent className="p-6 space-y-4">
// //         <Form {...form}>
// //           <form
// //             onSubmit={form.handleSubmit(handleSubmit)}
// //             className="space-y-4"
// //           >
// //             {/* Name + Relation */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <FormField
// //                 control={form.control}
// //                 name="name"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Patient Name</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Enter patient name" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="relation"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Relation Info</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="e.g., W/O Yasir" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //             </div>

// //             {/* Age + Sex + Doctor */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <FormField
// //                 control={form.control}
// //                 name="age"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Age</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         type="number"
// //                         placeholder="Enter age"
// //                         {...field}
// //                         value={field.value ?? ""}
// //                         onChange={(e) =>
// //                           field.onChange(
// //                             e.target.value ? Number(e.target.value) : 0
// //                           )
// //                         }
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="sex"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Sex</FormLabel>
// //                     <Select
// //                       onValueChange={field.onChange}
// //                       value={field.value}
// //                     >
// //                       <FormControl>
// //                         <SelectTrigger>
// //                           <SelectValue placeholder="Select sex" />
// //                         </SelectTrigger>
// //                       </FormControl>
// //                       <SelectContent>
// //                         <SelectItem value="Male">Male</SelectItem>
// //                         <SelectItem value="Female">Female</SelectItem>
// //                         <SelectItem value="Other">Other</SelectItem>
// //                       </SelectContent>
// //                     </Select>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="referringDoctor"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Referring Doctor</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Dr. Name" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //             </div>

// //             {/* Sample ID + Collection Date */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <FormField
// //                 control={form.control}
// //                 name="sampleId"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel className="flex items-center gap-2">
// //                       <Hash className="h-4 w-4" />
// //                       Sample ID
// //                     </FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Auto-generated" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="collectionDateTime"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel className="flex items-center gap-2">
// //                       <Calendar className="h-4 w-4" />
// //                       Collection Date/Time
// //                     </FormLabel>
// //                     <FormControl>
// //                       <Input type="datetime-local" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //             </div>

// //             {/* Submit */}
// //             <div className="flex justify-end pt-4">
// //               <Button type="submit" className="flex items-center gap-2">
// //                 Next: Select Tests
// //                 <svg
// //                   className="w-4 h-4"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M9 5l7 7-7 7"
// //                   />
// //                 </svg>
// //               </Button>
// //             </div>
// //           </form>
// //         </Form>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Button } from "@/components/ui/button";
// // import { PatientInfo } from "@/types/lab-report";
// // import { User, Calendar, Hash } from "lucide-react";
// // import { useNavigate } from "react-router-dom";

// // // ✅ zod schema
// // const patientSchema = z.object({
// //   name: z.string().min(1, "Patient name is required").max(100),
// //   relation: z.string().min(1, "Relation info is required").max(50),
// //   age: z
// //     .number({ invalid_type_error: "Age must be a number" })
// //     .min(0.1, "Age must be at least 0.1")
// //     .max(120, "Age must be less than 120"),
// //   sex: z.enum(["Male", "Female", "Other"], {
// //     required_error: "Please select sex",
// //   }),
// //   referringDoctor: z.string().min(1, "Referring doctor is required").max(100),
// //   sampleId: z.string().min(1, "Sample ID is required"),
// //   collectionDateTime: z.string().min(1, "Collection date/time is required"),
// // });

// // interface PatientFormProps {
// //   initialData?: PatientInfo;
// //   onSubmit: (data: PatientInfo) => void;
// // }

// // export function PatientForm({ initialData, onSubmit }: PatientFormProps) {
// //   const navigate = useNavigate();

// //   const form = useForm<PatientInfo>({
// //     resolver: zodResolver(patientSchema),
// //     defaultValues: initialData || {
// //       name: "",
// //       relation: "",
// //       age: 0,
// //       sex: "Male",
// //       referringDoctor: "",
// //       sampleId: `S-${Date.now().toString().slice(-6)}`,
// //       collectionDateTime: "",
// //     },
// //   });

// //   const handleSubmit = (data: PatientInfo) => {
// //     onSubmit(data);
// //   };

// //   // ✅ Navigate to Prescription Page with form data
// //   const handleNextPrescription = () => {
// //     const data = form.getValues();
// //     const validation = patientSchema.safeParse(data);

// //     if (!validation.success) {
// //       form.trigger(); // show validation errors
// //       return;
// //     }

// //     // navigate to prescription page and pass patient data
// //     navigate("/prescription", { state: { patientData: data } });
// //   };

// //   return (
// //     <Card className="card-shadow">
// //       <CardHeader className="medical-gradient text-white">
// //         <CardTitle className="flex items-center gap-2">
// //           <User className="h-5 w-5" />
// //           Patient Information
// //         </CardTitle>
// //       </CardHeader>

// //       <CardContent className="p-6 space-y-4">
// //         <Form {...form}>
// //           <form
// //             onSubmit={form.handleSubmit(handleSubmit)}
// //             className="space-y-4"
// //           >
// //             {/* Name + Relation */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <FormField
// //                 control={form.control}
// //                 name="name"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Patient Name</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Enter patient name" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="relation"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Relation Info</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="e.g., W/O Yasir" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //             </div>

// //             {/* Age + Sex + Doctor */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <FormField
// //                 control={form.control}
// //                 name="age"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Age</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         type="number"
// //                         placeholder="Enter age"
// //                         {...field}
// //                         value={field.value ?? ""}
// //                         onChange={(e) =>
// //                           field.onChange(
// //                             e.target.value ? Number(e.target.value) : 0
// //                           )
// //                         }
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="sex"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Sex</FormLabel>
// //                     <Select
// //                       onValueChange={field.onChange}
// //                       value={field.value}
// //                     >
// //                       <FormControl>
// //                         <SelectTrigger>
// //                           <SelectValue placeholder="Select sex" />
// //                         </SelectTrigger>
// //                       </FormControl>
// //                       <SelectContent>
// //                         <SelectItem value="Male">Male</SelectItem>
// //                         <SelectItem value="Female">Female</SelectItem>
// //                         <SelectItem value="Other">Other</SelectItem>
// //                       </SelectContent>
// //                     </Select>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="referringDoctor"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Referring Doctor</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Dr. Name" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //             </div>

// //             {/* Sample ID + Collection Date */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <FormField
// //                 control={form.control}
// //                 name="sampleId"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel className="flex items-center gap-2">
// //                       <Hash className="h-4 w-4" />
// //                       Sample ID
// //                     </FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Auto-generated" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="collectionDateTime"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel className="flex items-center gap-2">
// //                       <Calendar className="h-4 w-4" />
// //                       Collection Date/Time
// //                     </FormLabel>
// //                     <FormControl>
// //                       <Input type="datetime-local" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //             </div>

// //             {/* Submit + Next Prescription */}
// //             <div className="flex justify-end pt-4 gap-3">
// //               <Button type="submit" className="flex items-center gap-2">
// //                 Next: Select Tests
// //                 <svg
// //                   className="w-4 h-4"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M9 5l7 7-7 7"
// //                   />
// //                 </svg>
// //               </Button>

// //               {/* ✅ NEW BUTTON */}
// //               <Button
// //                 type="button"
// //                 variant="secondary"
// //                 onClick={handleNextPrescription}
// //                 className="flex items-center gap-2"
// //               >
// //                 Next: Prescription
// //                 <svg
// //                   className="w-4 h-4"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M9 5l7 7-7 7"
// //                   />
// //                 </svg>
// //               </Button>
// //             </div>
// //           </form>
// //         </Form>
// //       </CardContent>
// //     </Card>
// //   );
// // }


// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { PatientInfo } from "@/types/lab-report";
// import { User, Calendar, Hash } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // ✅ Full schema for Lab Test page (all required)
// const patientSchema = z.object({
//   name: z.string().min(1, "Patient name is required").max(100),
//   relation: z.string().min(1, "Relation info is required").max(50),
//   age: z
//     .number({ invalid_type_error: "Age must be a number" })
//     .min(0.1, "Age must be at least 0.1")
//     .max(120, "Age must be less than 120"),
//   sex: z.enum(["Male", "Female", "Other"], {
//     required_error: "Please select sex",
//   }),
//   referringDoctor: z.string().min(1, "Referring doctor is required").max(100),
//   sampleId: z.string().min(1, "Sample ID is required"),
//   collectionDateTime: z.string().min(1, "Collection date/time is required"),
// });

// // ✅ Schema for Prescription (some optional)
// const prescriptionSchema = z.object({
//   name: z.string().min(1, "Patient name is required").max(100),
//   relation: z.string().optional(),
//   age: z.number().optional(),
//   sex: z.enum(["Male", "Female", "Other"]).optional(),
//   referringDoctor: z.string().default("Dr. Aamir"),
//   sampleId: z.string().min(1, "Sample ID is required"),
//   collectionDateTime: z.string().min(1, "Collection date/time is required"),
// });

// interface PatientFormProps {
//   initialData?: PatientInfo;
//   onSubmit: (data: PatientInfo) => void;
// }

// export function PatientForm({ initialData, onSubmit }: PatientFormProps) {
//   const navigate = useNavigate();

//   const form = useForm<PatientInfo>({
//     resolver: zodResolver(patientSchema),
//     defaultValues: initialData || {
//       name: "",
//       relation: "",
//       age: 0,
//       sex: "Male",
//       referringDoctor: "Dr. Aamir", // ✅ default doctor
//       sampleId: `S-${Date.now().toString().slice(-6)}`,
//       collectionDateTime: "",
//     },
//   });

//   const handleSubmit = (data: PatientInfo) => {
//     onSubmit(data);
//   };

//   // ✅ Navigate to Prescription Page — relation, age, sex optional
//   const handleNextPrescription = () => {
//     const data = { ...form.getValues(), referringDoctor: "Dr. Aamir" }; // ✅ enforce Dr. Aamir
//     const validation = prescriptionSchema.safeParse(data);

//     if (!validation.success) {
//       // show only name/sample/date errors if missing
//       form.trigger(["name", "sampleId", "collectionDateTime"]);
//       return;
//     }

//     navigate("/prescription", { state: { patientData: validation.data } });
//   };

//   return (
//     <Card className="card-shadow">
//       <CardHeader className="medical-gradient text-white">
//         <CardTitle className="flex items-center gap-2">
//           <User className="h-5 w-5" />
//           Patient Information
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="p-6 space-y-4">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-4"
//           >
//             {/* Name + Relation */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Patient Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter patient name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="relation"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Relation Info</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g., W/O Yasir" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Age + Sex + Doctor */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <FormField
//                 control={form.control}
//                 name="age"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Age</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="Enter age"
//                         {...field}
//                         value={field.value ?? ""}
//                         onChange={(e) =>
//                           field.onChange(
//                             e.target.value ? Number(e.target.value) : 0
//                           )
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="sex"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Sex</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select sex" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Male">Male</SelectItem>
//                         <SelectItem value="Female">Female</SelectItem>
//                         <SelectItem value="Other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="referringDoctor"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Referring Doctor</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Dr. Aamir" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Sample ID + Collection Date */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="sampleId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="flex items-center gap-2">
//                       <Hash className="h-4 w-4" />
//                       Sample ID
//                     </FormLabel>
//                     <FormControl>
//                       <Input placeholder="Auto-generated" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="collectionDateTime"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       Collection Date/Time
//                     </FormLabel>
//                     <FormControl>
//                       <Input type="datetime-local" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end pt-4 gap-3">
//               <Button type="submit" className="flex items-center gap-2">
//                 Next: Select Tests
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </Button>

//               {/* ✅ New Prescription Button */}
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handleNextPrescription}
//                 className="flex items-center gap-2"
//               >
//                 Next: Prescription
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PatientInfo } from "@/types/lab-report";
import { User, Calendar, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase"; // ✅ Import auth
import { useAuthState } from "react-firebase-hooks/auth"; // ✅ Install: npm i react-firebase-hooks
import { Alert, AlertDescription } from "@/components/ui/alert";

// ✅ Full schema for Lab Test page (all required)
const patientSchema = z.object({
  name: z.string().min(1, "Patient name is required").max(100),
  relation: z.string().min(1, "Relation info is required").max(50),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .min(0.1, "Age must be at least 0.1")
    .max(120, "Age must be less than 120"),
  sex: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select sex",
  }),
  referringDoctor: z.string().min(1, "Referring doctor is required").max(100),
  sampleId: z.string().min(1, "Sample ID is required"),
  collectionDateTime: z.string().min(1, "Collection date/time is required"),
});

// ✅ Schema for Prescription (some optional)
const prescriptionSchema = z.object({
  name: z.string().min(1, "Patient name is required").max(100),
  relation: z.string().optional(),
  age: z.number().optional(),
  sex: z.enum(["Male", "Female", "Other"]).optional(),
  referringDoctor: z.string().default("Dr. Aamir"),
  sampleId: z.string().min(1, "Sample ID is required"),
  collectionDateTime: z.string().min(1, "Collection date/time is required"),
});

interface PatientFormProps {
  initialData?: PatientInfo;
  onSubmit: (data: PatientInfo) => void;
}

export function PatientForm({ initialData, onSubmit }: PatientFormProps) {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth); // ✅ Check auth state

  const form = useForm<PatientInfo>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData || {
      name: "",
      relation: "",
      age: 0,
      sex: "Male",
      referringDoctor: "Dr. Aamir",
      sampleId: `S-${Date.now().toString().slice(-6)}`,
      collectionDateTime: "",
    },
  });

  // ✅ Check authentication before proceeding
  const checkAuth = (): boolean => {
    if (!user) {
      alert("Please log in to continue");
      navigate("/login"); // Redirect to login page
      return false;
    }
    return true;
  };

  const handleSubmit = (data: PatientInfo) => {
    if (!checkAuth()) return; // ✅ Block if not logged in
    onSubmit(data);
  };

  // ✅ Navigate to Prescription Page with auth check
  const handleNextPrescription = () => {
    if (!checkAuth()) return; // ✅ Block if not logged in

    const data = { ...form.getValues(), referringDoctor: "Dr. Aamir" };
    const validation = prescriptionSchema.safeParse(data);

    if (!validation.success) {
      form.trigger(["name", "sampleId", "collectionDateTime"]);
      return;
    }

    navigate("/prescription", { state: { patientData: validation.data } });
  };

  // ✅ Show loading state
  if (loading) {
    return (
      <Card className="card-shadow">
        <CardContent className="p-6 text-center">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow">
      <CardHeader className="medical-gradient text-white">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* ✅ Show warning if not logged in */}
        {!user && (
          <Alert variant="destructive">
            <AlertDescription>
              You must be logged in to proceed. Please{" "}
              <button
                onClick={() => navigate("/login")}
                className="underline font-semibold"
              >
                log in here
              </button>
              .
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Name + Relation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter patient name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relation Info</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., W/O Yasir" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Age + Sex + Doctor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter age"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : 0
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referringDoctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referring Doctor</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Aamir" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sample ID + Collection Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sampleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Sample ID
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-generated" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collectionDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Collection Date/Time
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end pt-4 gap-3">
              <Button 
                type="submit" 
                className="flex items-center gap-2"
                disabled={!user} // ✅ Disable if not logged in
              >
                Next: Select Tests
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleNextPrescription}
                className="flex items-center gap-2"
                disabled={!user} // ✅ Disable if not logged in
              >
                Next: Prescription
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}