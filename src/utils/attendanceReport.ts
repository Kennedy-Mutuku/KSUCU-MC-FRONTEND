import { formatDateTime } from './timeUtils';

export const downloadAttendancePDF = (records: any[], leadershipRole: string, session: any) => {
    if (records.length === 0) return;

    const sortedRecords = [...records].sort((a, b) => {
        const aIsVisitor = a.userType === 'visitor' || (a.regNo && a.regNo.startsWith('VISITOR-'));
        const bIsVisitor = b.userType === 'visitor' || (b.regNo && b.regNo.startsWith('VISITOR-'));
        if (aIsVisitor !== bIsVisitor) return aIsVisitor ? -1 : 1;
        return new Date(a.signedAt).getTime() - new Date(b.signedAt).getTime();
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>KSUCU - ${session?.title || leadershipRole} - Attendance Report</title>
            <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; font-size: 12px; }
                .letterhead-img { width: 100%; max-width: 100%; height: auto; margin: 0 auto 15px; display: block; }
                .header { text-align: center; margin-bottom: 15px; }
                .header h2 { color: #730051; font-size: 18px; margin: 5px 0; font-weight: bold; }
                .session-info { 
                    background: linear-gradient(135deg, #730051, #00C6FF); 
                    color: white; 
                    padding: 8px 15px; 
                    border-radius: 5px; 
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .attendance-table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 10px 0; 
                    font-size: 11px;
                }
                .attendance-table th { 
                    background: linear-gradient(135deg, #730051, #8e1a6b); 
                    color: white; 
                    padding: 8px 4px; 
                    text-align: center; 
                    font-weight: bold; 
                    border: 1px solid #fff;
                }
                .attendance-table td { 
                    padding: 4px; 
                    text-align: center; 
                    border: 1px solid #ddd; 
                    vertical-align: middle;
                }
                .signature-cell img {
                    max-width: 100%;
                    max-height: 26px;
                    object-fit: contain;
                }
                .footer { 
                    margin-top: 15px; 
                    text-align: center; 
                    font-size: 9px; 
                    color: #666; 
                    border-top: 2px solid #730051; 
                    padding-top: 10px; 
                }
            </style>
        </head>
        <body>
            <img src="${window.location.origin}/img/letterhead.png" class="letterhead-img" alt="KSUCU-MC Letterhead" />
            <div class="header"><h2>${session?.title || leadershipRole} - Attendance Report</h2></div>
            <div class="session-info">
                <div><strong>Leader:</strong> ${leadershipRole}</div>
                <div>
                    <strong>Total:</strong> ${sortedRecords.length}<br>
                    <strong>Date:</strong> ${formatDateTime(session?.startTime || new Date(), { format: 'medium' })}
                </div>
            </div>
            <table class="attendance-table">
                <thead>
                    <tr>
                        <th>#</th><th>NAME</th><th>TYPE</th><th>REG NO.</th><th>COURSE</th><th>SIGN TIME</th><th>SIGNATURE</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedRecords.map((r, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td style="text-align: left; font-weight: bold;">${r.userName}</td>
                            <td>${(r.userType === 'visitor' || r.regNo?.startsWith('VISITOR-')) ? 'VISITOR' : 'STUDENT'}</td>
                            <td>${r.regNo?.startsWith('VISITOR-') ? 'N/A' : r.regNo}</td>
                            <td>${r.course || 'N/A'}</td>
                            <td>${formatDateTime(r.signedAt, { format: 'short' })}</td>
                            <td class="signature-cell">
                                ${r.signature?.startsWith('data:image') ? `<img src="${r.signature}" alt="Sign" />` : 'N/A'}
                            </td>
                        </tr>`).join('')}
                </tbody>
            </table>
            <div class="footer"><p>KSUCU-MC | P.O BOX 408-40200, KISII, KENYA</p></div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 100);
    }
};
