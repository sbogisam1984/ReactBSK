'use client';

import React, { useState, useEffect } from 'react';

interface SearchParams {
  loanId?: string;
  pdfCode?: string;
}

async function fetchPdfData(loanId: string, pdfCode: string): Promise<string> {
  const response = await fetch(`/DigitalUnity/api/disclosure?loanId=${loanId}&pdfCode=${pdfCode}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export default function PDFViewer({ searchParams }: { searchParams: SearchParams }) {
  const loanId: string = searchParams.loanId || '';
  const pdfCode: string = searchParams.pdfCode || '';
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadPdf() {
      const url = await fetchPdfData(loanId, pdfCode);
      setPdfUrl(url);
    }
    loadPdf();
  }, [loanId, pdfCode]);

  return (
    <React.Fragment>
      {pdfUrl ? (
        <object height="95%" width="100%" data={pdfUrl} type="application/pdf">
          <p>PDF could not be displayed.</p>
        </object>
      ) : (
        <p>Loading...</p>
      )}
    </React.Fragment>
  );
}
