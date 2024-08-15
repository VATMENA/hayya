export interface Permission {
  id: string;
  description: string;
}

export const EDIT_DETAILS: Permission = {
  id: "facility.editDetails",
  description: "Allows the user to edit the details of this facility.",
};
export const EXTENDED_ROSTER: Permission = {
  id: "roster.extendedView",
  description:
    "Allows the user to view full first and last names of other users.",
};
export const ASSIGN_ROLES: Permission = {
  id: "roster.assignRole",
  description: "Allows the user to assign roles to other users.",
};
export const ISSUE_CERTIFICATE: Permission = {
  id: "training.certificate.issue",
  description: "Allows the user to issue certificates.",
};
export const REVOKE_CERTIFICATE: Permission = {
  id: "training.certificate.revoke",
  description: "Allows the user to revoke certificates.",
};
export const MANAGE_RESOURCES: Permission = {
  id: "resource.manage",
  description: "Allows the user to create, edit and delete resources.",
};
export const VIEW_PRIVATE_RESOURCES: Permission = {
  id: "resource.viewPrivate",
  description: "Allows the user to view private resources.",
};
export const ISSUE_SOLO_CERTIFICATES: Permission = {
  id: "training.certificate.issue.solo",
  description: "Allows the user to issue solo certificates.",
};
export const ISSUE_OPENSKIES_CERTIFICATES: Permission = {
  id: "training.certificate.issue.openskies",
  description: "Allows the user to issue OpenSkies certificates.",
};
export const REVOKE_SOLO_CERTIFICATES: Permission = {
  id: "training.certificate.revoke.solo",
  description: "Allows the user to revoke solo certificates.",
};
export const REVOKE_OPENSKIES_CERTIFICATES: Permission = {
  id: "training.certificate.revoke.openskies",
  description: "Allows the user to revoke OpenSkies certificates.",
};
export const MANAGE_EVENTS: Permission = {
  id: "events.manage",
  description: "Allows the user to create and delete events.",
};
export const MANAGE_TV_REQUESTS: Permission = {
  id: "tv.requests.view",
  description:
    "Allows the user to manage Transfer & Visit requests, including approving or rejecting them.",
};

export const MANAGE_TRAINING_PLANS: Permission = {
  id: "training.plans.manage",
  description: "Allows the user to create, edit, and delete training plans.",
};

export const MANAGE_PLAN_ENROLLMENT_REQUESTS: Permission = {
  id: "training.plans.requests.manage",
  description: "Allows the user to approve or deny requests to enroll in training plans."
};

export const TRAIN: Permission = {
  id: "training.train",
  description: "Allows the user to view outstanding training requests, and accept them into sessions."
};

export const PERMISSIONS: Permission[] = [
  EDIT_DETAILS,
  EXTENDED_ROSTER,
  ASSIGN_ROLES,
  ISSUE_CERTIFICATE,
  REVOKE_CERTIFICATE,
  MANAGE_RESOURCES,
  VIEW_PRIVATE_RESOURCES,
  ISSUE_SOLO_CERTIFICATES,
  ISSUE_OPENSKIES_CERTIFICATES,
  REVOKE_SOLO_CERTIFICATES,
  REVOKE_OPENSKIES_CERTIFICATES,
  MANAGE_EVENTS,
  MANAGE_TV_REQUESTS,
  MANAGE_TRAINING_PLANS,
  MANAGE_PLAN_ENROLLMENT_REQUESTS,
  TRAIN
];
