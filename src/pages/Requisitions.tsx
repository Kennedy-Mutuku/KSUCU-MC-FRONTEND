import React, { useState, useEffect } from "react";
import axios from "axios";
import UniversalHeader from "../components/UniversalHeader";
import Footer from "../components/footer";
import CollapsibleTermsAndConditions from "../components/CollapsibleTermsAndConditions";
import AssetTransferForm from "../components/AssetTransferForm";
import { generateRequisitionPDF } from "../utils/generateRequisitionPDF";
import styles from "../styles/Requisitions.module.css";

interface RequisitionItem {
  id: string;
  itemName: string;
  quantity: number;
  description?: string;
}

interface RequisitionForm {
  _id?: string;
  id?: string;
  recipientName: string;
  recipientPhone: string;
  items: RequisitionItem[];
  timeReceived: string;
  timeToReturn: string;
  totalAmount: number;
  purpose: string;
  status: "pending" | "approved" | "released" | "returned" | "rejected";
  submittedAt: string;
  releasedBy?: string;
  releasedAt?: string;
  returnedAt?: string;
  comments?: string;
  assetTransfer?: {
    receivedByName: string;
    receivedBySignature: string;
    releasedByName: string;
    releasedBySignature: string;
  };
}

const Requisitions: React.FC = () => {
  const [formData, setFormData] = useState<RequisitionForm>({
    recipientName: "",
    recipientPhone: "",
    items: [{ id: Date.now().toString() + "-1", itemName: "", quantity: 0 }],
    timeReceived: "",
    timeToReturn: "",
    totalAmount: 0,
    purpose: "",
    status: "pending",
    submittedAt: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isToastFading, setIsToastFading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [adminContactPhone, setAdminContactPhone] = useState<string>("");
  const [userRequisitions, setUserRequisitions] = useState<RequisitionForm[]>(
    [],
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const [assetTransferData, setAssetTransferData] = useState<{
    receivedByName: string;
    receivedBySignature: string;
    releasedByName: string;
    releasedBySignature: string;
    date?: string;
  }>({
    receivedByName: "",
    receivedBySignature: "",
    releasedByName: "",
    releasedBySignature: "",
    date: "",
  });
  const backEndURL = "https://ksucu-mc.co.ke";

  // Helper function to show toast with auto-hide
  const showToast = (
    message: string,
    type: "success" | "error",
    duration: number = 3000,
  ) => {
    setIsToastFading(false);
    if (type === "success") {
      setSuccess(message);
      setError("");
    } else {
      setError(message);
      setSuccess("");
    }

    // Start fade out animation before removing
    setTimeout(() => {
      setIsToastFading(true);
    }, duration - 500);

    // Remove message after fade out completes
    setTimeout(() => {
      setSuccess("");
      setError("");
      setIsToastFading(false);
    }, duration);
  };

  useEffect(() => {
    // No authentication required - allow public access
    setIsAuthenticated(true);

    // Set today's date automatically in asset transfer form
    const today = new Date().toISOString().split("T")[0];
    setAssetTransferData((prev) => ({
      ...prev,
      date: today,
    }));

    // Load admin contact phone from API first
    loadAdminContactPhone();

    // Check if user is logged in and load their requisitions
    const userData = localStorage.getItem("user-data");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setCurrentUserName(user.name || user.username || "");
        loadUserRequisitions(user.name || user.username || "");
      } catch (error) {
        console.log("No user data found");
      }
    }

    // Refresh phone number periodically (every 30 seconds)
    const phoneRefreshInterval = setInterval(() => {
      loadAdminContactPhone();
    }, 30000);

    // Refresh when user focuses on the page
    const handleFocus = () => {
      loadAdminContactPhone();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      clearInterval(phoneRefreshInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadAdminContactPhone = async () => {
    try {
      console.log("Loading admin contact phone from API...");
      const response = await axios.get(
        `${backEndURL}/api/settings/admin-contact-phone`,
        {
          withCredentials: true,
          timeout: 5000, // 5 second timeout
        },
      );
      console.log("Admin phone API response:", response.data);
      const phoneNumber = response.data.value || "";

      // Only update state if phone number has changed
      const currentPhone = localStorage.getItem("admin-contact-phone") || "";
      if (phoneNumber !== currentPhone || phoneNumber !== adminContactPhone) {
        console.log(
          "Phone number changed from:",
          currentPhone,
          "to:",
          phoneNumber,
        );
        setAdminContactPhone(phoneNumber);
        // Update localStorage with latest value
        localStorage.setItem("admin-contact-phone", phoneNumber);
        console.log("Admin phone updated successfully:", phoneNumber);
      } else {
        console.log("Phone number unchanged:", phoneNumber);
      }
    } catch (error) {
      console.error("Error loading admin contact phone from API:", error);
      // Fallback to localStorage
      const savedPhone = localStorage.getItem("admin-contact-phone") || "";
      console.log("Using fallback phone from localStorage:", savedPhone);
      if (savedPhone !== adminContactPhone) {
        setAdminContactPhone(savedPhone);
      }

      // Try to load from API again after a delay if initial load failed
      if (!savedPhone) {
        setTimeout(async () => {
          try {
            console.log("Retrying admin phone API call...");
            const retryResponse = await axios.get(
              `${backEndURL}/api/settings/admin-contact-phone`,
              {
                withCredentials: true,
                timeout: 10000,
              },
            );
            const phoneNumber = retryResponse.data.value || "";
            if (phoneNumber && phoneNumber !== adminContactPhone) {
              setAdminContactPhone(phoneNumber);
              localStorage.setItem("admin-contact-phone", phoneNumber);
              console.log("Admin phone loaded on retry:", phoneNumber);
            }
          } catch (retryError) {
            console.error("Retry failed for admin phone:", retryError);
          }
        }, 3000);
      }
    }
  };

  const loadUserRequisitions = async (userName: string) => {
    try {
      const response = await axios.get(`${backEndURL}/api/requisitions`, {
        withCredentials: true,
      });
      const userReqs = response.data.filter(
        (req: RequisitionForm) =>
          req.recipientName.toLowerCase() === userName.toLowerCase(),
      );
      setUserRequisitions(userReqs);
    } catch (error) {
      console.error("Error loading requisitions:", error);
      // Fallback to localStorage
      const allRequisitions = JSON.parse(
        localStorage.getItem("ksucu-requisitions") || "[]",
      );
      const userReqs = allRequisitions.filter(
        (req: RequisitionForm) =>
          req.recipientName.toLowerCase() === userName.toLowerCase(),
      );
      setUserRequisitions(userReqs);
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          itemName: "",
          quantity: 0,
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  const updateItem = (
    id: string,
    field: keyof RequisitionItem,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const downloadRequisitionPDF = (requisition: RequisitionForm) => {
    const requisitionId = requisition.id || requisition._id || "Unknown";
    generateRequisitionPDF(requisition, requisitionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.recipientName ||
      !formData.recipientPhone ||
      !formData.timeReceived ||
      !formData.timeToReturn ||
      !formData.purpose
    ) {
      showToast("❗ Please fill in all required fields", "error");
      return;
    }

    // Filter out empty items and validate only filled items
    const filledItems = formData.items.filter(
      (item) => item.itemName.trim() !== "",
    );

    if (filledItems.length === 0) {
      showToast("❗ Please add at least one item to your requisition", "error");
      return;
    }

    if (filledItems.some((item) => item.quantity <= 0)) {
      showToast("❗ Please enter valid quantities for all items", "error");
      return;
    }

    if (new Date(formData.timeToReturn) <= new Date(formData.timeReceived)) {
      showToast("❗ Return time must be after received time", "error");
      return;
    }

    // Validate signature
    if (!assetTransferData.receivedBySignature) {
      showToast("❗ Please sign the form before submitting", "error");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setLoading(true);

    // Only save filled items
    const filledItems = formData.items.filter(
      (item) => item.itemName.trim() !== "",
    );
    const requisition: RequisitionForm = {
      ...formData,
      items: filledItems,
      submittedAt: new Date().toISOString(),
      status: "pending",
      assetTransfer: assetTransferData,
    };

    try {
      // Save to API
      await axios.post(`${backEndURL}/api/requisitions`, requisition, {
        withCredentials: true,
      });

      // Update user's requisition list if logged in
      if (isLoggedIn) {
        await loadUserRequisitions(currentUserName);
      }

      showToast(
        "✅ Requisition submitted successfully! You will be notified when it's processed.",
        "success",
      );
    } catch (error) {
      console.error("Error submitting requisition:", error);

      // Fallback to localStorage
      requisition.id = Date.now().toString();
      const existingRequisitions = JSON.parse(
        localStorage.getItem("ksucu-requisitions") || "[]",
      );
      existingRequisitions.push(requisition);
      localStorage.setItem(
        "ksucu-requisitions",
        JSON.stringify(existingRequisitions),
      );

      // Dispatch custom event for admin synchronization
      window.dispatchEvent(
        new CustomEvent("requisitionsUpdated", {
          detail: existingRequisitions,
        }),
      );

      // Update user's requisition list if logged in
      if (isLoggedIn) {
        await loadUserRequisitions(currentUserName);
      }

      showToast(
        "✅ Requisition submitted successfully! You will be notified when it's processed.",
        "success",
      );
    }

    setLoading(false);
    setShowConfirmation(false);

    // Reset form
    setFormData({
      recipientName: "",
      recipientPhone: "",
      items: [{ id: Date.now().toString() + "-1", itemName: "", quantity: 0 }],
      timeReceived: "",
      timeToReturn: "",
      totalAmount: 0,
      purpose: "",
      status: "pending",
      submittedAt: "",
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <UniversalHeader />
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            {error || "Checking authentication..."}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <UniversalHeader />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Equipment Requisition</h1>
          <p>Request equipment or items for your events and activities</p>
          {adminContactPhone && (
            <div className={styles.contactInfo}>
              <p>
                <strong>For more information, contact:</strong>{" "}
                <a href={`tel:${adminContactPhone}`}>{adminContactPhone}</a>
              </p>
            </div>
          )}
        </div>

        {/* User Requisition Status */}
        {isLoggedIn && (
          <div className={styles.userStatusSection}>
            <h3>Your Requisition Status</h3>
            {userRequisitions.length === 0 ? (
              <p className={styles.noRequisitions}>
                No requisitions found for {currentUserName}
              </p>
            ) : (
              <div className={styles.statusGrid}>
                <div className={styles.statusColumn}>
                  <h4>Pending</h4>
                  {userRequisitions
                    .filter((req) => req.status === "pending")
                    .map((req) => (
                      <div
                        key={req._id || req.id}
                        className={styles.statusItem}
                      >
                        <strong>
                          {req.items.map((item) => item.itemName).join(", ")}
                        </strong>
                        <span>
                          Submitted:{" "}
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => downloadRequisitionPDF(req)}
                          className={styles.downloadButton}
                          title="Download requisition as PDF"
                        >
                          📥 Download PDF
                        </button>
                      </div>
                    ))}
                </div>
                <div className={styles.statusColumn}>
                  <h4>Approved</h4>
                  {userRequisitions
                    .filter((req) => req.status === "approved")
                    .map((req) => (
                      <div
                        key={req._id || req.id}
                        className={styles.statusItem}
                      >
                        <strong>
                          {req.items.map((item) => item.itemName).join(", ")}
                        </strong>
                        <span>
                          Submitted:{" "}
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => downloadRequisitionPDF(req)}
                          className={styles.downloadButton}
                          title="Download requisition as PDF"
                        >
                          📥 Download PDF
                        </button>
                      </div>
                    ))}
                </div>
                <div className={styles.statusColumn}>
                  <h4>Released</h4>
                  {userRequisitions
                    .filter((req) => req.status === "released")
                    .map((req) => (
                      <div
                        key={req._id || req.id}
                        className={styles.statusItem}
                      >
                        <strong>
                          {req.items.map((item) => item.itemName).join(", ")}
                        </strong>
                        <span>
                          Submitted:{" "}
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => downloadRequisitionPDF(req)}
                          className={styles.downloadButton}
                          title="Download requisition as PDF"
                        >
                          📥 Download PDF
                        </button>
                      </div>
                    ))}
                </div>
                <div className={styles.statusColumn}>
                  <h4>Rejected</h4>
                  {userRequisitions
                    .filter((req) => req.status === "rejected")
                    .map((req) => (
                      <div
                        key={req._id || req.id}
                        className={styles.statusItem}
                      >
                        <strong>
                          {req.items.map((item) => item.itemName).join(", ")}
                        </strong>
                        <span>
                          Submitted:{" "}
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div
            className={`${styles.errorAlert} ${isToastFading ? styles.fadeOut : ""}`}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className={`${styles.successAlert} ${isToastFading ? styles.fadeOut : ""}`}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.requisitionForm}>
          {/* Recipient Information */}
          <div className={styles.section}>
            <h3>Recipient Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="recipientName">Full Name *</label>
                <input
                  id="recipientName"
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recipientName: e.target.value,
                    }))
                  }
                  placeholder="Enter recipient's full name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="recipientPhone">Phone Number *</label>
                <input
                  id="recipientPhone"
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recipientPhone: e.target.value,
                    }))
                  }
                  placeholder="Enter phone number"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Items to Requisition</h3>
            </div>

            <div className={styles.itemsGrid}>
              {/* Grid Header */}
              <div className={styles.gridHeader}>
                <div className={styles.gridHeaderCell}>#</div>
                <div className={styles.gridHeaderCell}>Commodity Name *</div>
                <div className={styles.gridHeaderCell}>Quantity *</div>
                <div className={styles.gridHeaderCell}>Description</div>
                <div className={styles.gridHeaderCell}>Action</div>
              </div>

              {/* Grid Items */}
              {formData.items.map((item, index) => (
                <div key={item.id} className={styles.gridRow}>
                  <div className={styles.gridCell}>
                    <div className={styles.itemNumber}>{index + 1}</div>
                  </div>
                  <div
                    className={styles.gridCell}
                    data-label="Commodity Name *"
                  >
                    <input
                      id={`itemName-${item.id}`}
                      type="text"
                      value={item.itemName}
                      onChange={(e) =>
                        updateItem(item.id, "itemName", e.target.value)
                      }
                      placeholder="e.g., Projector, Microphone, Chairs"
                      autoComplete="off"
                      className={styles.gridInput}
                    />
                  </div>
                  <div className={styles.gridCell} data-label="Quantity *">
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                      autoComplete="off"
                      className={styles.gridInput}
                    />
                  </div>
                  <div className={styles.gridCell} data-label="Description">
                    <input
                      id={`description-${item.id}`}
                      type="text"
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder="Optional details"
                      autoComplete="off"
                      className={styles.gridInput}
                    />
                  </div>
                  <div className={styles.gridCell}>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className={styles.removeButton}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.addButtonContainer}>
              <button
                type="button"
                onClick={addItem}
                className={styles.addButton}
              >
                + Add More Items
              </button>
            </div>
          </div>

          {/* Time and Cost Section */}
          <div className={styles.section}>
            <h3>Schedule & Cost</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="timeReceived">Date Received *</label>
                <input
                  id="timeReceived"
                  type="datetime-local"
                  value={formData.timeReceived}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeReceived: e.target.value,
                    }))
                  }
                  required
                  autoComplete="off"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="timeToReturn">Date Returned *</label>
                <input
                  id="timeToReturn"
                  type="datetime-local"
                  value={formData.timeToReturn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeToReturn: e.target.value,
                    }))
                  }
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="totalAmount">Expected Amount (KES)</label>
                <input
                  id="totalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalAmount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  autoComplete="off"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="purpose">Purpose/Event *</label>
                <input
                  id="purpose"
                  type="text"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      purpose: e.target.value,
                    }))
                  }
                  placeholder="e.g., Sunday Service, Bible Study, Conference"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions Section */}
          <div className={styles.section}>
            <CollapsibleTermsAndConditions
              title="Terms and Conditions"
              summary="Review and accept the equipment requisition terms"
              content={`<div style="text-align: left;">
<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; color: #730051;">Contents</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>Introduction</li>
<li>Equipment Care & Responsibility</li>
<li>Payment & Return Policy</li>
<li>Usage Guidelines</li>
<li>Compliance & Restrictions</li>
<li>Entire Agreement</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; color: #730051;">1. Introduction</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>1.1 These general terms and conditions shall apply to all requisitions made through KSUCU and shall govern your use of the equipment requisition system and related services.</li>
<li>1.2 By submitting a requisition, you accept these general terms and conditions in full. If you disagree with these general terms and conditions or any part of these general terms and conditions, you must not submit a requisition.</li>
<li>1.3 These terms apply to all recipients of equipment from KSUCU and govern the use, care, and return of all equipment borrowed through this requisition system.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; color: #730051;">2. Equipment Care & Responsibility</h4>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">2.1 Damage Liability</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>2.1.1 Any damage to equipment must be reported immediately to the requisition officer.</li>
<li>2.1.2 Costs for repair or replacement will be charged to the requisitioner on or before the agreed return date.</li>
<li>2.1.3 Damage assessments will be conducted by KSUCU personnel upon equipment return.</li>
<li>2.1.4 The requisitioner accepts full liability for damages occurring during the loan period.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">2.2 Loss Policy</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>2.2.1 Full replacement cost will be charged for any lost equipment.</li>
<li>2.2.2 A police report or written explanation of circumstances must be provided within 24 hours of discovering the loss.</li>
<li>2.2.3 No refunds will be issued for lost equipment under any circumstances.</li>
<li>2.2.4 The requisitioner is solely responsible for safeguarding all equipment during the loan period.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">2.3 Condition Check</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>2.3.1 Equipment will be inspected upon return for any damage or wear.</li>
<li>2.3.2 Any damage beyond normal wear will incur charges as determined by KSUCU.</li>
<li>2.3.3 Equipment must be returned in the same condition as when issued, normal wear and tear excepted.</li>
<li>2.3.4 Photographic documentation may be taken to record equipment condition at issue and return.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; color: #730051;">3. Payment & Return Policy</h4>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">3.1 Payment Due</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>3.1.1 All fees associated with equipment rental must be settled on or before the agreed equipment return date.</li>
<li>3.1.2 Failure to pay outstanding fees may result in restricted access to future equipment requisitions.</li>
<li>3.1.3 Payment methods will be as communicated by the KSUCU administration.</li>
<li>3.1.4 Invoices for damages or replacement will be issued within 7 days of equipment assessment.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">3.2 Late Return Penalty</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>3.2.1 Late returns will incur additional daily charges of KES 200 per item per day.</li>
<li>3.2.2 Charges begin to accrue immediately upon the agreed return time.</li>
<li>3.2.3 Extended use may be approved in writing prior to the return date, subject to additional fees.</li>
<li>3.2.4 Repeated late returns may result in future requisition requests being denied.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">3.3 Extended Use</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>3.3.1 Equipment needed beyond the agreed return time requires prior approval from KSUCU administration.</li>
<li>3.3.2 Extensions must be requested before the original return time.</li>
<li>3.3.3 Additional fees will be charged for any extension period.</li>
<li>3.3.4 Extensions are subject to availability and may not be granted if equipment is needed for other events.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; color: #730051;">4. Usage Guidelines</h4>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">4.1 Authorized Use Only</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>4.1.1 Equipment is strictly for the stated purpose on the requisition form and may not be loaned to third parties.</li>
<li>4.1.2 Any unauthorized use of equipment is prohibited and may result in legal action.</li>
<li>4.1.3 Resale or commercial use of borrowed equipment is strictly forbidden.</li>
<li>4.1.4 Equipment must only be used by authorized personnel as named on the requisition form.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">4.2 Proper Handling</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>4.2.1 Equipment must be handled with care according to manufacturer guidelines.</li>
<li>4.2.2 Operators must be trained and competent in the use of all equipment.</li>
<li>4.2.3 Equipment must not be modified, serviced, or repaired by anyone other than authorized KSUCU personnel.</li>
<li>4.2.4 All safety instructions provided with equipment must be strictly observed.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">4.3 Return Condition</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>4.3.1 All items must be returned clean and in proper working condition.</li>
<li>4.3.2 Equipment must be returned to the designated location at the agreed date and time.</li>
<li>4.3.3 Packaging materials and accessories must be returned with the equipment.</li>
<li>4.3.4 Any components, parts, or accessories must be accounted for and returned.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; color: #730051;">5. Compliance & Restrictions</h4>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">5.1 Agreement Binding</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>5.1.1 By submitting this requisition form, you agree to all terms and conditions stated above.</li>
<li>5.1.2 You accept full responsibility for any damage, loss, or late return penalties.</li>
<li>5.1.3 These terms are legally binding and will be enforced by KSUCU.</li>
<li>5.1.4 Failure to comply with these terms may result in legal proceedings.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">5.2 Future Access</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>5.2.1 Failure to comply with these terms may result in restricted access to future equipment requisitions.</li>
<li>5.2.2 Repeated violations may result in permanent denial of requisition privileges.</li>
<li>5.2.3 Non-payment of outstanding charges will prevent future equipment requests.</li>
<li>5.2.4 KSUCU reserves the right to ban any individual or organization from using the requisition system.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; margin-left: 0; color: #730051;">5.3 KSUCU Rights</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>5.3.1 KSUCU reserves the right to refuse equipment requests at any time and for any reason.</li>
<li>5.3.2 KSUCU reserves the right to modify these terms and conditions as necessary.</li>
<li>5.3.3 KSUCU may impose additional requirements or restrictions at its discretion.</li>
<li>5.3.4 KSUCU is not liable for any damages or losses resulting from equipment malfunction or failure.</li>
</ul>

<h4 style="font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; color: #730051;">6. Entire Agreement</h4>
<ul style="margin-left: 20px; line-height: 1.8;">
<li>6.1 These general terms and conditions constitute the entire agreement between you and KSUCU in relation to your use of the equipment requisition system and the provision of equipment.</li>
<li>6.2 These terms supersede and extinguish all previous negotiations, understandings and agreements relating to equipment requisitions.</li>
<li>6.3 By using this requisition system, you accept all terms and conditions outlined above.</li>
</ul>
</div>`}
            />
          </div>

          {/* Asset Transfer Section */}
          <div className={styles.section} style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>
              Asset Transfer Documentation
            </h3>
            <AssetTransferForm
              data={assetTransferData}
              onDataChange={setAssetTransferData}
              isRequesterOnly={true}
            />
          </div>

          <div className={styles.submitSection}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Requisition"}
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className={styles.modalOverlay}>
            <div className={styles.confirmationModal}>
              <h3>Confirm Requisition</h3>
              <div className={styles.confirmationDetails}>
                <p>
                  <strong>Recipient:</strong> {formData.recipientName}
                </p>
                <p>
                  <strong>Items:</strong> {formData.items.length} item(s)
                </p>
                <p>
                  <strong>Purpose:</strong> {formData.purpose}
                </p>
                <p>
                  <strong>Pick-up:</strong>{" "}
                  {new Date(formData.timeReceived).toLocaleString()}
                </p>
                <p>
                  <strong>Return:</strong>{" "}
                  {new Date(formData.timeToReturn).toLocaleString()}
                </p>
                {formData.totalAmount > 0 && (
                  <p>
                    <strong>Amount:</strong> KES{" "}
                    {formData.totalAmount.toFixed(2)}
                  </p>
                )}
              </div>
              <div className={styles.modalActions}>
                <button
                  onClick={confirmSubmission}
                  className={styles.confirmButton}
                >
                  Confirm & Submit
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Requisitions;
