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
export const RECOMMEND_FOR_QUEUE: Permission = {
  id: "training.queues.recommend",
  description: "Allows the user to recommend students for queues.",
};
export const MANAGE_QUEUES: Permission = {
  id: "training.queues.manage",
  description: "Allows the user to create, edit and delete training queues.",
};
export const TRAIN: Permission = {
  id: "training.train",
  description: "Allows the user to train other users.",
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
export const ASSIGN_MENTORS_TO_REQUEST: Permission = {
  id: "training.request.assign",
  description: "Allows the user to assign other mentors to training requests.",
};
export const SELF_ASSIGN_TO_REQUEST: Permission = {
  id: "training.request.selfassign",
  description: "Allows the user to assign themselves to training requests.",
};
export const DELETE_REQUEST: Permission = {
  id: "training.request.delete",
  description: "Allows the user to delete training requests.",
};

export const PERMISSIONS: Permission[] = [
  EDIT_DETAILS,
  EXTENDED_ROSTER,
  ASSIGN_ROLES,
  ISSUE_CERTIFICATE,
  REVOKE_CERTIFICATE,
  RECOMMEND_FOR_QUEUE,
  MANAGE_QUEUES,
  TRAIN,
  MANAGE_RESOURCES,
  VIEW_PRIVATE_RESOURCES,
  ISSUE_SOLO_CERTIFICATES,
  ISSUE_OPENSKIES_CERTIFICATES,
  REVOKE_SOLO_CERTIFICATES,
  REVOKE_OPENSKIES_CERTIFICATES,
  MANAGE_EVENTS,
  ASSIGN_MENTORS_TO_REQUEST,
  SELF_ASSIGN_TO_REQUEST,
  DELETE_REQUEST,
];
