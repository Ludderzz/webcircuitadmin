import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // 1. Call Google's PageSpeed Insights API (Lighthouse as a Service)
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY; 
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES&key=${apiKey}`;

    const response = await fetch(psiUrl);
    const data = await response.json();

    const lighthouse = data.lighthouseResult;
    
    // 2. Extract the core metrics
    const report = {
      url: lighthouse.requestedUrl,
      fetchTime: lighthouse.fetchTime,
      scores: {
        performance: lighthouse.categories.performance.score * 100,
        seo: lighthouse.categories.seo.score * 100,
        accessibility: lighthouse.categories.accessibility.score * 100,
        bestPractices: lighthouse.categories['best-practices'].score * 100,
      },
      vitals: {
        lcp: lighthouse.audits['largest-contentful-paint'].displayValue,
        fcp: lighthouse.audits['first-contentful-paint'].displayValue,
        cls: lighthouse.audits['cumulative-layout-shift'].displayValue,
      }
    };

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Lighthouse audit failed" }, { status: 500 });
  }
}