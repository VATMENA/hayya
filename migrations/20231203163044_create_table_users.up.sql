CREATE TABLE users
(
    -- VATSIM CID
    id                      VARCHAR NOT NULL PRIMARY KEY,

    name_first              VARCHAR NOT NULL,
    name_last               VARCHAR NOT NULL,
    name_full               VARCHAR NOT NULL,

    controller_rating_id    INT     NOT NULL,
    controller_rating_short VARCHAR NOT NULL,
    controller_rating_long  VARCHAR NOT NULL,

    pilot_rating_id         INT     NOT NULL,
    pilot_rating_short      VARCHAR NOT NULL,
    pilot_rating_long       VARCHAR NOT NULL,

    region_id               VARCHAR NOT NULL,
    region_name             VARCHAR NOT NULL,

    division_id             VARCHAR NOT NULL,
    division_name           VARCHAR NOT NULL,

    subdivision_id          VARCHAR NULL,
    subdivision_name        VARCHAR NULL,

    role                    VARCHAR NOT NULL REFERENCES roles (id),
    vacc                    VARCHAR NULL REFERENCES vaccs (id)
);