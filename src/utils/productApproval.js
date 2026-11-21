export const isProductApproved = (product = {}) => {
  if (!product || typeof product !== "object") return true;

  const approvalValue = product.isApproved ?? product.approved ?? product.is_approved;
  if (typeof approvalValue === "boolean") return approvalValue;
  if (approvalValue != null) {
    const normalizedApproval = String(approvalValue).trim().toLowerCase();
    if (["true", "1", "approved", "active"].includes(normalizedApproval)) return true;
    if (["false", "0", "unapproved", "rejected", "pending", "inactive"].includes(normalizedApproval)) return false;
  }

  const statusValue = product.approvalStatus ?? product.approval_status ?? product.status;
  if (statusValue == null) return true;

  const normalizedStatus = String(statusValue).trim().toLowerCase();
  if (["approved", "active", "published"].includes(normalizedStatus)) return true;
  if (["pending", "rejected", "unapproved", "inactive", "suspended", "draft"].includes(normalizedStatus)) return false;

  return true;
};
