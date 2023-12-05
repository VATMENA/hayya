CREATE TABLE roles
(
    id          VARCHAR NOT NULL PRIMARY KEY,
    name        VARCHAR NOT NULL,
    permissions VARCHAR ARRAY NOT NULL
);

-- Seed it with the roles defined in spec.
INSERT INTO roles (id, name, permissions)
VALUES ('01HGR7FB0YK0D6YMHF4VW7JNFG', 'Developer', '{"system.role.create", "system.role.edit", "system.role.delete",
        "system.feedback.view", "system.feedback.delete", "system.log.view", "system.blacklist.add",
        "system.blacklist.remove", "division.details.edit", "division.vacc.create", "division.vacc.delete",
        "vacc.details.edit", "vacc.event.create", "vacc.event.edit", "vacc.event.delete", "division.resource.create",
        "division.resource.edit", "division.resource.delete", "vacc.resource.create", "vacc.resource.delete",
        "vacc.resource.edit", "division.support", "vacc.support", "vacc.controller.feedback.view",
        "vacc.controller.feedback.forward", "division.announcement.create", "division.announcement.edit",
        "division.announcement.delete", "vacc.announcement.create", "vacc.announcement.edit",
        "vacc.announcement.delete", "mentor.availability.create", "mentor.availability.edit",
        "mentor.availability.delete", "mentor.training.request.accept", "mentor.training.request.reject",
        "mentor.training.notes.add", "mentor.training.notes.edit", "mentor.training.notes.delete",
        "mentor.training.exam", "mentor.training.seminar.create", "mentor.training.seminar.delete",
        "controller.event.booking.create", "controller.event.booking.cancel", "controller.resources.view",
        "controller.event.booking.create", "controller.event.booking.cancel", "controller.availability.add",
        "controller.availability.delete"}');
INSERT INTO roles (id, name, permissions)
VALUES ('01HGRGYFZ7B56PPHK7XWXSMFAC', 'Division Director', '{"system.blacklist.remove", "system.blacklist.add",
        "system.log.view", "system.feedback.delete", "system.feedback.view", "division.details.edit",
        "division.vacc.create", "division.vacc.delete", "division.resource.create", "division.resource.delete",
        "division.resource.edit", "division.support", "division.announcement.create", "division.announcement.edit",
        "division.announcement.delete", "vacc.details.edit", "vacc.event.create", "vacc.event.edit",
        "vacc.event.delete", "vacc.resource.create", "vacc.resource.edit", "vacc.resource.delete", "vacc.support",
        "vacc.controller.feedback.view", "vacc.controller.feedback.forward", "vacc.announcement.create",
        "vacc.announcement.edit", "vacc.announcement.delete", "mentor.availability.create",
        "mentor.availability.delete", "mentor.availability.edit", "mentor.training.request.accept",
        "mentor.training.request.reject", "mentor.training.notes.add", "mentor.training.notes.edit",
        "mentor.training.notes.delete", "mentor.training.exam", "mentor.training.seminar.create",
        "mentor.training.seminar.delete", "controller.event.booking.create", "controller.event.booking.cancel",
        "controller.resources.view", "controller.availability.add", "controller.availability.delete",
        "controller.training.queue.join", "controller.training.queue.leave"}');
INSERT INTO roles (id, name, permissions)
VALUES ('01HGRH84ZKZSQR1NTG3HJTGKRC', 'Division Staff', '{"system.blacklist.remove", "system.blacklist.add",
        "division.details.edit", "division.resource.create", "division.resource.delete", "division.resource.edit",
        "division.support", "division.announcement.create", "division.announcement.edit",
        "division.announcement.delete", "vacc.details.edit", "vacc.event.create", "vacc.event.edit",
        "vacc.event.delete", "vacc.resource.create", "vacc.resource.edit", "vacc.resource.delete", "vacc.support",
        "vacc.controller.feedback.view", "vacc.controller.feedback.forward", "vacc.announcement.create",
        "vacc.announcement.edit", "vacc.announcement.delete", "mentor.availability.create",
        "mentor.availability.delete", "mentor.availability.edit", "mentor.training.request.accept",
        "mentor.training.request.reject", "mentor.training.notes.add", "mentor.training.notes.edit",
        "mentor.training.notes.delete", "mentor.training.exam", "mentor.training.seminar.create",
        "mentor.training.seminar.delete", "controller.event.booking.create", "controller.event.booking.cancel",
        "controller.resources.view", "controller.availability.add", "controller.availability.delete",
        "controller.training.queue.join", "controller.training.queue.leave"}');
