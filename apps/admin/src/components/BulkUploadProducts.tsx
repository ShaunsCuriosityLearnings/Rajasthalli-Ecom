"use client";

import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadCloud, X, CheckCircle, AlertTriangle, Loader2, Download } from "lucide-react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface UploadResult {
  total: number;
  successCount: number;
  failedCount: number;
  errors: { row: number; name: string; error: string }[];
}

export default function BulkUploadProducts() {
  const router = useRouter();
  const { getToken } = useAuth();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState("");
  const [results, setResults] = useState<UploadResult | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "name",
      "shortDescription",
      "description",
      "price",
      "sizes",
      "categorySlug",
      "frontView",
      "sideView",
      "backView"
    ];
    const sampleRow = [
      "Jaipuri Bandhani Dress",
      "Authentic hand tie-dye Jaipuri printed dress.",
      "A stunning Jaipuri printed block dress. 100% premium cotton, handcrafted in Rajasthan.",
      "2999",
      "S,M,L,XL",
      "bandhani-sarees",
      "jaipuri-front.jpg",
      "jaipuri-side.jpg",
      "jaipuri-back.jpg"
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), sampleRow.join(",")].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rajasthalii_bulk_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Unsigned Cloudinary Upload Helper
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const presetName = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rajasthalii").trim();
    formData.append("upload_preset", presetName);

    const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME || "rajasthalii").trim();
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Cloudinary upload failed for ${file.name}`);
    }

    const data = await res.json();
    return data.secure_url;
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = [];
      let insideQuote = false;
      let currentValue = "";

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          values.push(currentValue.trim());
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());

      const cleanValues = values.map(val => val.replace(/^["']|["']$/g, ''));

      const rowObj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        if (header) {
          rowObj[header] = cleanValues[idx] || "";
        }
      });
      rows.push(rowObj);
    }
    return rows;
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      setGlobalError("Please select a CSV file first.");
      return;
    }

    setIsProcessing(true);
    setResults(null);
    setGlobalError(null);
    setCurrentProgress("Reading CSV file...");

    try {
      // 1. Read and parse CSV file
      const csvText = await csvFile.text();
      const csvRows = parseCSV(csvText);

      if (csvRows.length === 0) {
        throw new Error("The selected CSV file has no product rows to import.");
      }

      const productsToSubmit = [];
      const localErrors: { row: number; name: string; error: string }[] = [];
      let successCount = 0;
      let failedCount = 0;

      // 2. Loop through each row, match files and upload to Cloudinary
      for (let i = 0; i < csvRows.length; i++) {
        const rowNum = i + 1;
        const row = csvRows[i];
        const productName = row.name || `Row ${rowNum}`;

        setCurrentProgress(`Processing row ${rowNum}/${csvRows.length}: ${productName}...`);

        // Validate Row
        if (!row.name || !row.price || !row.categorySlug) {
          failedCount++;
          localErrors.push({
            row: rowNum,
            name: productName,
            error: "Missing required product fields (name, price, or categorySlug)",
          });
          continue;
        }

        const frontName = row.frontView;
        const sideName = row.sideView;
        const backName = row.backView;

        if (!frontName || !sideName || !backName) {
          failedCount++;
          localErrors.push({
            row: rowNum,
            name: productName,
            error: "Image filenames must be specified for frontView, sideView, and backView",
          });
          continue;
        }

        // Find files in local selection
        const frontFile = imageFiles.find(f => f.name === frontName);
        const sideFile = imageFiles.find(f => f.name === sideName);
        const backFile = imageFiles.find(f => f.name === backName);

        if (!frontFile || !sideFile || !backFile) {
          const missing = [];
          if (!frontFile) missing.push(frontName);
          if (!sideFile) missing.push(sideName);
          if (!backFile) missing.push(backName);

          failedCount++;
          localErrors.push({
            row: rowNum,
            name: productName,
            error: `Image file(s) not found in selection: ${missing.join(", ")}`,
          });
          continue;
        }

        // Upload images to Cloudinary
        try {
          setCurrentProgress(`Uploading front-view for row ${rowNum}...`);
          const frontUrl = await uploadToCloudinary(frontFile);

          setCurrentProgress(`Uploading side-view for row ${rowNum}...`);
          const sideUrl = await uploadToCloudinary(sideFile);

          setCurrentProgress(`Uploading back-view for row ${rowNum}...`);
          const backUrl = await uploadToCloudinary(backFile);

          productsToSubmit.push({
            name: row.name,
            shortDescription: row.shortDescription || "",
            description: row.description || "",
            price: Number(row.price),
            sizes: row.sizes ? row.sizes.split(",").map(s => s.trim()) : ["Free Size"],
            categorySlug: row.categorySlug,
            images: {
              frontView: frontUrl,
              sideView: sideUrl,
              backView: backUrl,
            }
          });
        } catch (uploadErr: any) {
          failedCount++;
          localErrors.push({
            row: rowNum,
            name: productName,
            error: uploadErr.message || "Failed to upload images to Cloudinary",
          });
        }
      }

      // 3. Submit JSON payload to backend product-service
      if (productsToSubmit.length > 0) {
        setCurrentProgress("Submitting products to database...");
        const token = await getToken();
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        
        const res = await fetch(`${baseUrl}/products/bulk-upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ products: productsToSubmit }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to submit bulk products to backend");
        }

        const backendResults = data.results;
        setResults({
          total: csvRows.length,
          successCount: backendResults.successCount,
          failedCount: failedCount + backendResults.failedCount,
          errors: [...localErrors, ...backendResults.errors],
        });
      } else {
        // All rows failed before database submission
        setResults({
          total: csvRows.length,
          successCount: 0,
          failedCount: csvRows.length,
          errors: localErrors,
        });
      }
    } catch (err: any) {
      console.error("Bulk Upload Error:", err);
      setGlobalError(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsProcessing(false);
      setCurrentProgress("");
    }
  };

  const handleCloseSheet = () => {
    setCsvFile(null);
    setImageFiles([]);
    setResults(null);
    setGlobalError(null);
    router.refresh();
  };

  return (
    <SheetContent side="right" className="w-[450px] sm:w-[540px]">
      <SheetHeader className="pb-4 border-b border-gray-100">
        <SheetTitle className="text-xl font-bold flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-primary" />
          Bulk Upload Products
        </SheetTitle>
        <SheetDescription>
          Upload a CSV file and select the product images together. The system will automatically link them and upload to Cloudinary.
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="h-[calc(100vh-140px)] pr-2 py-4">
        {results ? (
          // RESULTS VIEW
          <div className="space-y-6">
            <div className="bg-secondary/40 p-4 rounded-xl space-y-3">
              <h3 className="font-semibold text-sm">Upload Summary</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <span className="block text-xl font-bold text-gray-800">{results.total}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-medium">Total</span>
                </div>
                <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                  <span className="block text-xl font-bold text-green-600">{results.successCount}</span>
                  <span className="text-[10px] text-green-600 uppercase font-medium">Success</span>
                </div>
                <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                  <span className="block text-xl font-bold text-red-500">{results.failedCount}</span>
                  <span className="text-[10px] text-red-400 uppercase font-medium">Failed</span>
                </div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-1.5 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings & Errors ({results.errors.length})
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden bg-white max-h-[250px] overflow-y-auto">
                  {results.errors.map((err, idx) => (
                    <div key={idx} className="p-3 text-xs flex justify-between gap-4">
                      <div className="min-w-0">
                        <span className="font-medium text-gray-700 block truncate">
                          Row {err.row}: {err.name}
                        </span>
                        <span className="text-red-500 font-light block">{err.error}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleCloseSheet}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          // UPLOAD FORM VIEW
          <div className="space-y-6">
            {/* Template Download */}
            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl space-y-2.5">
              <h3 className="font-semibold text-sm text-amber-700">Need the CSV Template?</h3>
              <p className="text-xs text-amber-600/90 font-light">
                Download the spreadsheet template containing the exact column headers and sample row structure required for bulk upload.
              </p>
              <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full text-xs font-semibold gap-1.5 border-amber-200/60 hover:bg-amber-500/10 hover:text-amber-800 text-amber-700 cursor-pointer">
                <Download className="h-3.5 w-3.5" />
                Download Template CSV
              </Button>
            </div>

            {/* Select CSV */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 block">1. Select CSV File</label>
              <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary transition bg-gray-50/50">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvChange}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 block">
                  <UploadCloud className="h-8 w-8 text-gray-400 mx-auto" />
                  <span className="text-xs font-medium text-gray-700 block">
                    {csvFile ? csvFile.name : "Click to select or drag product CSV"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-light block">
                    Only CSV (.csv) files are supported
                  </span>
                </label>
              </div>
            </div>

            {/* Select Images */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 block">2. Select Product Images</label>
              <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary transition bg-gray-50/50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="hidden"
                  id="images-file-input"
                />
                <label htmlFor="images-file-input" className="cursor-pointer space-y-2 block">
                  <UploadCloud className="h-8 w-8 text-gray-400 mx-auto" />
                  <span className="text-xs font-medium text-gray-700 block">
                    {imageFiles.length > 0 ? `${imageFiles.length} images selected` : "Click to select all local product images"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-light block">
                    Make sure filenames match values in CSV frontView/sideView/backView
                  </span>
                </label>
              </div>
            </div>

            {globalError && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2 text-xs text-red-600">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{globalError}</span>
              </div>
            )}

            {isProcessing ? (
              <div className="bg-secondary/40 p-4 rounded-xl flex flex-col items-center justify-center py-6 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs font-medium text-gray-700 block">Processing Bulk Upload...</span>
                <span className="text-[10px] text-gray-400 font-light block max-w-[320px]">{currentProgress}</span>
              </div>
            ) : (
              <div className="flex gap-3 pt-4">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1" ref={closeRef}>
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  className="flex-1"
                  onClick={handleBulkUpload}
                  disabled={!csvFile || imageFiles.length === 0}
                >
                  Start Bulk Import
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </SheetContent>
  );
}
