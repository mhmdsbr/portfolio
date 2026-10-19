"use client";

import ProfileDetailsForm from "./ProfileDetailsForm";
import PasswordChangeForm from "./PasswordChangeForm";
import AddAdminForm from "./AddAdminForm";
import AdminPasswordResetForm from "./AdminPasswordResetForm";
import AdminAccounts from "./AdminAccounts";
import type { ProfileSettingsFormProps } from "./types";

export default function ProfileSettingsForm({
  admin,
  admins,
}: ProfileSettingsFormProps) {
  return (
    <div className="max-w-4xl space-y-6">
      <ProfileDetailsForm admin={admin} />
      <PasswordChangeForm />
      <AdminAccounts admins={admins} admin={admin} />
      <AddAdminForm />
      <AdminPasswordResetForm admins={admins} admin={admin} />
    </div>
  );
}
