"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IcebreakerResponse {
  icebreaker: string;
  source: string;
  company_summary: string;
}

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IcebreakerResponse | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    if (!websiteUrl.trim()) {
      setError("Website URL is required");
      return;
    }

    if (!validateUrl(websiteUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }

      const response = await fetch(`${apiUrl}/webhook/icebreaker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName.trim(),
          website_url: websiteUrl.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate icebreaker. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 md:py-24 w-full">
      <div className="w-full max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Generate an email icebreaker in seconds
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in all the fields and generate a unique email icebreaker
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-base font-medium">
                Company name
              </Label>
              <Input
                id="company-name"
                type="text"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
                required
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website-url" className="text-base font-medium">
                Website URL
              </Label>
              <Input
                id="website-url"
                type="url"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                disabled={loading}
                required
                className="h-12 text-base"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto min-w-[200px] h-12 text-base font-medium rounded-lg bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Email Icebreaker</CardTitle>
              <CardDescription>Generated based on recent company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Icebreaker
                </h3>
                <p className="text-base text-black leading-relaxed">
                  {result.icebreaker}
                </p>
              </div>
              {result.source && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Source
                  </h3>
                  <p className="text-sm text-gray-600">{result.source}</p>
                </div>
              )}
              {result.company_summary && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Company Summary
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {result.company_summary}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
