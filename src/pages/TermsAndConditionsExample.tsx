import React from "react";
import CollapsibleTermsAndConditions from "../components/CollapsibleTermsAndConditions";

const TermsAndConditionsExample: React.FC = () => {
  const termsContent = `
Last Updated: January 28, 2026

1. ACCEPTANCE OF TERMS
By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials (information or software) on our application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
- Modifying or copying the materials
- Using the materials for any commercial purpose or for any public display
- Attempting to decompile or reverse engineer any software contained on the application
- Removing any copyright or other proprietary notations from the materials
- Transferring the materials to another person or "mirroring" the materials on any other server

3. DISCLAIMER
The materials on our application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. LIMITATIONS
In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our application, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.

5. ACCURACY OF MATERIALS
The materials appearing on our application could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our application are accurate, complete, or current. We may make changes to the materials contained on our application at any time without notice.

6. MATERIALS AND CONTENT
We do not claim ownership of the materials you provide to our application. However, by submitting materials to our application, you grant us a worldwide, royalty-free, and non-exclusive license to reproduce, modify, adapt, translate, publish, publicly perform, publicly display, and distribute your materials in any media.

7. LIMITATIONS OF LIABILITY
In no case shall our company, its directors, officers, or agents be liable to you for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of this application, even if we have been advised of the possibility of such damages.

8. TERMINATION
We may terminate or suspend your access to our application immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.

9. GOVERNING LAW
These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which our company is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.

10. CHANGES TO TERMS
We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. Your continued use of the application following the posting of revised Terms means that you accept and agree to the changes.

11. CONTACT US
If you have any questions about these Terms and Conditions, please contact us at support@example.com.
  `;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-8">
          Review and accept our terms before using the application
        </p>

        <CollapsibleTermsAndConditions
          title="Terms and Conditions"
          summary="Please review our terms and conditions before proceeding"
          content={termsContent}
        />

        {/* Optional: Alternative with custom styling */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Alternative Styling Example
          </h2>
          <CollapsibleTermsAndConditions
            title="Privacy Policy"
            summary="Learn how we collect and protect your data"
            content={termsContent}
            className="rounded-2xl overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsExample;
