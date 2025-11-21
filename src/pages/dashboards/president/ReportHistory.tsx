import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
const API = import.meta.env.VITE_API_BASE_URL;
const ReportHistory: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API}/api/reports/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch report history:', err);
      }
    };

    fetchReports();
  }, []);


const handleDownloadPDF = async (report: any) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  try {
    // Set a light gray "Report" watermark in background
    pdf.setFontSize(60);
    pdf.setTextColor(220, 220, 220);
    pdf.text('Report', pageWidth / 2, 150, {
      align: 'center',
      angle: 45,
    });

    // Reset styles for content
    pdf.setFontSize(12);
    pdf.setTextColor(33, 33, 33);

    // Load and draw poster image at the top
    const imageUrl = `${API}/uploads/${report.eventPoster}`;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const imgBase64 = reader.result as string;

      // Draw poster
      pdf.addImage(imgBase64, 'JPEG', margin, y, pageWidth - margin * 2, 70);
      y += 80;

      // Title box
      pdf.setFillColor(0, 102, 204); // blue box
      pdf.rect(margin, y, pageWidth - margin * 2, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text(report.eventTitle, pageWidth / 2, y + 7, { align: 'center' });
      y += 18;

      // Reset text styling
      pdf.setFontSize(12);
      pdf.setTextColor(33, 33, 33);

      const lineHeight = 8;

      // Helper to add a bold label and normal text
      const addLine = (label: string, value: string) => {
        pdf.setFont(undefined, 'bold');
        pdf.text(`${label}:`, margin, y);
        const labelWidth = pdf.getTextWidth(`${label}: `);
        pdf.setFont(undefined, 'normal');
        pdf.text(value || 'N/A', margin + labelWidth + 2, y);
        y += lineHeight;
      };

      addLine('Date', report.date);
      addLine('Venue', report.venue);
      addLine('Participants', report.participants);
      addLine('Guest', report.guestName);
      addLine('Staff Coordinator', report.staffCoordinator);
      addLine('Staff Invited', report.staffInvited);

      // Save the PDF
      pdf.save(`${report.eventTitle.replaceAll(' ', '_')}_Report.pdf`);
    };
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    alert('PDF generation failed. Please try again.');
  }
};




  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-4">
        <Link
          to="/dashboard/president"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-neutral-800">My Report History</h1>

      {reports.length === 0 ? (
        <p className="text-neutral-600">No reports submitted yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-neutral-200">
          <table className="min-w-full text-sm text-left text-neutral-700">
            <thead className="bg-neutral-100 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-6 py-3">Event Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Venue</th>
                <th className="px-6 py-3">Participants</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report._id}
                  className="bg-white border-t hover:bg-neutral-50 transition-all"
                >
                  <td className="px-6 py-4">{report.eventTitle}</td>
                  <td className="px-6 py-4">{report.date}</td>
                  <td className="px-6 py-4">{report.venue}</td>
                  <td className="px-6 py-4">{report.participants}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`${API}/uploads/${report.eventPoster}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <FileText size={16} className="mr-1" />
                        View Poster
                      </a>
                      <button
                        onClick={() => handleDownloadPDF(report)}
                        className="text-sm text-blue-500 underline hover:text-blue-700"
                      >
                        Download PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
