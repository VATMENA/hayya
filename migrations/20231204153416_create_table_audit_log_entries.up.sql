CREATE TABLE audit_log_entries
(
    id VARCHAR NOT NULL PRIMARY KEY,
    timestamp BIGINT NOT NULL,
    actor VARCHAR NOT NULL,
    item VARCHAR NOT NULL,
    before jsonb NULL,
    after jsonb NULL,
    message VARCHAR NOT NULL
);