INSERT INTO roles (id, name, permissions)
VALUES ('01HGRHDEHDBWBTB9JZ8K0Z03WT', 'vACC Director', '{"vacc.details.edit", "vacc.event.create", "vacc.event.edit",
        "vacc.event.delete", "vacc.resource.create", "vacc.resource.edit", "vacc.resource.delete", "vacc.support",
        "vacc.controller.feedback.view", "vacc.controller.feedback.forward", "vacc.announcement.create",
        "vacc.announcement.edit", "vacc.announcement.delete", "mentor.availability.create",
        "mentor.availability.delete", "mentor.availability.edit", "mentor.training.request.accept",
        "mentor.training.request.reject", "mentor.training.notes.add", "mentor.training.notes.edit",
        "mentor.training.notes.delete", "mentor.training.exam", "mentor.training.seminar.create",
        "mentor.training.seminar.delete", "controller.event.booking.create", "controller.event.booking.cancel",
        "controller.resources.view", "controller.availability.add", "controller.availability.delete",
        "controller.training.queue.join", "controller.training.queue.leave"}');
INSERT INTO roles (id, name, permissions)
VALUES ('01HGRHG38Y0NASG4A3GFS10X0T', 'vACC Staff', '{"vacc.event.create", "vacc.event.edit", "vacc.event.delete",
        "vacc.resource.create", "vacc.resource.edit", "vacc.resource.delete", "vacc.support",
        "vacc.controller.feedback.view", "vacc.controller.feedback.forward", "vacc.announcement.create",
        "vacc.announcement.edit", "vacc.announcement.delete", "mentor.availability.create",
        "mentor.availability.delete", "mentor.availability.edit", "mentor.training.request.accept",
        "mentor.training.request.reject", "mentor.training.notes.add", "mentor.training.notes.edit",
        "mentor.training.notes.delete", "mentor.training.exam", "mentor.training.seminar.create",
        "mentor.training.seminar.delete", "controller.event.booking.create", "controller.event.booking.cancel",
        "controller.resources.view", "controller.availability.add", "controller.availability.delete",
        "controller.training.queue.join", "controller.training.queue.leave"}');
INSERT INTO roles (id, name, permissions)
VALUES ('01HGRHK6HRV2JPY3J414GXH50Q', 'Mentor', '{"mentor.availability.create", "mentor.availability.delete",
        "mentor.availability.edit", "mentor.training.request.accept", "mentor.training.request.reject",
        "mentor.training.notes.add", "mentor.training.notes.edit", "mentor.training.notes.delete",
        "mentor.training.exam", "mentor.training.seminar.create", "mentor.training.seminar.delete",
        "controller.event.booking.create", "controller.event.booking.cancel", "controller.resources.view",
        "controller.availability.add", "controller.availability.delete", "controller.training.queue.join",
        "controller.training.queue.leave"}');
INSERT INTO roles (id, name, permissions)
VALUES ('01HGRHM5BTJDXG8VT7MCZ9B2F6', 'Controller', '{"controller.event.booking.create",
        "controller.event.booking.cancel", "controller.resources.view", "controller.availability.add",
        "controller.availability.delete", "controller.training.queue.join", "controller.training.queue.leave"}');
INSERT INTO roles (id, name, permissions)
VALUES ('01HGRHMZ0JKRAGWG2DG0QH5Q16', 'Member', '{"controller.availability.add", "controller.availability.delete",
        "controller.training.queue.join", "controller.training.queue.leave"}');